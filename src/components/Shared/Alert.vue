<template>
    <v-alert dense type="error" dismissible prominent @input="onClose" :value="true">
        {{ text }}
    </v-alert>
</template>

<script>
    export default {
        name: "Alert",
        props: ['text'],
        data () {
            return {

            }
        },
        methods: {
            onClose(){
               this.$emit('dismissed')
            }
        }
    }
</script>

<style scoped>

</style>