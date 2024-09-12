<template lang="">
    <NotificationAlert v-model="notification" />
    <LoadingScreen v-model="load" />
    <LoadingScreen2 v-model="load2" />

    <v-sheet class="px-8 pt-8 pb-3">
        <router-view :key="$route.fullPath" @showNotification="showNotification" @loadingScreen="loadingScreen" @loadingScreen2="loadingScreen2"></router-view>
    </v-sheet>
</template>
<script>
import NotificationAlert from '@/components/utils/Notification.vue'
import LoadingScreen from '@/components/utils/LoadingScreen.vue'
import LoadingScreen2 from '@/components/utils/LoadingScreen2.vue'

export default {
    emits: ['showNotification', 'loadingScreen', 'loadingScreen2'],
    components: {
        NotificationAlert,
        LoadingScreen,
        LoadingScreen2
    },
    data() {
        return {
            notification: {},
            load: false,
            load2: false
        };
    },
    methods: {
        showNotification(e){
            this.notification = e
        },
        loadingScreen(e){
            this.load = e
        },
        loadingScreen2(e){
            this.load2 = e
        }
    },

}
</script>
<style lang="">
    
</style>