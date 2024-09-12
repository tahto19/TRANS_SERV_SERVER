<template lang="">
  <v-card class="rounded-0">
    <v-card-title class="py-3" align="center"
      ><a href="/login"
        ><v-img src="@/assets/img/logo.png" height="34"></v-img></a
    ></v-card-title>
  </v-card>
  <div class="content-wrapper" style="min-height: 607.225px">
    <div class="content pt-14 mt-10">
      <v-row class="d-flex justify-center align-center">
        <v-col cols="10" md="3" sm="6" style="position: relative">
          <div class="login-icon">
            <v-icon icon="mdi-account"></v-icon>
          </div>
          <v-form
            class="border px-6 pt-14 pb-10 rounded"
            style="background: #f8f9fa !important"
            @submit.prevent="login"
          >
            <v-text-field
            v-on:keyup.enter="login()"
              v-model="details.email"
              placeholder="Email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              density="compact"
              :rules="rule.required"
            ></v-text-field>
            <v-text-field
            v-on:keyup.enter="login()"
              v-model="details.password"
              placeholder="Password"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              density="compact"
              type="password"
              :rules="rule.required"
            ></v-text-field>

            <v-row>
              <v-col cols="12" md="6">
                <v-btn type="submit" class="mt-2" color="info">
                  <v-icon icon="mdi-logout"></v-icon>&nbsp; Login
                </v-btn>
              </v-col>
              <v-col cols="12" md="6"></v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </div>
  </div>
  <!-- <div>
        <v-card class="elevation-0" width="300px">
            <v-card-text>
                <v-icon icon="mdi-account"></v-icon>
            </v-card-text>
        </v-card>
    </div> -->
</template>
<script>
import FormMixin from "@/mixin/FormMixin";
import axios from "axios";
import CryptoJS  from "crypto-js";

import Cookies from "js-cookie";

export default {
  mixins: [FormMixin],
  data() {
    return {
      rememberMe: false,
      details: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      try {
        const pass = CryptoJS.AES.encrypt(this.details.password, this.details.email).toString();
        console.log(pass)
        const data = {
          username: this.details.email,
          password: this.details.password
        }
        const config = {
          url: "https://ai-insight.etpbx.com/general-info/user/login",
          method: "POST",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
        };

        const res = await axios.request(config);
        if(res.data.response){
          // Set a cookie
          this.$cookies.set('UID', res.data.details.id, '1d');
          this.$router.push("/");
        }
        console.log(res)
        // return res;
      } catch (error) {
        console.log(error.message);
        return {
          result: "error",
          error: error.message,
        };
      }
      // let data = {
      //   response: "success",
      //   data: { user_id: 1, fullname: "Justin Carl" },
      // };
      // console.log(data.response == "success")
      // if (data.response == "success") {
      //   Cookies.set("UUID", "3", { expires: 1 });

      //   if (this.rememberMe) {
      //     localStorage.removeItem("rMe");
      //     localStorage.setItem("rMe", JSON.stringify(data.data));
      //   } else {
      //       localStorage.setItem("rMe", JSON.stringify(data.data));
      //   }

      //   this.$nextTick(() => {
      //     this.$router.push("/");
      //   });
      // }
    },
  },
  mounted() {
    const exists = Cookies.get("UID");
    if (exists) {
      this.rememberMe = true;
      this.$router.push("/");

    }

    // console.log(this.$cookies)
  },
};
</script>
<style>
.login-icon {
  height: 4em;
  width: 4em;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -32%);
}

.login-icon .v-icon {
  background-color: rgb(33, 150, 243);
  color: #fff;
  font-size: 50px;
  padding: 33px;
  border-radius: 50%;
}
</style>
