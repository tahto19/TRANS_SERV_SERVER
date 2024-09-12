<template lang="" style="height:100%">
    <NotificationAlert v-model="notification" />
    <LoadingScreen v-model="load" />
    
    <v-sheet class="px-8 pt-8 pb-3" style="height:100%">
        <router-view @showNotification="showNotification" @loadingScreen="loadingScreen"></router-view>
    </v-sheet>
</template>
<script>
import NotificationAlert from '@/components/utils/Notification.vue'
import LoadingScreen from '@/components/utils/LoadingScreen.vue'

export default {
    emits: ['showNotification', 'loadingScreen'],
    components: {
        NotificationAlert,
        LoadingScreen
    },
    data() {
        return {
            notification: {},
            load: false
        };
    },
    methods: {
        showNotification(e){
            this.notification = e
        },
        loadingScreen(e){
            this.load = e
        }
    },

}
</script>
<style>
iframe {
    overflow: hidden;
}
</style>