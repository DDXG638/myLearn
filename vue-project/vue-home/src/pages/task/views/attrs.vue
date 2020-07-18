<template>
  <div>
      <AttrsItem value="123" @click="showText" placeholder="456465"></AttrsItem>
  </div>
</template>

<script>
import AttrsItem from './attrs-item'

export default {
  components: {
    AttrsItem
  },
  methods: {
    showText () {
      console.log('showText')
    }
  }
}
</script>

<style>

</style>
