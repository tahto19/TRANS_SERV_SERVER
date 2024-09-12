<template>
    <Reports/>
  </template>
  
  <script>
    import Reports from '@/components/reports/Default.vue';

    export default {
    emits: ['showNotification'],
    components: {
      Reports
    },
};
  </script>
  