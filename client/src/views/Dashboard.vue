<template>
    <Dashboard/>
  </template>
  
  <script>
    import Dashboard from '@/components/dashboard/Default.vue';

    export default {
    emits: ['showNotification'],
    components: {
        Dashboard
    },
};
  </script>
  