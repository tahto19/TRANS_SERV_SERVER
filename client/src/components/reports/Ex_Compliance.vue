<template>
  <v-chip :to="{ name: 'reports_default', params: { id: 'total' } }" variant="text" class="mb-3 px-0">
    <v-icon color="rgb(0, 116, 228)" start icon="mdi-chevron-left"></v-icon>
    <p style="color: rgb(0, 116, 228)">Back to call analysis</p>
  </v-chip>
  <h1 class="top-header">Compliance</h1>

  <v-card class="mx-auto my-8 px-5 bt-gray" max-width="100%" elevation="4">
    <v-card-text>
      <v-row>
        <v-col cols="3" md="3">
          <div class="d-flex align-center">
            <span class="color-light mr-3">View</span>
            <v-select v-model="view_type_id" density="compact" :items="view_type" item-title="name" item-value="id"
              variant="outlined" height="10" hide-details="auto"></v-select>
          </div>
        </v-col>
        <v-col v-if="view_type_id == 1" cols="4" md="4">
          <div class="d-flex align-center">
            <span class="color-light mr-3">Group</span>
            <v-select density="compact" :items="groups_data" item-title="name" item-value="id" variant="outlined"
              height="10" hide-details="auto" v-model="groupID"></v-select>
          </div>
        </v-col>
        <v-col cols="5" md="5">
          <div class="d-flex align-center" style="position: relative !important">
            <span class="color-light mr-3">Period</span>
            <v-autocomplete v-model="period_type_id" density="compact" :items="period_type"
              :item-text="(item) => `${item.id}`" item-title="name" item-value="id" variant="outlined" height="10"
              hide-details="auto" id="menu-activator" :disabled="ac_disable">
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" @click="ActivateMenu(item?.raw?.name)"></v-list-item>
              </template>
            </v-autocomplete>
            <v-menu v-if="showMenu" v-model="showMenu" :close-on-content-click="false" activator="#menu-activator"
              location="bottom">
              <v-card>
                <v-card-text class="d-flex" style="gap: 10px">
                  <v-date-picker v-model="custom_startDate"></v-date-picker>
                  <v-date-picker v-model="custom_endDate"></v-date-picker>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn variant="text" @click="showMenu = false">
                    Cancel
                  </v-btn>
                  <v-btn color="primary" variant="tonal" @click="selectPeriod(4, true)">
                    <v-progress-circular v-if="load_process" color="primary" indeterminate></v-progress-circular>&nbsp;
                    Submit
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-row>
    <v-col cols="12" md="4" class="d-flex" width="100">
      <v-card class="mx-auto px-3 pt-1 pb-1 bt-blue" min-width="100%" elevation="4">
        <v-card-title class="d-flex justify-space-between mb-2">
          Average Compliance
        </v-card-title>
        <v-card-text>
          <c-speedometer :speedometerdata="speedometerdata" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="8">
      <CompliancePerIntent :data="compliancePerIntentData" />
    </v-col>
    <v-col cols="12" md="12">
      <CompliancePerPeriod :data="compliancePerPeriod" />
    </v-col>
    <v-col cols="12" md="12">
      <AgentCompliance :data="AgentTable" />
    </v-col>
  </v-row>
</template>
<script>
import CompliancePerIntent from "./Ex_Compliance/CompliancePerIntent.vue";
import CompliancePerPeriod from "./Ex_Compliance/CompliancePerPeriod.vue";
import AgentCompliance from "./Ex_Compliance/AgentCompliance.vue";
import Cookies from "js-cookie";
import moment from "moment-timezone";

