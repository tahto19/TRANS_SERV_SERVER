<template lang="">
    <br>
    <div class="mt-10 d-flex justify-center align-center flex-column">
        <h1>403</h1>
        <h2>Access Denied</h2>
        <h3>User ID {{uid}}</h3>
        <div class="text">
            <p>Sorry, but you don't have permission to access this page. Speak to your administrator to unlock this page. Thank you!</p>
        </div>
        <v-btn class="mt-10" color="warning" @click="_redirect()"><v-icon class="mr-3">mdi-arrow-left</v-icon> Back to login</v-btn>
    </div>
</template>
<script>
import Cookies from "js-cookie";

export default {
    data(){
        return{
            uid: 0,
        }
    },
    methods:{
        _redirect(){
            this.$router.push("/login")
        }
    },
    mounted(){
        const uid = Cookies.get("UID");
        this.uid = uid
    }
}
</script>
<style >
h1{
    font-size: 110px;
    color: #5535e3;
}
h2{
    font-size: 50px;
    color: #5535e3;
}

h3{
    font-size: 40px;
    color: #5535e3;
}

.text p {
    font-size: 25px;
    padding: 10px 80px;
    color: #c6bcf6;
}
</style>