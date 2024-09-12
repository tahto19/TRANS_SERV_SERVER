<template>
  <v-app>
    <!-- <div v-if="!proceed" id="loading-screen">
        <v-progress-circular indeterminate></v-progress-circular>
        Loading screen...
    </div> -->

      <default-bar />

    <default-view />
  </v-app>
</template>

<script>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
  import Cookies from "js-cookie";
  import axios  from 'axios';
  import { useAppStore } from "@/store/app.js";

  export default{
    components: {DefaultBar, DefaultView},
    data(){
      return{
        proceed: false,
        exists: null,
      }
    },
    methods:{
      // async getUserDetails(){
      //   const id = Cookies.get("UID");
      //   const config = {
      //     url: "https://ai-insight.etpbx.com/general-info/user/get/" + id,
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   };

      //   const res = await axios.request(config);
      //   if(res.data.response){
      //     this.$cookies.set('_org', res.data.details.organization_id, '1d');
      //     this.$cookies.set('_aksis_code', JSON.stringify(res.data.details.user_access), '1d');
      //     this.proceed = true;
      //     useAppStore().updateUserData(res.data.details)
      //   }
      // }
    },
    // created(){
    //   const userData = useAppStore().userData
    //   if(!userData){
    //      this.getUserDetails()
    //   }
    // },
    mounted(){
      this.proceed = false;
      // this.getUserDetails()
    },
    beforeRouteEnter(to, from, next){
      // Check if a cookie exists
      const exists = Cookies.get("UID");
      if(!exists){
        next("/login");
      } else {
        next();
      }
    }
  }
</script>
