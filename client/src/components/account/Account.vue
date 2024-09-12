<template lang="">
  <!-- <h1 class="top-header">Account</h1> -->
  <v-card class="mx-auto my-8 px-5" max-width="100%" elevation="4">
    <v-card-text class="py-0 pt-2">
      <v-tabs v-model="tab" color="primary" align-tabs="left">
        <v-tab :value="1" class="text-capitalize">Personal Info</v-tab>
        <v-tab :value="2" class="text-capitalize">Access Control</v-tab>
      </v-tabs>
    </v-card-text>
  </v-card>

  <v-card class="mx-auto my-8 px-5 account" max-width="100%" elevation="4">
    <!-- <v-card-title>
      <v-row>
        <v-col cols="12" md="6"> Personal Information </v-col>
        <v-col cols="12" md="6">
          <v-btn style="float: right" color="info" @click="updateDetails">
            Save
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title> -->
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item :value="1" v-if="userData">
          <v-form @submit.prevent="updateDetails" ref="form">
          <v-row>
            <v-col cols="12" md="6" class="text-h5 font-weight-medium">
              Personal Information
            </v-col>
            <v-col cols="12" md="6">
              <v-btn style="float: right" class="text-none" append-icon="mdi-content-save-outline" color="primary" type="submit">
                Save
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <!-- <v-col cols="12" md="5" class="d-flex flex-column">
                <span class="label font-weight-bold">Firstname</span>
                <span class="value font-weight-black">Sample</span>
            </v-col>
            <v-col cols="12" md="5" class="d-flex flex-column">
                <span class="label font-weight-bold">Firstname</span>
                <span class="value font-weight-black">Sample</span>
            </v-col>
            <v-col cols="12" md="2" class="d-flex flex-column"></v-col> -->

            <v-col cols="12" md="5" class="d-flex flex-column">
              <span class="font-weight-bold">Firstname</span>
              <v-text-field
                variant="outlined"
                density="compact"
                class="mt-2"
                v-model="userData.first_name"
                :rules="rule.required"
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
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="d-flex flex-column">
              <v-radio
                label="Change Password"
                color="primary"
                :value="radioButton"
                @click="rButton"
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
          <!--<v-divider></v-divider>
            <br />
           <v-row>
            <v-col cols="12">
              <v-row>
                <v-col cols="12" md="6" class="text-h5 font-weight-medium">
                  Time Zone
                </v-col>
                <v-col cols="12" md="6"></v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="5" class="d-flex flex-column">
              <span class="font-weight-bold">Country</span>
              <v-select
              v-model="userData.Organization.country"
              variant="outlined"
                density="compact"
  :items="country"
  item-title="name"
  item-value="id"
></v-select>
            </v-col>
            <v-col cols="12" md="5" class="d-flex flex-column">
              <span class="font-weight-bold">Time zone</span>
              <v-select
              v-model="userData.Organization.timezone"
              variant="outlined"
                density="compact"
              :items="timezones[0].timezones"
            ></v-select>
              
            </v-col>
          </v-row> -->
        </v-form>
        </v-window-item>
        <v-window-item :value="2">
          <access-control @showNotification="showNotification"/>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>

  <!-- <v-card v-if="tab == 1" class="mx-auto my-8 px-5 account" max-width="100%" elevation="4">
    <v-card-text>
      <v-form @submit.prevent="updateTimezone" ref="form">
        <v-window v-model="tab">
          <v-window-item :value="1" v-if="userData">
            <v-row>
              <v-col cols="12" md="6" class="text-h5 font-weight-medium">
                Timezone
              </v-col>
              <v-col cols="12" md="6">
                <v-btn style="float: right" class="text-none" append-icon="mdi-content-save-outline" color="primary" type="submit">
                  Save
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="5" class="d-flex flex-column">
                <span class="font-weight-bold">Country</span>
                <v-select
                v-model="userData.Organization.country"
                variant="outlined"
                  density="compact"
                :items="country"
                item-title="name"
                item-value="id"
              ></v-select>
              </v-col>
              <v-col cols="12" md="5" class="d-flex flex-column">
                <span class="font-weight-bold">Timezone</span>
                <v-select
                v-model="userData.Organization.timezone"
                variant="outlined"
                  density="compact"
                :items="timezones[0].timezones"
              ></v-select>
                
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-form>
    </v-card-text>
  </v-card> -->
</template>
<script>
import { useAppStore } from "@/store/app.js";
import axios from "axios";

import AccessControl from "./access_control/AccessControl.vue";

export default {
  emits: ["showNotification", "loadingScreen"],
  components: { AccessControl },
  //   data() {
  //     return {
  //       userData: {
  //         first_name: "",
  //         last_name: "",
  //         email: "",
  //         mobile: "",
  //       },
  //     };
  //   },
  data() {
    return {
      tab: 1,
      radioButton: false,
      disabledPassword: true,
      timezones: [
        {
          timezones: [],
        }
      ],
      country: [],
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
    async updateTimezone(){
      try {
        const config = {
          url: "https://ai-insight.etpbx.com/general-info/organization/update",
          method: "PUT",
          data: {id: this.userData.Organization.id ,country: this.userData.Organization.country, timezone: this.userData.Organization.timezone},
          headers: {
            "Content-Type": "application/json",
          },
        };

        const res = await axios.request(config);
        if(res.data.response){
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
  },
  watch: {
    'userData.Organization.country'(val) {
      this.getTimezone(val);
    },

  },
  computed: {
    userData() {
      // console.log(useAppStore().userData)
      let new_data = useAppStore().userData;
      if (useAppStore().userData != null) {
        useAppStore().userData.password = ""
      }
      return new_data;
    },
  },
  async mounted() {
    this.loadscreen(true);
    await this.getCountry()
    this.loadscreen(false);
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
