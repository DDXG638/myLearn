<template>
    <!-- TODO，只实现了输入框，单选框、复选框和下拉框没有处理 -->
    <!-- TODO，响应input事件体验不太好，有时需要blur，单选和复选需要change -->
    <!-- 自定义输入框组件，必须绑定value，响应input事件 -->
    <input :type="type" :value="inputValue" @input="inputFn" :placeholder="placeholder">
</template>

<script>
    export default {
        name: "my-input",
        props: {
            value: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'text'
            },
            placeholder: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                inputValue: this.value, // html中不直接绑定props中的value是为了不违反单向数据流原则
            }
        },
        methods: {
            inputFn(event) {
                // 获取最新的数据
                this.inputValue = event.target.value;
                // 通知父组件数据已经改变
                this.$emit('input', this.inputValue);

                // TODO this.$parent写太死了，如果又嵌套了一层，那所有逻辑都会出错
                // 父组件（formItem）派发 数据改变 的事件，及时进行校验
                this.$parent.$emit('validate');
            }
        }
    }
</script>

<style scoped>

</style>