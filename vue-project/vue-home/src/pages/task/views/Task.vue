<template>
    <section>
        Task Page

        <p>自定义组件</p>

        <my-form :model="formData" :rule="rule" ref="myForm">
            <my-form-item label="用户名" prop="userName">
                <my-input v-model="formData.userName" name="email" placeholder=" 请输入邮箱" type="email"></my-input>
            </my-form-item>

            <my-form-item label="密码" prop="password">
                <my-input v-model="formData.password" name="password" placeholder=" 请输入密码" type="password"></my-input>
            </my-form-item>

            <my-form-item>
                <span @click="submitForm">提交</span>
            </my-form-item>
        </my-form>

        <!--<p>inputValue: {{formData}}</p>-->
    </section>
</template>

<script>
import MyForm from '@/components/task/form/MyForm.vue'
import MyFormItem from '@/components/task/form/MyFormItem.vue'
import MyInput from '@/components/task/form/MyInput.vue'

export default {
  name: 'Task',
  components: {
    [MyForm.name]: MyForm,
    [MyInput.name]: MyInput,
    [MyFormItem.name]: MyFormItem
  },
  data () {
    return {
      formData: {
        userName: '',
        password: ''
      },
      rule: {
        userName: [
          {
            type: 'string',
            required: true,
            message: '用户名必填'
          }, {
            min: 5,
            max: 20,
            message: '邮箱长度为5-20个字符'
          }, {
            /* eslint-disable-next-line */
            pattern: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
            message: '请输入正确的邮箱格式'
          }
        ],
        password: [
          {
            required: true,
            message: '密码必填'
          }, {
            pattern: /^.{6,32}$/,
            message: '密码长度为6到32个字符'
          }, {
            validator (rule, value, callback) {
              // 遍历密码，判断每个字符的ASCII值是否在[33,126]
              let arr = value.split('')

              return !arr.some(function (val) {
                let code = val.charCodeAt(0)
                return code < 33 || code > 126
              })
            },
            message: '密码不能包含特殊字符'
          }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      // 提交前进行最后一波校验，所有输入框都校验成功才验证通过
      this.$refs.myForm.validate(result => {
        if (result) {
          alert('验证通过')
        } else {
          alert('验证失败')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
