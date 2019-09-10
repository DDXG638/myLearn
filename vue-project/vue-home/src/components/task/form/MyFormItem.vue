<template>
    <section>
        <!-- formItem 负责做校验 和 显示错误信息 -->
        <label v-if="label">{{label}}:</label>
        <div>
            <slot></slot>
            <p v-show="validateStatus === 'error'" class="error-text">{{errorText}}</p>
        </div>
    </section>
</template>

<script>
    import schema from 'async-validator';

    export default {
        name: "my-form-item",
        props: ['prop', 'label'],
        // 获取祖先组件注入的数据
        inject: ['model', 'rule'],
        data() {
            return {
                validateStatus: '',
                errorText: ''
            }
        },
        methods: {
            validate() {
                // https://github.com/yiminghe/async-validator
                // 根据 async-validator 官方文档，先构建descriptor
                let descriptor = {
                    [this.prop]: this.rule[this.prop]
                };

                return new Promise(resolve => {
                    // 创建 async-validator 实例
                    let validator = new schema(descriptor);

                    validator.validate({[this.prop]: this.model[this.prop]}).then(() => {
                        this.validateStatus = '';
                        resolve(true);
                        // validation passed or without error message
                    }).catch(({ errors, fields }) => {
                        this.validateStatus = 'error';
                        this.errorText = errors[0].message;
                        // errors[0].field 校验的字段（prop值）
                        /*console.log('errors', errors);
                        console.log('fields', fields);*/
                        resolve(false);

                        // return handleErrors(errors, fields);
                    })
                })
            }
        },
        mounted() {
            // 如果需要验证，就向 MyForm 发送添加验证的通知
            if (this.prop) {
                // TODO this.$parent写太死了，如果又嵌套了一层，那所有逻辑都会出错
                this.$parent.$emit('addFormItem', this);
            }
        },
        created() {
            // 初始化的时候就监听 数据更新通知，并且做校验
            this.$on('validate', this.validate);
        }
    }
</script>

<style scoped>
.error-text {
    color: red;
}
</style>