<template>
  <!-- <h2 class="top-header">Group Setup</h2> -->
  <v-card class="mx-auto my-3 px-5 pt-1 pb-1" max-width="100%" elevation="4">
    <v-card-text>
      <div class="d-flex justify-space-between mb-5">
        <v-row>
          <v-col cols="6" class="text-h5">
            <!-- <div class="d-flex justify-space-between">
              <p class="mr-5 my-auto">Groups</p>
            </div> -->
            Groups
          </v-col>
        </v-row>
        <!-- <v-btn v-if="CheckUserActions(user_actions.create)" elevation="0" @click="addGroup()" color="primary" class="text-overline text-none">
          Add Group
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
            @click="getInitials()" append-icon="mdi-database-sync">Refresh</v-btn>
        </v-col>
        <v-col cols="12" class="pt-0">
          <v-data-table :items="groups.data" :headers="headers" :loading="loading" :search="search"
            :sort-by="[{ key: 'createdAt', order: 'desc' }]" :must-sort="true">
            <template v-slot:item.actions="{ item }">
              <div>
                <v-btn v-if="CheckUserActions(user_actions.update)" @click="editData(item)" icon="mdi-lead-pencil"
                  size="small" color="primary" variant="text"></v-btn>
                <!-- <v-menu>
                                <template v-slot:activator="{ props }">
                                    <v-btn v-bind="props" icon="mdi-cog-outline" size="small" color="success" variant="text"></v-btn>
                                </template>
                                <v-list>
                                    <v-list-item class="pa-0">
                                        <v-list-item-title><v-btn size="small" variant="text"
                                                :to="{ name: 'ca_setup', params: { id: item.id } }">Intent Analytics Setup</v-btn></v-list-item-title>
                                    </v-list-item>
                                    <v-list-item class="pa-0">
                                        <v-list-item-title><v-btn size="small" variant="text"
                                                :to="{ name: 'agent_setup', params: { id: item.id } }">Agent
                                                Setup</v-btn></v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-menu> -->
                <!-- <v-btn :to="{ name: 'reports', params: { id: item.id } }" icon="mdi-share" size="small"
                                variant="text"></v-btn> -->
              </div>
            </template>
            <template v-slot:item.createdAt="{ item }">
              {{ formatDate2(item.createdAt) }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-dialog v-model="dialog" scrollable persistent width="950">
    <v-card>
      <v-toolbar dark color="white" class="sticky">
        <v-toolbar-title> {{ action }} Group</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>

      <v-card-text class="px-6">
        <v-row>
          <v-col cols="3">
            <p class="f-14 color-light">Group ID</p>
          </v-col>
          <v-col cols="9">
            <v-text-field hide-details="auto" variant="outlined" density="compact" v-model="group.id"
              :disabled="action === 'Edit'" :readonly="saving_data"></v-text-field>
          </v-col>
          <v-col cols="3">
            <p class="f-14 color-light">Group Name</p>
          </v-col>
          <v-col cols="9">
            <v-text-field hide-details="auto" variant="outlined" density="compact" v-model="group.name"
              :readonly="saving_data"></v-text-field>
          </v-col>
        </v-row>
        <br />
        <v-divider></v-divider>
        <br />

        <br>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-0">
        <v-row class="ma-0 my-actions">
          <v-col cols="6" class="pa-0 ">
            <v-btn class="rounded-0 elevation-0" style="position: relative;" variant="flat" width="100%" height="70"
              color="rgb(217, 217, 217)" @click="dialog = false">
              <p class="text-capitalize">Cancel</p>
            </v-btn></v-col>
          <v-col cols="6" class="pa-0">
            <v-btn class="rounded-0 elevation-0" width="100%" height="70" variant="flat" color="primary" @click="saveData"
              :disabled="saving_data">
              <v-progress-circular v-if="saving_data" indeterminate size="small" class="mr-2"></v-progress-circular>
              <p v-if="this.action == 'Edit'" class="text-capitalize">Edit Item</p>
              <p v-else class="text-capitalize">Add Item</p>
            </v-btn>
          </v-col>
        </v-row>
        <!-- <v-spacer></v-spacer>
        <v-btn color="rgb(0, 116, 228)" variant="flat" @click="saveData" class="text-none" :disabled="saving_data">
          <v-progress-circular v-if="saving_data" indeterminate size="small" class="mr-2"></v-progress-circular>
          Save
        </v-btn>
        <v-btn color="rgb(0, 116, 228)" variant="flat" class="text-none" @click="dialog = false">
          Close
        </v-btn> -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Cookies from "js-cookie";
import moment from "moment";
import AccessCode from '@/mixin/AccessCode'

export default {
  emits: ["showNotification", "loadingScreen"],
  mixins: [AccessCode],
  data() {
    return {
      loading: false,
      search: "",
      dialog: false,
      saving_data: false,
      tab: null,
      headers: [
        { title: "Record ID", key: "id", align: "start" },
        { title: "Name", key: "name", align: "start" },
        { title: "Created", key: "createdAt", align: "start" },
        { title: "Action", key: "actions", align: "center", width: "180px" },
      ],
      group: {
        name: "",
        id: 0,
      },
      groups: [],
      org_id: null,
      action: null,
      view_code: "",
    };
  },

  methods: {
    async getInitials() {
      this.loading = true
      await this.getGroup();
      this.loading = false
    },
    async getGroup() {
      const config = {
        url: "/groups?organization_id=" + this.org_id,
        method: "GET",
      };
      const res = await this.api_call(config);
      res.data.data = res.data.data.map(x => {
        // x.createdAt = moment(x.createdAt).format("MMMM D, YYYY [at] h:mm A");
        x.createdAt = this.parseDate(x.createdAt)
        return x
      })
      this.groups = res.data;
    },
    async saveData() {
      this.saving_data = true;

      if (this.group.name.trim() == "") {
        this.notif({
          type: "error",
          message: "Group name is empty!",
          title: "Error",
        });
        this.saving_data = false;
        return;
      }

      if (this.action == "Edit") {
        const config = {
          url: "/groups/update",
          method: "POST",
          data: this.group,
        };

        const res = await this.api_call(config);
        if (res.data && res.data.result != 'error') {
          await this.getInitials();

          this.notif({
            type: "success",
            message: "Data updated successfully!",
            title: "Update Data",
          });
          this.dialog = false;
          this.saving_data = false;

        } else {
          this.notif({
            type: "error",
            message: res.data.message,
            title: "Error Data",
          });
          this.saving_data = false;
        }
      } else {
        const config = {
          url: "/groups/create",
          method: "POST",
          data: this.group,
        };

        const res = await this.api_call(config);

        if (res.data && res.data.result != 'error') {
          await this.getInitials();

          this.notif({
            type: "success",
            message: "Data saved successfully!",
            title: "Save Data",
          });
          this.dialog = false;
          this.saving_data = false;
        } else {
          this.notif({
            type: "error",
            message: res.data.message,
            title: "Error Data",
          });
          this.saving_data = false;
        }
      }


      // if (this.action == "Add") {
      //   this.group["organization_id"] = this.org_id
      //   this.group["action"] = this.action

      //   // const data = {
      //   //   name: this.group.name,
      //   //   organization_id: 2,
      //   // };

      //   const config = {
      //     url:"/groups/agentJoinGroup",
      //     method: "POST",
      //     data: this.group,
      //   };

      //   const res = await this.api_call(config);
      //   if (res.data && res.data.result) {
      //     this.dialog = false;

      //     this.notif({
      //       type: "success",
      //       message: "Data saved successfully!",
      //       title: "Save Data",
      //     });
      //   }
      // } else {
      //   this.group['action']="Edit"
      //   const config = {
      //     url: "/groups/agentJoinGroup",
      //     method: "POST",
      //     data: this.group,
      //   };
      //   const res = await this.api_call(config);
      //   if (res.data && res.data.result) {
      //     this.dialog = false;

      //     this.notif({
      //       type: "success",
      //       message: "Data updated successfully!",
      //       title: "Save Data",
      //     });
      //   }
      // }
    },
    async addGroup() {
      this.action = "Add"
      this.group = {
        name: "",
        id: "",
        organization_id: this.org_id,
        action: this.action
      };

      this.dialog = !this.dialog;
    },

    editData(data) {
      this.action = "Edit"
      this.dialog = !this.dialog;
      this.group = {
        name: "",
        id: 0,
      }

      this.group = data;
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
    await this.getInitials();
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
              group: {
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
    if (accesscodeChecker(access_code_default.children.gs.team.children.group.code)) {
      next();
    } else {
      next("/error_page");
    }
  },
};
</script>
