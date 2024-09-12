<template lang="">
    <div v-if="show" id="loading-screen2">
        <v-progress-circular indeterminate color="white" :size="58" :width="8"></v-progress-circular>
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