<template lang="">
  <NotificationAlert v-model="notification" />
  <div v-if="loading_tag" id="loading-screen2">
    <v-progress-circular indeterminate></v-progress-circular>
    Loading screen...
  </div>
  <div class="bootstrap-inside" style="background: #000; height: 100%">
    <div id="random" style="height: 100%">
      <div v-if="!loaded" class="loader-wrapper">
        <span class="loader"><span class="loader-inner"></span></span>
      </div>

      <div
        :class="{ 'is-active': windowWith <= 480 }"
        class="xdarkblue"
        style="padding: 0 10px"
      >
        <div class="container-fluid bg">
          <div class="row" style="width: 100%; margin-left: 0">
            <div class="col-12 col-md-6 left" style="min-width: 734.6px">
              <section class="forms-section" style="overflow: hidden">
                <h1 class="section-title">
                  <img
                    src="../assets/login_assets/images/insights_logo.png"
                    class="logo"
                    alt="Logo"
                  /><br />
                  Generative AI Customer Service Analytics
                </h1>
                <p class="text-white lit pr-3">
                  Elisha Insights utilises Artificial Intelligence to provide
                  real-time evaluations of customer service interactions for
                  your business. Leveraging the latest advancements in Large
                  Language Models and Natural Language Processing, Elisha
                  Insights is the most sophisticated customer service analytics
                  platform in the market today.
                </p>

                <div v-if="windowWith <= 480" class="mobile-mode">
                  <br />
                  <v-tabs v-model="tab" color="#fff">
                    <v-tab :value="1">LOGIN</v-tab>
                    <v-tab :value="2">REQUEST A DEMO</v-tab>
                  </v-tabs>

                  <v-window v-model="tab">
                    <v-window-item :value="1">
                      <div class="form-wrapper is-active">
                        <form class="form2" @submit.prevent="login">
                          <fieldset>
                            <div class="input-block">
                              <label for="login-email">Username</label>
                              <input
                                v-model="details.email"
                                id="login-email"
                                type="text"
                                required
                              />
                            </div>
                            <div class="input-block">
                              <label for="login-password">Password</label>
                              <input
                                v-model="details.password"
                                id="login-password"
                                type="password"
                                required
                              />
                            </div>
                          </fieldset>
                          <button type="submit" class="btn-login">Login</button>
                        </form>
                      </div>
                    </v-window-item>

                    <v-window-item :value="2">
                      <div class="form-wrapper is-active">
                        <form class="form2" @submit.prevent="requestDemo">
                          <fieldset>
                            <!-- <legend>
                        Please, enter your email, password and password
                        confirmation for sign up.
                      </legend> -->
                            <div class="input-block">
                              <label for="signup-password">Name</label>
                              <input
                                id="signup-name"
                                type="password"
                                required
                              />
                            </div>
                            <div class="input-block">
                              <label for="signup-email">Company Email</label>
                              <input id="signup-email" type="email" required />
                            </div>
                          </fieldset>
                          <button type="submit" class="btn-signup">Send</button>
                        </form>
                      </div>
                    </v-window-item>
                  </v-window>
                </div>

                <div v-else class="forms">
                  <div
                    class="form-wrapper"
                    :class="{ 'is-active': login_active }"
                    @click="_activeClass('login')"
                  >
                    <button type="button" class="switcher switcher-login">
                      Login
                      <span class="underline"></span>
                    </button>
                    <form class="form form-login" @submit.prevent="login">
                      <fieldset>
                        <legend>
                          Please, enter your username and password for login.
                        </legend>
                        <div class="input-block">
                          <label for="login-email">Username</label>
                          <input
                            v-model="details.email"
                            id="login-email"
                            type="text"
                            required
                          />
                        </div>
                        <div class="input-block">
                          <label for="login-password">Password</label>
                          <input
                            v-model="details.password"
                            id="login-password"
                            type="password"
                            required
                          />
                        </div>
                      </fieldset>
                      <button type="submit" class="btn-login">Login</button>
                    </form>
                  </div>
                  <div
                    class="form-wrapper"
                    :class="{ 'is-active': !login_active }"
                    @click="_activeClass('demo')"
                  >
                    <button type="button" class="switcher switcher-signup">
                      Request A Demo
                      <span class="underline"></span>
                    </button>
                    <form
                      class="form form-signup"
                      @submit.prevent="requestDemo"
                    >
                      <fieldset>
                        <!-- <legend>
                        Please, enter your email, password and password
                        confirmation for sign up.
                      </legend> -->
                        <div class="input-block">
                          <label for="signup-password">Name</label>
                          <input id="signup-name" type="password" required />
                        </div>
                        <div class="input-block">
                          <label for="signup-email">Company Email</label>
                          <input id="signup-email" type="email" required />
                        </div>
                      </fieldset>
                      <button type="submit" class="btn-signup">Send</button>
                    </form>
                  </div>
                </div>
              </section>
            </div>
            <!-- <div class="col-12 col-md-6"></div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <v-dialog width="600" v-model="dialog">
    <v-card>
      <v-card-text
        class="d-flex flex-column justify-center align-center pa-10 pb-7"
      >
        <v-icon color="primary" size="100">mdi-email-fast-outline</v-icon>
        <span class="text-h4 text-capitalize mb-3"
          >Your mail sent successfully</span
        >
        <span class="text-center mb-8"
          >Thank you for your interest in Elisha Insights. Someone from our
          sales team will contact you promptly.</span
        >
        <v-btn color="error" @click="dialog = !dialog"
          ><v-icon>mdi-close</v-icon>&nbsp;Close</v-btn
        >
      </v-card-text>

      <!-- <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Close Dialog"
          @click="isActive.value = false"
        ></v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script></script>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import { useAppStore } from "@/store/app.js";
