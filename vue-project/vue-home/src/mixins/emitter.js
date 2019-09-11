// 参考element-ui
// see，https://github.com/ElemeFE/element/blob/dev/src/mixins/emitter.js

function broadcast(componentName, eventName, params) {
    this.$children.forEach(child => {
        var name = child.$options.componentName;

        if (name === componentName) {
            child.$emit.apply(child, [eventName].concat(params));
        } else {
            broadcast.apply(child, [componentName, eventName].concat([params]));
        }
    });
}

export default {
    methods: {
        dispatch(componentName, eventName, params) {
            var parent = this.$parent || this.$root;
            var name = parent.$options.componentName;


            // 存在父组件 && 组件名称不符合时，就再网上一层寻找。这里 !name 是为了过滤普通标签，这里找的都是自定义组件
            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },
        broadcast(componentName, eventName, params) {
            broadcast.call(this, componentName, eventName, params);
        }
    }
};
