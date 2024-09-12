<template>
        <NotificationAlert v-model="notification" />

    <v-sheet class="px-8 pt-8 pb-3">
        <router-view @showNotification="showNotification"></router-view>
    </v-sheet>
</template>

<script>
import NotificationAlert from '@/components/utils/Notification.vue'

export default {
    emits: ['showNotification'],
    components: {
        NotificationAlert,
    },
    data() {
        return {
            notification: {},
        };
    },
    methods: {
        showNotification(e){
            this.notification = e
        },
    },

}
</script>
