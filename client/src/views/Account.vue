<template>
    <Account />
  </template>
  
  <script>
    import Account from '@/components/account/Default.vue';

    export default {
    emits: ['showNotification'],
    components: {
        Account
    },
};
  </script>
  