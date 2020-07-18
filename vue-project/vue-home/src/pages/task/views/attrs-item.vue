<template>
    <div>
        <input type="text" :value="value" v-bind="$attrs" />
        <button v-on="$listeners">
            触发事件
        </button>
    </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ['value'],
  methods: {
    showText () {
      console.log('showText-attrs-item')
    }
  }
}
</script>

<style>

</style>
