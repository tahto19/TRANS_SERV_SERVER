<template lang="">
  <v-card class="mx-auto my-8 px-5 bt-gray" max-width="100%" elevation="4">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3">
          <div class="d-flex align-center">
            <span class="color-light mr-3">View</span>
            <v-select
              v-model="view_type_id"
              density="compact"
              :items="view_type"
              item-title="name"
              item-value="id"
              variant="outlined"
              height="10"
              hide-details="auto"
            ></v-select>
          </div>
        </v-col>
        <v-col v-if="view_type_id == 1" cols="4" md="4">
          <div class="d-flex align-center">
            <span class="color-light mr-3">Group</span>
            <v-select
              density="compact"
              :items="groups_data"
              item-title="name"
              item-value="id"
              variant="outlined"
              height="10"
              hide-details="auto"
              v-model="groupID"
            ></v-select>
          </div>
        </v-col>
        <v-col cols="12" md="5">
          <div class="d-flex align-center">
            <span class="color-light mr-3">Period</span>
            <v-autocomplete
              v-model="period_type_id"
              density="compact"
              :items="period_type"
              :item-text="(item) => `${item.id}`"
              item-title="name"
              item-value="id"
              variant="outlined"
              height="10"
              hide-details="auto"
              id="menu-activator"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  @click="ActivateMenu(item?.raw?.name)"
                ></v-list-item>
              </template>
            </v-autocomplete>
            <v-menu
              v-if="showMenu"
              v-model="showMenu"
              :close-on-content-click="false"
              activator="#menu-activator"
              location="bottom"
            >
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
                  <v-btn
                    color="primary"
                    variant="tonal"
                    @click="selectPeriod(4, true)"
                  >
                    <v-progress-circular
                      v-if="load_process"
                      color="primary"
                      indeterminate
                    ></v-progress-circular
                    >&nbsp; Submit
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
    <v-col cols="12" md="5">
      <TopSentimentsVue :data="data" />
    </v-col>
    <v-col cols="12" md="7" class="d-flex">
      <IntentByPeriodVue :data="data" />
    </v-col>
    <v-col cols="12">
      <TableSentimentVue :data="dataTable" />
    </v-col>
  </v-row>
</template>
<script>
import TopSentimentsVue from "./TopSentiments.vue";
import IntentByPeriodVue from "./IntentByPeriod.vue";
import TableSentimentVue from "./TableSentiment.vue";
import Cookies from "js-cookie";
import moment from "moment-timezone";

export default {
  components: { TopSentimentsVue, IntentByPeriodVue, TableSentimentVue },
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
        //   id: 2,
        //   name: "Agent",
        // },
        {
          id: 3,
          name: "Total",
        },
      ],
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
      data: [],
      groups_data: [],
      groupID:
        this.$route.params.id == "total"
          ? ""
          : Number(this.$route.params.id),
      dataTable: [],
    };
  },
  watch: {
    async groupID(val) {
      if (val != "") {
        //   this.getData();
        // this.getTableData();
        // await this.initialData(this.previousDate_test, this.currentDate_test);
        await this.selectPeriod(this.period_type_id);


      }
    },
    async view_type_id(val) {
      if (val == 3) {
        this.groupID = "";
      }
      // await this.initialData(this.previousDate_test, this.currentDate_test);
      await this.selectPeriod(this.period_type_id);

      // this.getData();
      // this.getTableData();
    },
    period_type_id(val) {
      this.selectPeriod(val);
    },
  },
  methods: {
    ActivateMenu(data) {
      this.showMenu = false;
      if (data == "Custom") {
        this.showMenu = true;
      }
    },
    async getData(start_date = null, end_date = null, custom = null) {
      let url = this.view_type_id == 3 ? "/result/sentiment/getByOrganization" : "/result/sentiment/getByGroup";

      let r = await this.api_call_get(url, {
        id: this.view_type_id == 3 ? this.org_id : this.groupID,
        start: start_date,
        end: end_date,
      });
      this.data = r.data;
      if (custom !== null && start_date == end_date) {
        this.data.d_range = "day";
      }
    },
    async getTableData(start_date = null, end_date = null, custom = null) {
      let url = this.view_type_id == 3 ? "/result/sentimentTable/getByOrganization" : "/result/sentimentTable/getByGroup";
      let r = await this.api_call_get(url, {
        id: this.view_type_id == 3 ? this.org_id : this.groupID,
        start: start_date,
        end: end_date,
      });
      this.dataTable = r.data.data;
    },
    async getGroup(start_date = null, end_date = null) {
      const config = {
        url: "/groups?organization_id=" + this.org_id,
        method: "GET",
      };
      const res = await this.api_call(config);
      this.groups_data = res.data.data;
    },
    async selectPeriod(id, custom_date = false) {
      switch (id) {
        case 1:
          await this.initialData(this.last24HoursStart, this.last24HoursEnd);
          console.log("Day");
          break;
        case 2:
          this.loadscreen2(true);
          await this.initialData(this.last7DaysStart, this.last7DaysEnd);
          console.log("Week");
          this.loadscreen2(false);

          break;
        case 3:
          await this.initialData(this.last30DaysStart, this.last30DaysEnd);
          console.log("Month");
          break;
        case 4:
          if (custom_date) {
            this.load_process = true;
            // const custom_startDate = new Date(this.custom_startDate);
            // const custom_endDate = new Date(this.custom_endDate);
            // const formattedDate = (dateObject) => {
            //   return `${
            //     dateObject.getMonth() + 1
            //   }/${dateObject.getDate()}/${dateObject.getFullYear()}`;
            // };
            // await this.initialData(
            //   formattedDate(custom_startDate),
            //   formattedDate(custom_endDate),
            //   "custom"
            // );
            const custom_startDate = moment(this.custom_startDate).format("YYYY-MM-DD")
            const custom_endDate = moment(this.custom_endDate).format("YYYY-MM-DD")
            await this.initialData(
              custom_startDate,
              custom_endDate, "custom"
            );
            this.load_process = false;
            this.showMenu = false;
          }
          console.log("Custom");
          break;
        default:
          console.log("default");
          await this.initialData(this.last24HoursStart, this.last24HoursEnd);
          break;
      }
    },
    async initialData(start_date = null, end_date = null, custom) {
      await this.getGroup();
      await this.getData(start_date, end_date, custom);
      await this.getTableData(start_date, end_date);
    },
  },
  async mounted() {
    this.org_id = Cookies.get("_org");
    this.loadscreen(true);
    await this.initialData(this.last24HoursStart, this.last24HoursEnd);
    // await this.getData();
    // await this.getTableData();
    // await this.getGroup();
    this.loadscreen(false);

    // setTimeout(() => {
    //   this.getData();
    //   this.getTableData();
    //   this.getGroup();
    // }, 60000);
  },
};
</script>
<style lang=""></style>
