<template>
    <form>
        <slot></slot>
    </form>
</template>

<script>
    export default {
        name: "my-form",
        componentName: 'my-form',
        // 注入 model数据 和 验证rule数据，方便后代组件处理
        provide() {
            return {
                model: this.model,
                rule: this.rule
            }
        },
        props: {
            model: {
                type: Object,
                required: true
            },
            rule: {
                type: Object
            }
        },
        data() {
            return {
                fields: []
            }
        },
        methods: {
            /**
             * 提供给 MyForm 组件外部调用的校验所有输入框的方法
             * @param cb
             * @returns {Promise<any[] | never>}
             */
            validate(cb) {
                // 所有输入框的校验方法
                let validateTasks = this.fields.map(item => item.validate())

                console.log('validateTasks', validateTasks);

                // 执行所有输入框的校验方法
                return Promise.all(validateTasks).then(results => {
                    console.log('results', results);
                    // 只要数组中有一个值为false都返回false
                    cb(!results.some(result => !result));
                })
            }
        },
        created() {
            // 将要验证 输入框 都收集起来，方便提交的时候做 最后校验
            this.$on('addFormItem', formItem => {
                console.log('formItem', formItem);
                this.fields.push(formItem)
            })
        }
    }
</script>

<style scoped>

</style>