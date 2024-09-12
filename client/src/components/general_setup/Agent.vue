<template lang="">
  <!-- <h2 class="top-header">Agent Setup</h2> -->
  <v-card class="mx-auto my-3 px-5 pt-1 pb-1" max-width="100%" elevation="4">
    <v-card-text>
      <div class="d-flex justify-space-between mb-5">
        <v-row>
          <v-col cols="6" class="text-h5">
            <!-- <div class="d-flex justify-space-between">
              <p class="mr-5 my-auto">Agents</p> 
            </div> -->
            Agent Setup
          </v-col>
        </v-row>
        <!-- <v-btn
          elevation="0"
          color="primary"
          class="text-overline text-none"
          @click="addAgent"
        >
          Add Agent
          <v-icon>mdi-plus</v-icon>
        </v-btn> -->
      </div>
      <v-divider></v-divider>
      <br>
      <v-row>
        <v-col cols="7" xxl="11" xl="11" md="10" sm="9" s="5" class="pr-0 pb-0">
          <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" single-line variant="outlined"
            density="compact" class="re-border-radius-r" hide-details></v-text-field>
        </v-col>
        <v-col cols="5" xxl="1" xl="1" md="2" sm="3" s="5" class="pl-0 pb-0">
          <v-btn class="rounded-s-0 text-none" color="#28a745" elevation="0" height="100%" width="100%"
            @click="initialDetails()" append-icon="mdi-database-sync">Refresh</v-btn>
        </v-col>
        <v-col cols="12" class="pt-0">
        <v-data-table :items="user_lists" :headers="headers"
        :loading="loading" 
        :search="search"
        :sort-by="[{key: 'user_details.fullname', order: 'desc'}]"
        :must-sort="true"
          >
          <template v-slot:item.actions="{ item }">
            <div>
              <v-btn
                v-if="CheckUserActions(user_actions.update)"
                @click="editData(item.user_details, item.user_id)"
                icon="mdi-lead-pencil"
                size="small"
                color="primary"
                variant="text"
              ></v-btn>
            </div>
          </template>
          
          <!-- <template v-slot:item.fullname="{ item }">
           
              {{ item.user_details.fullname || '-' }}
            
          </template> -->

          <template v-slot:item.contact_details="{ item }">
            <div>
              {{ item.user_details.contact_details || '' }}
            </div>
          </template>
        </v-data-table>
      </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-dialog v-model="dialog" scrollable persistent width="950">
    <v-card>
      <v-toolbar dark color="white" class="sticky">
        <v-toolbar-title>Add Agent</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="px-6">
        <v-row>
          <v-col cols="12">
            <v-row>
              <v-col cols="3">
                <p class="f-14 color-light">User ID</p>
              </v-col>
              <v-col cols="4">
                <v-text-field
              hide-details="auto"
              variant="outlined"
              density="compact"
              readonly
              v-model="user_details.user_id"
            ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="3">
            <p class="f-14 color-light">Fullname</p>
          </v-col>
          <v-col cols="9">
            <v-text-field
              hide-details="auto"
              variant="outlined"
              density="compact"
              :disabled="saving_data"
              v-model="user_details.fullname"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <p class="f-14 color-light">Email</p>
          </v-col>
          <v-col cols="9">
            <v-text-field
              hide-details="auto"
              variant="outlined"
              density="compact"
              type="email"
              :disabled="saving_data"
              v-model="user_details.contact_details"
            ></v-text-field>
          </v-col>
        </v-row>
        <br>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-0">
        <v-row class="ma-0 my-actions">
          <v-col cols="6" class="pa-0 ">
            <v-btn class="rounded-0 elevation-0" style="position: relative;" variant="flat" width="100%" height="70" color="rgb(217, 217, 217)" @click="dialog = false"
              ><p class="text-capitalize">Cancel</p></v-btn
            ></v-col
          >
          <v-col cols="6" class="pa-0">
            <v-btn v-if="CheckUserActions(user_actions.update)" class="rounded-0 elevation-0" width="100%" height="70" variant="flat" color="primary" @click="submitAgent" :disabled="saving_data"
              >
              <v-progress-circular
            v-if="saving_data"
            indeterminate
            size="small"
            class="mr-2"
          ></v-progress-circular>
          <!-- <p v-if="agent.action == 'edit'" class="text-capitalize">Edit Item</p> -->
          <p class="text-capitalize">Edit Item</p>
          </v-btn
            ></v-col
          >
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { useAppStore } from "@/store/app.js";
import Cookies from "js-cookie";
import AccessCode from '@/mixin/AccessCode'

