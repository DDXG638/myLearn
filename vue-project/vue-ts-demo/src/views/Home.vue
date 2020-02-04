<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from '@/components/HelloWorld.vue'

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {}

// export default {
//   name: 'home',
//   components: {
//     HelloWorld
//   }
// }
</script>
