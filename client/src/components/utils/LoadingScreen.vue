<template lang="">
    <div v-if="show" id="loading-screen">
        <v-progress-circular indeterminate></v-progress-circular>
        Loading screen...
    </div>
</template>
<script>
export default {
    props: ['modelValue'],
    emits: ['update:modelValue'],
    data(){
        return{
            show: false,
        }
    },
    watch: {
        modelValue(value){
            this.show = value;
        }
    }

}
</script>
<style lang="">
    
</style>