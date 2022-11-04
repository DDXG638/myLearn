<script setup lang="ts">
import { ref } from 'vue'
import commonStyleModule from '../style/common.module.scss'

console.log('commonStyleModule', commonStyleModule)

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
  <!-- CSS Modules 的用法 CSS Modules 的使用场景： -->
  <div :class="[commonStyleModule['common-box']]">
    <p :class="commonStyleModule['title']">我是标题 <span>123</span></p>
    <p :class="commonStyleModule['subtitle']">我是副标题</p>
  </div>
</template>

<style lang="scss" scoped>
.read-the-docs {
  color: $theme-color;
  text-decoration: line-through;
  text-shadow: #FC0 1px 0 10px;
}
</style>
