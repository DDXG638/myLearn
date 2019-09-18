class KVue {
    constructor(options) {
        this.$data = options.data; // 保存data选项
        this.observe(this.$data); // 执行响应式

        this.$options = options;
        
        // 执行编译操作
        this.$compile = new Compile(options.el, this);
    }


    observe(value){
        // 递归的终止条件
        if (!value || typeof value !== 'object' ) {
            return;
        }
        
        // 遍历data选项
        Object.keys(value).forEach(key => {
            // 为每一个key定义响应式
            this.defineReactive(value, key, value[key]);
            // 为vue的data做属性代理，方便使用vm.xxx的方式获取数据
            this.proxyData(key);
        })
    }

    defineReactive(obj, key, val) {
        this.observe(val); // 递归查找嵌套属性

        // 创建Dep依赖管理器，每一个数据对应一个Dep，Dep中存放着至少一个Watcher（更新执行者）
        const dep = new Dep();
        console.log(key + '---defineReactive');

        // 为data对象定义属性
        Object.defineProperty(obj, key, {
            enumerable: true, // 可枚举
            configurable: true, // 可修改或删除
            get() {
                // 在compile.js解析指令中，每创建一个Watcher对象就会往对应key的Dep中添加一个Watcher实例
                // 页面中有多少个地方使用了这个数据，就存在多少个这个数据的Watcher，一个Watcher对应一个地方的更新
                // 这里的Dep.target是暂时存放一个Watcher实例的地方，addDep之后会有将Dep.target置空的操作，防止重复addDep
                Dep.target && dep.addDep(Dep.target);
                
                return val;
            },
            set(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                // console.log('数据发生变化！');
                // 数据变化了 通知 依赖管理器 进行视图更新操作。
                dep.notify();
            }
        })
    }

    proxyData(key) {
        // TODO:还要处理嵌套数据，如this.$data.foo.bar 应该代理成 this.foo.bar，下面的代码没有处理就代理成this.bar了，显然是不对的

        // 代理数据，就是将 this.$data 的数据放到一份到 this 中，get 和 set 方法操作的都是 this.$data 中的数据
        // 目的是方便调用，使用 this.xxx 就可以访问 this.$data.xxx 的数据了
        Object.defineProperty(this, key, {
            get(){
                return this.$data[key];
            },
            set(newVal){
                this.$data[key] = newVal;
            },
        });
    }

}

// 依赖管理器：负责将视图中所有依赖收集管理，包括依赖添加和通知
class Dep {
    constructor() {
        // deps里面存放的是Watcher的实例，一个Watcher实例就对应一个数据的更新操作。
        // 页面中有多个地方引用了这个数据的话，就会有多个不同的Watcher实例，分别对应不同的更新操作
        this.deps = []; 
    }
    addDep(dep) {
        this.deps.push(dep);
    }
    // 通知所有watcher执行更新操作
    notify() {
        this.deps.forEach(dep => {
            dep.update();
        })
    }
}

// Watcher: 具体的更新执行者
class Watcher {
    /**
     * Watcher 构造函数
     * @param {*} vm 就是 Vue实例
     * @param {*} key 数据的key
     * @param {*} cb 更新操作方法
     */
    constructor(vm, key, cb) {
        // TODO:需要对key做而的处理，不然获取不到数据。这里的key可能是对象嵌套的值，foo.bar 等
        console.log(key + '---newWatcher');
        this.vm = vm;
        this.key = key;
        this.cb = cb;

        // 将来new一个监听器时，将当前Watcher实例附加到Dep.target
        Dep.target = this; // 将当前Watcher实例临时保存到Dep.target上面
        this.vm[this.key]; // 显示地获取数据，使得执行该函数的get方法，目的是将当前Watcher实例添加到对应的 Dep 实例中。
        Dep.target = null; // 清空Dep.target，防止重复往 Dep 实例中添加 watcher
    }

    // 更新操作
    update() {
        // console.log('视图更新啦！');
        // 使用call是为了使上下文指向Vue实例，在方法中也方便使用this访问vue实例的数据
        this.cb.call(this.vm, this.vm[this.key]);
    }
}