<template>
    <!-- TODO，只实现了输入框，单选框、复选框和下拉框没有处理 -->
    <!-- TODO，响应input事件体验不太好，有时需要blur，单选和复选需要change
         增加blur事件的监听，并且像input事件一样通知FormItem组件校验。
         校验规则rule中也要增加响应的字段标识这个输入框是在什么情况先进行校验的，是blur还是input还是change等等。。。
         FormItem组件就要根据校验规则rule中的字段监听对应事件进行校验。

         只是我的想法，我还没有付诸实践 /(ㄒoㄒ)/~~
    -->
    <!-- 自定义输入框组件，必须绑定value，响应input事件 -->
    <input :type="type" :value="inputValue" @input="inputHandle" @blur="blurHandle" :placeholder="placeholder">
</template>

<script>
import emitter from '@/mixins/emitter'

export default {
  name: 'my-input',
  componentName: 'my-input',
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
  mixins: [emitter],
  data () {
    return {
      inputValue: this.value // html中不直接绑定props中的value是为了不违反单向数据流原则
    }
  },
  methods: {
    inputHandle (event) {
      // 获取最新的数据
      this.inputValue = event.target.value
      // 通知组件数据已经改变
      this.$emit('input', this.inputValue)

      // this.$parent写太死了，如果又嵌套了一层，那所有逻辑都会出错
      // 父组件（formItem）派发 数据改变 的事件，及时进行校验
      // this.$parent.$emit('validate');

      // 改进：封装了dispatch，一层一层地向上找对应的组件
      this.dispatch('my-form-item', 'validate')
    },
    blurHandle (event) {
      console.log('blurHandle', event.target.value)
    }
  }
}
</script>

<style scoped>

</style>