export default {
  emits: ["showNotification", "loadingScreen"],
  mixins: [AccessCode],
  data() {
    return {
      loading: false,
      search: "",
      saving_data: false,
      dialog: false,
      account_code: Cookies.get("_a_code"),
      user_lists: [{
        user_id: null,
        user_details: {
          Agents: [],
          contact_details: "",
          createdAt: "",
          fullname: "",
          organization_id: null,
          user_id: null,
          account_code: Cookies.get("_a_code")
        },
      }],
      user_id: null,
      user_details: {
        Agents: [],
        contact_details: "",
        createdAt: "",
        fullname: "",
        organization_id: this.org_id,
        user_id: null,
        account_code: Cookies.get("_a_code"),
      },
      headers: [
        { title: "Name", value: "user_details.fullname", key: "user_details.fullname", align: "start" },
        { title: "Email", value: "user_details.contact_details", key: "user_details.contact_details", align: "start" },
        { title: "Group ID", key: "groups", align: "start" },
        { title: "User ID", key: "user_id", align: "start" },
        { title: "", key: "actions", align: "center", width: "180px" },
      ],
      org_id: null,
      view_code: "",
    };
  },
  methods: {
    async getUsers() {
      const getAccountCode = Cookies.get("_a_code")

      const data = {
        organization_id: this.org_id,
        account_code: getAccountCode
      }
      const config = {
        url: "/agent/getNewAgentList",
        data: data,
        method: "POST",
      };
      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        this.user_lists = res.data.data

        this.user_lists = this.user_lists.map(x => {
          if (!x.user_details.fullname) {
            const details = {
              fullname: "-",
              contact_details: "",
            }
            x.user_details = {
              ...x.user_details,
              ...details
            }
          }
          x.groups = x.user_details.Groups.join(", ")

          return x
        })

        console.log(this.user_lists)
      }
    },
    async submitAgent() {
      this.saving_data = true;
      this.user_details.organization_id = this.org_id
      
      const config = {
        url: "/agent/updateNewAgentList",
        data: this.user_details,
        method: "POST",
      };

      if(!Cookies.get("_a_code")){
        this.notif({
          type: "error",
          message: "Accountcode not found. Please contact your administrator for this issue.",
          title: "Account Code",
        });
        this.saving_data = false;
        this.dialog = !this.dialog
        return
      }
      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        await this.initialDetails();
        this.notif({
          type: "success",
          message: "Data updated successfully!",
          title: "Update Data",
        });
      } else {
        this.notif({
          type: "error",
          message: "Something went wrong. Please try again later",
          title: "Error Data",
        });
      }
      this.saving_data = false;
      this.dialog = !this.dialog
    },
    async initialDetails() {
      this.loading = true
      await this.getUsers();
      this.loading = false
    },
    editData(data, user_id) {
      this.dialog = !this.dialog

      this.user_details = {
        Agents: [],
        contact_details: "",
        fullname: "",
        organization_id: this.org_id,
        user_id: null,
        account_code: Cookies.get("_a_code")
      }

      if (data.user_id) {
        this.user_details = { ...data, account_code: Cookies.get("_a_code") }
        console.log(this.user_details)
      } else {
        this.user_details.user_id = user_id
      }
    },
    CheckUserActions(code) {
      const ac = this.access_code.filter(x => x === this.view_code + "-" + code);
      return ac.length > 0 ? true : false
    }
  },
  created() {
    const view_code = localStorage.getItem("_vc")
    const org_id = Cookies.get("_org");

    if (view_code) {
      this.view_code = view_code
    }

    if (org_id) {
      this.org_id = org_id
    }
  },
  async mounted() {
    this.loadscreen(true);
    await this.initialDetails();
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
    if (accesscodeChecker(access_code_default.children.gs.team.children.agent.code)) {
      next();
    } else {
      next("/error_page");
    }
  },
};
</script>
