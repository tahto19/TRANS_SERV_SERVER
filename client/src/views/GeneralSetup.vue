<template>
    <GeneralSetup/>
  </template>
  
  <script>
    import GeneralSetup from '@/components/general_setup/Default.vue';

    export default {
    emits: ['showNotification'],
    components: {
        GeneralSetup
    },
};
  </script>
  