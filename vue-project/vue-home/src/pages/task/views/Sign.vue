<template>
    <section @click="showToast('123')">
        Sign Page djaskflj

        <!--<mt-button type="default">default</mt-button>
        <mt-button type="primary">primary</mt-button>
        <mt-button type="danger">danger</mt-button>-->
    </section>
</template>

<script>
    export default {
        name: "sign",
        methods: {
            showToast(text) {
                alert(text);
            }
        }
    }
</script>

<style scoped>

</style>