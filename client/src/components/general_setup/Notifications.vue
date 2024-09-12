<template lang="">
   <v-card class="mx-auto my-3 px-5 pt-1 pb-1" max-width="100%" elevation="4">
    <v-card-text>
  <v-row>
    <v-col cols="6" class="text-h5"> Notification Setup </v-col>
    <v-col cols="6">
      <v-btn
        color="primary"
        class="text-none float-right"
        @click="savingController"
        :disabled="saving"
        v-if="CheckUserActions(user_actions.create)"
      >
        <v-progress-circular
          v-if="saving"
          indeterminate
          size="small"
          class="mr-2"
        ></v-progress-circular>
        Save
        <v-icon class="ml-1">mdi-plus</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="11" class="py-0"
      >This section allows you to configure and manage notifications to keep you
      informed about extreme conditions, ensuring timely responses to critical
      events in your system.</v-col
    >
  </v-row>
  <v-row class="mt-8">
    <v-divider></v-divider>
    <br />
    <v-col cols="12" color="rgba(0,0,0,.75)">
      <span class="text-subtitle-1 font-weight-medium"
        >Compliance and CSAT score alarm</span
      >
    </v-col>
    <v-col cols="12" md="10">
      <!-- <p>Trigger an alarm if CSAT score if equal or greater to the given number.</p>  -->
      <v-row>
        <v-col cols="2" class="d-flex align-center"
          ><span class="font-weight-bold">High score</span></v-col
        >
        <v-col cols="10">
          <v-row>
            <v-col cols="1" class="pr-1">
              <v-text-field
                hide-details="auto"
                variant="outlined"
                density="compact"
                type="number"
                style="width: 75px;"
                v-model="config.high"
                :readonly="!CheckUserActions(user_actions.update)"
              ></v-text-field>
            </v-col>
            <v-col cols="9" class="d-flex align-center">
              <v-alert color="primary" variant="tonal" class="py-2 ml-2">
                <v-icon size="23px" color="info" class="mr-1"
                  >mdi-information</v-icon
                >
                Activate an alarm when the scores are equal to or exceed the
                specified value.
              </v-alert>
              <!-- <v-tooltip
                text="Activate an alarm when the scores are equal to or exceeds the specified value."
                max-width="330"
              >
                <template v-slot:activator="{ props }">
                  <v-icon size="23px" v-bind="props" color="info"
                    >mdi-information</v-icon
                  >
                </template>
              </v-tooltip> -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="2"></v-col>
    <v-col cols="12" md="10">
      <!-- <p>Trigger an alarm if CSAT score if equal or greater to the given number.</p>  -->
      <v-row>
        <v-col cols="2" class="d-flex align-center"
          ><span class="font-weight-bold">Low score</span></v-col
        >
        <v-col cols="10">
          <v-row>
            <v-col cols="1" class="pr-1">
              <v-text-field
                hide-details="auto"
                variant="outlined"
                density="compact"
                type="number"
                style="width: 75px;"
                v-model="config.low"
                :readonly="!CheckUserActions(user_actions.update)"
              ></v-text-field>
            </v-col>
            <v-col cols="9" class="d-flex align-center">
              <v-alert color="primary" variant="tonal" class="py-2 ml-2">
                <v-icon size="23px" color="info" class="mr-1"
                  >mdi-information</v-icon
                >
                Activate an alarm when the scores are equal to or fall below the
                specified value.
              </v-alert>
              <!-- <v-tooltip
                text="Activate an alarm when the scores are equal to or falls below the specified value."
                max-width="330"
              >
                <template v-slot:activator="{ props }">
                  <v-icon size="23px" v-bind="props" color="info"
                    >mdi-information</v-icon
                  >
                </template>
              </v-tooltip> -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="2"></v-col>
  </v-row>
    </v-card-text>
   </v-card>
</template>
<script>
import Cookies from "js-cookie";
import AccessCode from '@/mixin/AccessCode'

export default {
  mixins: [AccessCode],
  data() {
    return {
      saving: false,
      config: {
        id: 0,
        organization_id: null,
        low: null,
        high: null,
      },
      org_id: null,
      view_code: "",
    };
  },
  methods: {
    async savingController() {
      this.saving = true;
      this.config.low = Number(this.config.low);
      this.config.high = Number(this.config.high);

      if (!this.config.high || this.config.high <= 0) {
        this.notif({
          type: "error",
          message: "High score field value is not acceptable.",
          title: "Error Data",
        });

        this.saving = false;

        return;
      }
      if (!this.config.low || this.config.low <= 0) {
        this.notif({
          type: "error",
          message: "Low score field value is not acceptable.",
          title: "Error Data",
        });

        this.saving = false;
        return;
      }

      if (this.config.id > 0) {
        await this.updateNotif();
      } else {
        await this.saveNotif();
      }

      this.saving = false;
    },
    async updateNotif() {
      const config = {
        url: "/config-notif/",
        method: "PATCH",
        data: this.config,
      };
      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        await this.getNotif();
        this.notif({
          type: "success",
          message: "Data updated successfully!",
          title: "Update Data",
        });

      }
    },
    async saveNotif() {
      const config = {
        url: "/config-notif/",
        method: "POST",
        data: this.config,
      };
      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        await this.getNotif();
        this.notif({
          type: "success",
          message: "Data saved successfully!",
          title: "Save Data",
        });
      }
    },

    async getNotif() {
      const config = {
        url: "/config-notif?organization_id=" + this.org_id,
        method: "GET",
      };
      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        if (res.data.data.length > 0) {
          this.config = res.data.data[0];
        }
      }
    },

    CheckUserActions(code){
      const ac = this.access_code.filter(x => x === this.view_code + "-" +code);
      return ac.length > 0 ? true : false 
    }
  },
  created(){
    const view_code = localStorage.getItem("_vc")
    const org_id = Cookies.get("_org");

    if(view_code){
      this.view_code = view_code
    }

    if(org_id){
      this.org_id = org_id
    }
  },
  async mounted() {
    // this.org_id = Cookies.get("_org");
    this.config.organization_id = Number(this.org_id);
    await this.getNotif()
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
    if (accesscodeChecker(access_code_default.children.gs.notification.code)) {
      next();
    } else {
      next("/error_page");
    }
  },
};
</script>
<style lang="">
/* .v-tooltip .v-overlay__content {
  
} */
</style>
