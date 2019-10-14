// 扫描模板中所有依赖创建更新函数和watcher
class Compile {
  // el是宿主的选择器
  // vm当前Vue实例
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = document.querySelector(el); // 默认选择器

    if (this.$el) {
      // 将dom节点转换为Fragment提高执行效率
      this.$fragment = this.node2Fragment(this.$el);
      // 执行编译，模板解析
      this.compile(this.$fragment);
      // 将生成的结果追加至宿主元素
      this.$el.appendChild(this.$fragment);
    }
  }
  node2Fragment(el) {
    // 创建一个新的Fragment
    const fragment = document.createDocumentFragment();
    let child;
    // 将原生节点移动至fragment
    while ((child = el.firstChild)) {
      // appendChild是移动操作，他会移动el.firstChild元素，类似剪切一样。
      // 所以经过这个操作之后，el中的元素就全部被移动走了，变成空元素
      fragment.appendChild(child);
    }
    return fragment;
  }

  // 编译指定片段
  compile(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      // 判断node类型，做响应处理
      if (this.isElementNode(node)) {
        // 元素节点要识别 k-xx指令 或 @xx事件绑定
        this.compileElement(node);
      } else if (
        this.isTextNode(node) &&
        /\{\{(.*)\}\}/.test(node.textContent)
      ) {
        // 文本节点，只关心{{xx}}格式
        this.compileText(node, RegExp.$1); // RegExp.$1匹配{{}}内的内容
      }
      // 遍历可能存在的子节点
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }

  // 编译元素节点
  compileElement(node) {
    // console.log("编译元素节点");

    // <div k-text="test" @click="onClick">
    const attrs = node.attributes; // 获取所有属性进行遍历
    Array.from(attrs).forEach(attr => {
      // 规定指令 k-text="test" @click="onClick"
      const attrName = attr.name; // 属性名k-text
      const exp = attr.value; // 属性值test
      console.log('属性值test', exp); // 会获取到这种对象嵌套值foo.bar，后面需要对exp进行额外的处理
      if (this.isDirective(attrName)) {
        // 指令
        const dir = attrName.substr(2); // text，
        this[dir] && this[dir](node, this.$vm, exp);
      } else if (this.isEventDirective(attrName)) {
        // 事件
        const dir = attrName.substr(1); // click
        this.eventHandler(node, this.$vm, exp, dir);
      }
    });
  }
  compileText(node, exp) {
    //
    // console.log("编译文本节点");
    this.text(node, this.$vm, exp);
  }

  /**
   * 根据nodeType判断节点类型
   * @param {节点} node 
   */
  isElementNode(node) {
    return node.nodeType == 1; //元素节点
  }

  isTextNode(node) {
    return node.nodeType == 3; //文本节点
  }

  isDirective(attr) {
    return attr.indexOf("k-") == 0;
  }

  isEventDirective(dir) {
    return dir.indexOf("@") == 0;
  }

  // 文本更新
  text(node, vm, exp) {
    this.update(node, vm, exp, "text");
  }

  // 处理html
  html(node, vm, exp) {
    this.update(node, vm, exp, "html");
  }

  // 双向绑定
  model(node, vm, exp) {
    this.update(node, vm, exp, "model");

    // 双绑还要处理视图对模型的更新
    node.addEventListener("input", e => {
      vm[exp] = e.target.value;
      // val = e.target.value;
    });
  }

  // 更新
  update(node, vm, exp, dir) {
    let updaterFn = this[dir + "Updater"];
    
    // 这里的exp可能是对象嵌套的值，foo.bar 等，需要处理后才能 使用vm[exp]获取对应的内容
    // 执行更新操作，这里的更新是初始化的更新，就是初始化的时候将vm.$data中的数据更新到页面中
    updaterFn && updaterFn(node, vm[exp]); 

    // 创建这个数据的一个更新实例，第三个参数就是具体的更行操作。
    // 创建之后，数据的改变就调用这里的更新操作了
    new Watcher(vm, exp, function(value) {
      updaterFn && updaterFn(node, value);
    });
  }

  textUpdater(node, value) {
    node.textContent = value;
  }

  htmlUpdater(node, value) {
    node.innerHTML = value;
  }

  modelUpdater(node, value) {
    node.value = value;
  }

  eventHandler(node, vm, exp, dir) {
    // dir是事件类型
    // 在vm.$options.methods找到对应的事件函数
    let fn = vm.$options.methods && vm.$options.methods[exp];
    if (dir && fn) {
      // 绑定事件，使用bind将上下文指向Vue实例，方便再方法中使用this来使用Vue实例中的数据
      node.addEventListener(dir, fn.bind(vm), false);
    }
  }
}
