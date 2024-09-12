<template lang="">
  <div>
    <v-row>
      <v-col cols="10" class="pr-0">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          single-line
          variant="outlined"
          density="compact"
          class="re-border-radius-r"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="2" class="pl-0">
        <v-btn
          class="rounded-s-0 text-none"
          color="primary"
          elevation="0"
          height="100%"
          width="100%"
          append-icon="mdi-plus"
          @click="itemReset()"
          >Add access</v-btn
        >
      </v-col>
    </v-row>
    <v-data-table :items="user_lists" :headers="headers" :search="search">
      <template v-slot:item.actions="{ item }">
            <div>
              <v-btn
                @click="editData(item)"
                icon="mdi-lead-pencil"
                size="small"
                color="primary"
                variant="text"
              ></v-btn>
              <!-- <v-btn icon="mdi-share" size="small" variant="text"></v-btn> -->
            </div>
          </template>
    </v-data-table>
  </div>

  <!-- DIALOG -->
  <v-dialog v-model="dialog" width="700">
    <v-card>
      <v-card-text class="px-0 pb-0">
        <v-row class="px-5 ma-0">
          <v-col cols="12"> <h1>Access Control</h1> </v-col>
          <v-col cols="12">
            <v-tabs v-model="tab" color="primary" align-tabs="left">
              <v-tab :value="1" class="text-capitalize">Basic Info</v-tab>
              <v-tab :value="2" class="text-capitalize">Access Control</v-tab>
              <v-tab :value="3" class="text-capitalize">Login Info</v-tab>
            </v-tabs>
            <br />
            <v-window v-model="tab">
              <v-window-item :value="1">
                <v-row>
                  <v-col cols="3">
                    <p class="f-14 color-light">Firstname</p>
                  </v-col>
                  <v-col cols="9">
                    <v-text-field
                    v-model="access_user.first_name"
                      hide-details="auto"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <p class="f-14 color-light">Lastname</p>
                  </v-col>
                  <v-col cols="9">
                    <v-text-field
                    v-model="access_user.last_name"
                      hide-details="auto"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <p class="f-14 color-light">Email</p>
                  </v-col>
                  <v-col cols="9">
                    <v-text-field
                    v-model="access_user.email"
                      hide-details="auto"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <p class="f-14 color-light">Mobile</p>
                  </v-col>
                  <v-col cols="9">
                    <v-text-field
                    v-model="access_user.mobile"
                      hide-details="auto"
                      variant="outlined"
                      density="compact"
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <p class="f-14 color-light">Birthdate</p>
                  </v-col>
                  <v-col cols="9">
                    <v-text-field
                    v-model="access_user.birthdate"
                      hide-details="auto"
                      variant="outlined"
                      density="compact"
                      type="date"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-window-item>

              <!-- Window 2 -->
              <v-window-item :value="2">
                <l-access-looper :moduleArray="moduleArray" v-model="access_user.user_access" @updateActions="updateActions"></l-access-looper>
              </v-window-item>
              <!-- Window 3 -->
              <v-window-item :value="3">
                <v-row>
                  <v-col cols="3">
                    <p class="f-14 color-light">Username</p>
                  </v-col>
                  <v-col cols="9">
                    <v-text-field
                    v-model="access_user.username"
                      hide-details="auto"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <p class="f-14 color-light">Password</p>
                  </v-col>
                  <v-col cols="9">
                    <v-text-field
                    v-model="access_user.password"
                      hide-details="auto"
                      variant="outlined"
                      density="compact"
                      type="password"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
        <br>
        <v-row class="ma-0 my-actions">
          <v-col cols="6" class="pa-0 ">
            <v-btn class="rounded-0 elevation-0" style="position: relative;" width="100%" height="70" color="rgb(217, 217, 217)" @click="dialog = false"
              ><p class="text-capitalize">Cancel</p></v-btn
            ></v-col
          >
          <v-col cols="6" class="pa-0">
            <v-btn class="rounded-0 elevation-0" width="100%" height="70" color="primary" @click="addAccess" :disabled="saving_data"
              >
              <p v-if="access_user.id > 0" class="text-capitalize">Edit</p>
              <p v-else class="text-capitalize">Add</p>
              </v-btn>
              </v-col
          >
        </v-row>
      </v-card-text>
      <!-- <v-card-actions>
        <v-btn color="primary" block @click="dialog = false"
          >Close Dialog</v-btn
        >
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>
<script>
import Cookies from "js-cookie";
import axios from "axios";
import moment from "moment";

export default {
  emits: ["showNotification", "loadingScreen"],
  data() {
    return {
      saving_data: false,
      moduleArray: [],
      user_access_actions: ["PM-4iiAyYe"],
      tab: 1,
      dialog: false,
      search: "",
      access_user:{
        id: 0,
        birthdate: "",
        email: "",
        first_name: "",
        last_name: "",
        mobile: "",
        password: "",
        user_access: [],
        username: "",
      },
      user_lists: [],
      headers: [
      { title: 'Name', align: 'start', key: 'first_name' },
      { title: 'Email', align: 'start', key: 'email' },
      { title: 'Mobile', align: 'start', key: 'mobile' },
      { title: 'Username', align: 'start', key: 'username' },
      { title: '', align: 'start', key: 'actions' },
      ],
    };
  },
  methods: {
    itemReset(){
      this.access_user = {
        id: 0,
        birthdate: "",
        email: "",
        first_name: "",
        last_name: "",
        mobile: "",
        password: "",
        user_access: [],
        username: "",
      }
      this.dialog = !this.dialog
    },
    editData(item){
      console.log(item)
      this.dialog = !this.dialog
      item.birthdate = moment(item.birthdate).format('YYYY-MM-DD')
      this.access_user = item
    },
    updateActions(val){
        this.access_user.user_access = val
    },
    async addAccess(){
        try {
          let type = this.access_user.id > 0 ? 'update' : 'create';
          let method = this.access_user.id > 0 ? 'PUT' : 'POST';
        this.access_user.birthdate = moment(this.access_user.birthdate).format('MM/DD/YY')
       const config = {
         url: "https://ai-insight.etpbx.com/general-info/user/" + type,
         method: method,
         data: {...this.access_user, organization_id: this.org_id ,tier: 4},
         headers: {
           "Content-Type": "application/json",
         },
       };

       const res = await axios.request(config);
       if(res.data.response){
        this.dialog = !this.dialog
        this.$emit('showNotification', {
            type: 'success',
            message: "Data saved successfully!",
            title: "Save alert",
          })
        await this.getUsers();
       } else {
        this.$emit('showNotification', {
            type: 'error',
            message: res.data.message ? res.data.message : 'Somethings wrong.',
            title: "Save alert",
          })
       }
     } catch (error) {
       console.error(error);
     }
    },
    async getModules() {
      const id = Cookies.get("UID");

      const config = {
        url: "https://ai-insight.etpbx.com/general-info/system-module/user/" + id,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.request(config);
      if (res.data.response) {
        this.moduleArray = res.data.list;
      }
    },
    async getUsers() {
      const id = Cookies.get("UID");

      const config = {
        url:
          "https://ai-insight.etpbx.com/general-info/organization/complete-details/" +
          this.org_id,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.request(config);
      if (res.data.response) {
        this.user_lists = res.data.details.Users

      }
    },
  },
  async mounted() {
    console.log(Cookies.get("_org"))
    this.org_id = Number(Cookies.get("_org"));
    await this.getUsers();
    await this.getModules();
  },
};
</script>
<style>

</style>