import FormMixin from "@/mixin/FormMixin";
import NotificationAlert from "@/components/utils/Notification.vue";

export default {
  mixins: [FormMixin],
  components: {
    NotificationAlert,
  },
  data() {
    return {
      windowWith: null,
      tab: 1,
      dialog: false,
      loading_tag: false,
      login_active: true,
      loaded: false,
      rememberMe: false,
      details: {
        email: "",
        password: "",
      },
      notification: {},
    };
  },
  methods: {
    _activeClass(type) {
      if (type == "login") {
        this.login_active = true;
      } else {
        this.login_active = false;
      }
    },
    randombg() {
      var random = Math.floor(Math.random() * 6) + 1;
      var bigSize = [
        "url('/src/assets/login_assets/images/ai photos.jpg')",
        "url('/src/assets/login_assets/images/ai photos1.jpg')",
        "url('/src/assets/login_assets/images/ai photos22.jpg')",
        "url('/src/assets/login_assets/images/ai photos32.jpg')",
        "url('/src/assets/login_assets/images/ai photos42.jpg')",
      ];
      document.getElementById("random").style.backgroundImage = bigSize[random];
    },
    async requestDemo() {
      //       const response = await axios.post(
      //   'https://api.postmarkapp.com/email',
      //   {
      //     'From': 'insights@elishatelecom.com',
      //     'To': 'justincarl@eacomm.com',
      //     'Subject': 'Request for Elisha Insights Demo',
      //     'HtmlBody': '<strong>Hello</strong> dear Postmark user.',
      //     'MessageStream': 'outbound'
      //   },
      //   {
      //     headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json',
      //       'X-Postmark-Server-Token': '237dec88-f040-4ff2-b4d5-4cf3ab3639b3'
      //     }
      //   }
      // );
      // console.log(response)
    },
    async getUserDetails() {
      const id = Cookies.get("UID");
      const config = {
        url: "https://ai-insight.etpbx.com/general-info/user/get/" + id,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.request(config);
      if (res.data.response) {
        // _org = organization
        // _aksis_code = access code
        // _a_code = accountcode

        this.$cookies.remove("_org");
        this.$cookies.remove("_aksis_code");
        this.$cookies.remove("_a_code");
        this.$cookies.remove("_email");
        this.$cookies.remove("_un");

        this.$cookies.set("_org", res.data.details.organization_id, "1d");
        this.$cookies.set(
          "_a_code",
          res.data.details.Organization.etpbx_id,
          "1d"
        );
        this.$cookies.set("_email", res.data.details.email, "1d");
        this.$cookies.set("_un", res.data.details.username, "1d");

        this.$cookies.set(
          "_aksis_code",
          JSON.stringify(res.data.details.user_access),
          "1d"
        );
        useAppStore().updateUserData(res.data.details);
      }
    },
    async login() {
      this.loading_tag = true;
      let res = null;
      try {
        const data = {
          username: this.details.email,
          password: this.details.password,
        };
        const config = {
          url: "https://ai-insight.etpbx.com/general-info/user/login",
          method: "POST",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
        };

        let res = await axios.request(config);
        if (res.data.response) {
          this.$cookies.remove("UID");
          this.$cookies.set("UID", res.data.details.id, "1d");
          await this.getUserDetails();

          const accesscodeChecker = (code) => {
            const getAccessCode = Cookies.get("_aksis_code");
            const access_code = getAccessCode
              ? JSON.parse(Cookies.get("_aksis_code"))
              : [];
            const checker = access_code.filter((x) => x == code);
            return checker && checker.length > 0 ? true : false;
          };

          // CHATBOT DETAILS //
          sessionStorage.removeItem("User Details");
          sessionStorage.removeItem("Company Details");
          sessionStorage.removeItem("user_starting_questions");
          sessionStorage.removeItem("message_data");
          sessionStorage.removeItem("email_value");
          sessionStorage.removeItem("Timeout1");
          sessionStorage.removeItem("Timeout2");
          sessionStorage.removeItem("Insert Id");
          sessionStorage.removeItem("send_message_data_lenght");

          if (accesscodeChecker("SM-v9zZSBK")) {
            this.$router.push("/");
          } else if (accesscodeChecker("SM-fGrTV1I")) {
            this.$router.push("/reports/total");
          } else if (accesscodeChecker("SM-LDtf5NX")) {
            this.$router.push("/gs/");
          } else {
            this.$router.push("/error_page");
          }

          this.notification = {
            type: "success",
            message: "",
            title: "Login Success",
          };
        } else {
          this.notification = {
            type: "error",
            message: res.data.error,
            title: "Login Error",
          };
        }
        this.loading_tag = false;
      } catch (error) {
        console.log(error.message);
        return {
          result: "error",
          error: error.message,
        };
        this.notification = {
          type: "error",
          message: error.message,
          title: "Login Error",
        };
        this.loading_tag = false;
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
    fadeOutLoader() {
      // Find the loader wrapper element and fade it out
      const loaderWrapper = document.querySelector(".loader-wrapper");
      if (loaderWrapper) {
        loaderWrapper.style.transition = "opacity 1.5s ease";
        loaderWrapper.style.opacity = "0";
      }
    },
    getWindowWidth() {
      this.windowWith = window.innerWidth;
    },
  },
  created() {
    this.loaded = false;
  },
  beforeRouteEnter(to, from, next) {
    const reload = localStorage.getItem("reload", true);
    if (reload) {
      localStorage.removeItem("reload");
      window.location.reload();
    } else {
      next();
    }
  },
  mounted() {
    window.addEventListener("resize", this.getWindowWidth());

    this.randombg();
    setTimeout(() => {
      this.loaded = true;
      // Fade out the loader
      this.fadeOutLoader();
    }, 2000); // Change the timeout to match your loading time

    const exists = Cookies.get("UID");
    if (exists) {
      this.rememberMe = true;
      // this.$router.push("/");
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

@media (max-width: 815px) {
  .col-12.col-md-6.left {
    min-width: 100% !important;
  }
}

@media (max-width: 768px) {
  .col-12.col-md-6.left {
    min-width: unset !important;
  }
}

@media (max-width: 500px) {
  .text-white.lit {
    display: none;
  }
}
</style>
<style lang="scss"></style>
