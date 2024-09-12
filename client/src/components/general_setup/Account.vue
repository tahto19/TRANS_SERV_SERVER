<template lang="">
 

  <v-card class="mx-auto my-8 px-5 account" max-width="100%" elevation="4">
    <v-card-text v-if="userData">
          <v-form @submit.prevent="updateDetails" ref="form">
          <v-row>
            <v-col cols="12" md="6" class="text-h5 font-weight-medium">
              Personal Information
            </v-col>
            <v-col cols="12" md="6">
              <v-btn v-if="CheckUserActions(user_actions.update)" style="float: right" class="text-none" append-icon="mdi-content-save-outline" color="primary" type="submit">
                Save
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="5" class="d-flex flex-column">
              <span class="font-weight-bold">Firstname</span>
              <v-text-field
                variant="outlined"
                density="compact"
                class="mt-2"
                v-model="userData.first_name"
                :rules="rule.required"
                :readonly="!CheckUserActions(user_actions.update)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="5" class="d-flex flex-column">
              <span class="font-weight-bold">Lastname</span>
              <v-text-field
                variant="outlined"
                density="compact"
                class="mt-2"
                v-model="userData.last_name"
                :rules="rule.required"
                :readonly="!CheckUserActions(user_actions.update)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="d-flex flex-column"></v-col>

            <v-col cols="12" md="5" class="d-flex flex-column">
              <span class="font-weight-bold">Email</span>
              <v-text-field
                variant="outlined"
                density="compact"
                class="mt-2"
                v-model="userData.email"
                :rules="rule.required"
                :readonly="!CheckUserActions(user_actions.update)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="5" class="d-flex flex-column">
              <span class="font-weight-bold">Mobile</span>
              <v-text-field
                variant="outlined"
                density="compact"
                class="mt-2"
                v-model="userData.mobile"
                :rules="rule.required"
                :readonly="!CheckUserActions(user_actions.update)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="2" class="d-flex flex-column"></v-col>
            <br />
            <v-divider></v-divider>
            <br />
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6" class="text-h5 font-weight-medium">
                  Login Credential
                </v-col>
                <v-col cols="12" md="6"></v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="5" class="d-flex flex-column">
              <span class="font-weight-bold">Username</span>
              <v-text-field
                variant="outlined"
                density="compact"
                class="mt-2"
                v-model="userData.username"
                :readonly="!CheckUserActions(user_actions.update)"
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex flex-column">
              <v-radio
                label="Change Password"
                color="primary"
                :value="radioButton"
                @click="rButton"
                :disabled="!CheckUserActions(user_actions.update)"
              ></v-radio>
            </v-col>
            <v-col cols="12" md="5" class="d-flex flex-column">
              <span class="font-weight-bold">New Password</span>
              <v-text-field
                :disabled="disabledPassword"
                v-model="userData.password"
                variant="outlined"
                density="compact"
                type="password"
                class="mt-2"
                :rules="rule.passwords"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="5" class="d-flex flex-column">
              <span class="font-weight-bold">Confirm Password</span>
              <v-text-field
                :disabled="disabledPassword"
                variant="outlined"
                density="compact"
                type="password"
                class="mt-2"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
import { useAppStore } from "@/store/app.js";
import axios from "axios";
import AccessCode from '@/mixin/AccessCode'
import Cookies from "js-cookie";

export default {
  emits: ["showNotification", "loadingScreen"],
  mixins: [AccessCode],
  data() {
    return {
      radioButton: false,
      disabledPassword: true,
      timezones: [
        {
          timezones: [],
        }
      ],
      country: [],
      userData: {},
    };
  },
  methods: {
    showNotification(e) {
      this.notif(e)
    },
    rButton() {
      this.radioButton = !this.radioButton;

      if (this.radioButton) {
        this.disabledPassword = false;
      } else {
        this.disabledPassword = true;
      }
      console.log(this.radioButton);
    },
    async updateTimezone() {
      try {
        const config = {
          url: "https://ai-insight.etpbx.com/general-info/organization/update",
          method: "PUT",
          data: { id: this.userData.Organization.id, country: this.userData.Organization.country, timezone: this.userData.Organization.timezone },
          headers: {
            "Content-Type": "application/json",
          },
        };

        const res = await axios.request(config);
        if (res.data.response) {
          this.notif({
            type: 'success',
            message: 'Data saved successfully',
            title: "Save alert",
          })
        }
      } catch (error) {
        console.error(error);
      }
    },
    async updateDetails() {
      try {
        const config = {
          url: "https://ai-insight.etpbx.com/general-info/user/update",
          method: "PUT",
          data: this.userData,
          headers: {
            "Content-Type": "application/json",
          },
        };

        const res = await axios.request(config);
      } catch (error) {
        console.error(error);
      }
    },
    async getCountry() {
      try {

        const config = {
          url: "https://ai-insight.etpbx.com/general-info/util/country/v2/all",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };

        const res = await axios.request(config);
        console.log(res)
        if (res.data.response) {
          this.country = res.data.details
          this.getTimezone(this.userData.Organization.country)
        }
      } catch (error) {
        console.error(error);
      }
    },
    getTimezone(val) {
      if (this.country.length > 0) {
        this.timezones = this.country.filter(x => x.id == val);
      }

    },
    CheckUserActions(code) {
      const ac = this.access_code.filter(x => x === this.view_code + "-" + code);
      return ac.length > 0 ? true : false
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
        this.userData = res.data.details
      }
    },
  },
  watch: {
    'userData.Organization.country'(val) {
      this.getTimezone(val);
    },

  },
  computed: {
    // userData() {
    //   // console.log(useAppStore().userData)
    //   let new_data = useAppStore().userData;
    //   if (useAppStore().userData != null) {
    //     useAppStore().userData.password = ""
    //   }
    //   return new_data;
    // },
  },
  created() {
    const view_code = localStorage.getItem("_vc")
    if (view_code) {
      this.view_code = view_code
    }
  },
  async mounted() {
    this.loadscreen(true);
    await this.getUserDetails()
    await this.getCountry()
    this.loadscreen(false);
  },
  beforeRouteEnter(to, from, next) {
    const access_code_default = {
        gs: "SM-LDtf5NX",
        wb: "SM-v9zZSBK",
        ac: "SM-RrwFKy7",
        rpts: "SM-fGrTV1I",
        children: {
          gs: {
            analysis: {
              code: "TM-or04VPh",
            },
            notification: {
              code: "TM-UdsJgs9",
            },
            wb_config: {
              code: "TM-UhIkUWp",
            },
            team: {
              code: "TM-uPFQvOY",
              children: {
                agent: {
                    code: "QUAM-GtWpXpz",
                },
                account: {
                    code: "QUAM-SheahQY",
                },
              },
            },
            account: {
              code: "TM-YjUaucI",
            },
            access: {
                code: "TM-ytl8y2Y",
              },
          },
        },
      }
    const accesscodeChecker = (code) => {
        const getAccessCode = Cookies.get("_aksis_code")
        const access_code = getAccessCode ? JSON.parse(Cookies.get("_aksis_code")) : [];
        const checker = access_code.filter((x) => x == code);
        return checker && checker.length > 0 ? true : false;
    }
    if (accesscodeChecker(access_code_default.children.gs.account.code)) {
      next();
    } else {
      next("/error_page");
    }
  },
};
</script>

<style>
.account .label {
  color: #b8bfc9;
}

.account .value {
  color: #9ca5bb;
}
</style>