export default {
  components: {
    CompliancePerIntent,
    CompliancePerPeriod,
    AgentCompliance,
  },
  emits: ["showNotification", "loadingScreen", "loadingScreen2"],
  data() {
    return {
      org_id: null,
      custom_startDate: new Date(),
      custom_endDate: new Date(),
      load_process: false,
      showMenu: false,
      view_type_id: this.$route.params.id == "total" ? 3 : 1,
      view_type: [
        {
          id: 1,
          name: "Group",
        },
        // {
        //     id: 2,
        //     name: 'Agent'
        // },
        {
          id: 3,
          name: "Total",
        },
      ],
      complianceAverage: 0,
      speedometerdata: {},
      period_type_id: 1,
      period_type: [
        {
          id: 1,
          name: "Last 24 hours",
        },
        {
          id: 2,
          name: "Last 7 days",
        },
        {
          id: 3,
          name: "Last 30 days",
        },
        {
          id: 4,
          name: "Custom",
        },
      ],
      compliancePerIntentData: [],
      compliancePerPeriod: [],
      AgentTable: [],
      groups_data: [],
      groupID:
        this.$route.params.id == "total"
          ? ""
          : Number(this.$route.params.id),
      ac_disable: false,
    };
  },
  watch: {
    async groupID(val) {
      if (val != "") {
        this.loadscreen2(true);
        // await this.initialData(this.previousDate_test, this.currentDate_test);
        await this.selectPeriod(this.period_type_id);

        // await this.getGroup();
        // await this.getAverageCompliace();
        // await this.getCompliancePerIntent();
        // await this.getCompliancePerPeriod();
        // await this.getAgentPerPeriod();
        this.loadscreen2(false);
      }

    },
    period_type_id(val) {
      this.selectPeriod(val);
    },
    async view_type_id(val) {

      if (val == 3) {
        this.loadscreen2(true);
        this.groupID = "";
        // await this.initialData(this.previousDate_test, this.currentDate_test);
        await this.selectPeriod(this.period_type_id);
        // await this.getGroup();
        // await this.getAverageCompliace();
        // await this.getCompliancePerIntent();
        // await this.getCompliancePerPeriod();
        // await this.getAgentPerPeriod();
        this.loadscreen2(false);

      }
    }
  },
  methods: {
    ActivateMenu(data) {
      this.showMenu = false;
      if (data == "Custom") {
        this.showMenu = true;
      }
    },
    async getAverageCompliace(start_date = null, end_date = null) {
      try {
        let url = this.view_type_id == 3 ? "/result/compliance/averagebyOrganization" : "/result/compliance/averagebyGroup";

        let r = await this.api_call_get(url, {
          id: this.view_type_id == 3 ? this.org_id : this.groupID,
          start: start_date,
          end: end_date,
        });
        this.complianceAverage = r.data.data[0].average;
        if (this.complianceAverage != 0) {
          this.ac_disable = true;
          setTimeout(() => {
            this.ac_disable = false;
          }, 800);
        }
        this.speedometerdata = { name: "csat", num: this.complianceAverage };
      } catch (err) {
        alert(err.message);
      }
    },
    async getCompliancePerIntent(start_date = null, end_date = null) {
      try {
        let url = this.view_type_id == 3 ? "/result/compliance/perIntentOrganization" : "/result/compliance/perIntentByGroup";

        let r = await this.api_call_get(url, {
          id: this.view_type_id == 3 ? this.org_id : this.groupID,
          start: start_date,
          end: end_date,
        });
        this.compliancePerIntentData = r.data.data;
      } catch (err) {
        alert(err.message);
      }
    },
    async getCompliancePerPeriod(
      start_date = null,
      end_date = null,
      custom = null
    ) {
      try {

        let url = this.view_type_id == 3 ? "/result/compliance/perPeriodByOrganization" : "/result/compliance/perPeriodByGroup";

        let r = await this.api_call_get(url, {
          id: this.view_type_id == 3 ? this.org_id : this.groupID,
          start: start_date,
          end: end_date,
        });
        this.compliancePerPeriod = r.data;
        if (custom != null && start_date == end_date) {
          this.compliancePerPeriod.d_range = "day";
        }
        console.log(this.compliancePerPeriod);
      } catch (err) {
        alert(err.message);
      }
    },
    async getAgentPerPeriod(start_date = null, end_date = null) {
      try {
        let url = this.view_type_id == 3 ? "/result/compliance/perAgentByOrganization" : "/result/compliance/perAgentByGroup";

        let r = await this.api_call_get(url, {
          id: this.view_type_id == 3 ? this.org_id : this.groupID,
          start: start_date,
          end: end_date,
        });

        this.AgentTable = r.data.data;
      } catch (err) {
        alert(err.message);
      }
    },
    async getGroup() {
      const config = {
        url: "/groups?organization_id=" + this.org_id,
        method: "GET",
      };
      const res = await this.api_call(config);
      this.groups_data = res.data.data;
    },
    async initialData(start_date = null, end_date = null, custom) {
      await this.getGroup();
      await this.getAverageCompliace(start_date, end_date);
      await this.getCompliancePerIntent(start_date, end_date);
      await this.getCompliancePerPeriod(start_date, end_date, custom);
      await this.getAgentPerPeriod(start_date, end_date);
    },
    async selectPeriod(id, custom_date = false) {
      switch (id) {
        case 1:
          this.loadscreen2(true);
          await this.initialData(this.last24HoursStart, this.last24HoursEnd);
          console.log("Day");
          this.loadscreen2(false);
          break;
        case 2:
          this.loadscreen2(true);
          await this.initialData(this.last7DaysStart, this.last7DaysEnd);
          console.log("Week");
          this.loadscreen2(false);
          break;
        case 3:
          this.loadscreen2(true);
          await this.initialData(this.last30DaysStart, this.last30DaysEnd);
          console.log("Month");
          this.loadscreen2(false);
          break;
        case 4:
          this.loadscreen2(true);
          if (custom_date) {
            this.load_process = true;
            // const custom_startDate = new Date(this.custom_startDate);
            // const custom_endDate = new Date(this.custom_endDate);
            // const formattedDate = (dateObject) => {
            //   return `${dateObject.getMonth() + 1
            //     }/${dateObject.getDate()}/${dateObject.getFullYear()}`;
            // };
            // await this.initialData(
            //   formattedDate(custom_startDate),
            //   formattedDate(custom_endDate),
            //   "custom"
            // );

            const custom_startDate =  moment(this.custom_startDate).format("YYYY-MM-DD")
            const custom_endDate = moment(this.custom_endDate).format("YYYY-MM-DD")
            await this.initialData(
              custom_startDate,
              custom_endDate, "custom"
            );
            this.load_process = false;
            this.showMenu = false;
          }
          console.log("Custom");
          this.loadscreen2(false);
          break;
        default:
          this.loadscreen2(true);
          console.log("default");
          await this.initialData(this.last24HoursStart, this.last24HoursEnd);
          this.loadscreen2(false);
          break;
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    const access_code = Cookies.get("_aksis_code");
    next()
  },
  async mounted() {
    this.org_id = Cookies.get("_org");
    this.loadscreen(true);
    await this.initialData(this.last24HoursStart, this.last24HoursEnd);
    // await this.getGroup();
    // await this.getAverageCompliace();
    // await this.getCompliancePerIntent();
    // await this.getCompliancePerPeriod();
    // await this.getAgentPerPeriod();
    this.loadscreen(false);

    // setTimeout(() => {
    //   this.getGroup();
    //   this.getAverageCompliace();
    //   this.getCompliancePerIntent();
    //   this.getCompliancePerPeriod();
    //   this.getAgentPerPeriod();
    // }, 60000);
  },
};
</script>
