<template lang="">
    <v-chip
      :to="{ name: 'reports_default', params: { id: 'total' } }"
      variant="text"
      class="mb-3 px-0"
    >
      <v-icon color="rgb(0, 116, 228)" start icon="mdi-chevron-left"></v-icon>
      <p style="color: rgb(0, 116, 228)">Back to call analysis</p>
    </v-chip>
    <h1 class="top-header">Call Ratings</h1>
  
    <v-card class="mx-auto my-8 px-5 bt-gray" max-width="100%" elevation="4">
      <v-card-text>
        <v-row>
          <v-col cols="3" md="3">
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
          <v-col cols="5" md="5">
          <div
            class="d-flex align-center"
            style="position: relative !important"
          >
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
              :disabled="ac_disable"
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
      <v-col cols="12" md="4" class="d-flex" width="100">
        <v-card
          class="mx-auto px-3 pt-1 pb-1 bt-blue"
          min-width="100%"
          elevation="4"
        >
          <v-card-title class="d-flex justify-space-between mb-2">
            Average Call Ratings
          </v-card-title>
          <v-card-text>
            <c-speedometer :speedometerdata="speedometerdata" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card
          class="mx-auto px-3 pt-1 pb-1 bt-blue"
          max-width="100%"
          elevation="4"
        >
          <v-card-title class="d-flex justify-space-between mb-2">
            Call Ratings Per Intent
          </v-card-title>
          <v-card-text>
            <c-horizontal-bar :chart="csatPerIntent_chart_data" />
          </v-card-text>
        </v-card>
      </v-col>
  
      <!-- <v-col v-if="view_type_id == 1"  cols="12"> -->
      <v-col cols="12">
        <v-card
          class="mx-auto px-3 pt-1 pb-1 bt-red"
          max-width="100%"
          elevation="4"
        >
          <v-card-title class="d-flex justify-space-between mb-2">
            Call Ratings Per Period
          </v-card-title>
          <v-card-text>
            <c-line :chart="csatPerPeriod_chart_data" />
          </v-card-text>
        </v-card>
      </v-col>
  
      <v-col cols="12">
        <v-row>
          <v-col
            v-if="kpis_chart_data.length > 0"
            v-for="(item, i) in kpis_chart_data"
            cols="12"
            md="6"
          >
            <v-card
              class="mx-auto px-3 pt-1 pb-1 bt-yellow"
              max-width="100%"
              elevation="4"
            >
              <v-card-title class="d-flex justify-space-between mb-2">
                {{ item.intent_name }}
              </v-card-title>
              <v-card-text>
                <c-horizontal-bar :chart="item" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <score-card
            :data="agent_score_card"
            v-model="score_card_intent"
            :total_headers="asc_total_headers"
            :headers="asc_headers"
            :intents="top_intents"
          />
      </v-col>
    </v-row>
  </template>
<script>
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Cookies from "js-cookie";
import moment from "moment-timezone";

// Chart.register(...registerables);
export default {
  emits: ["showNotification", "loadingScreen", "loadingScreen2"],
  data() {
    return {
      org_id: null,
      custom_startDate: new Date(),
      custom_endDate: new Date(),
      load_process: false,
      showMenu: false,
      speedometerdata: {},
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
      cols_num: null,
      groupID:
        this.$route.params.id == "total"
          ? ""
          : Number(this.$route.params.id),
      groups_data: [],
      groups: [],
      csat_data: {
        avg_csat: null,
        csat_per_intent: [],
      },
      csat_per_period: {
        headers: [],
        data: [],
      },
      agent_scorecard: {
        agent_data: [],
      },
      ac_disable: false,
      csatPerIntent_chart_data: {},
      csatPerPeriod_chart_data: {},
      kpis_chart_data: [],
      asc_headers: [
        {
          title: "Name",
          key: "name",
          value: (item) => `${item.name}`,
          align: "center", sortable: true
        },
        { title: "Calls", key: "calls", align: "center", sortable: true },
      ],
      asc_total_headers: [],
      score_card_intent: "",
      agent_score_card: [],
      top_intents: [],
    };
  },
  watch: {
    period_type_id(val) {
      this.selectPeriod(val);
    },
    groupID(val) {
      if (val != "") {
        this.loadscreen2(true);

        this.changeGroup();
        this.getScoreCard()
      }
    },
    async view_type_id(val) {
      this.loadscreen2(true);

      if (val !== "total") {
        this.loadscreen2(false);
        await this.getGroup();
        this.groupID = "";
      } else {
        this.groupID = "total";
      }
    },
    async score_card_intent(val) {
      await this.getScoreCard();
    },
  },
  methods: {
    ActivateMenu(data) {
      this.showMenu = false;
      if (data == "Custom") {
        this.showMenu = true;
      }
    },
    async csatPerPeriod(start_date = null, end_date = null) {
      if (this.groupID !== "total") {
        let url = this.view_type_id == 3 ? "/result/getCSATPerPeriod/getByOrganization" : "/result/getCSATPerPeriod/getByGroup";
        let params = {
          id: this.view_type_id == 3 ? this.org_id : this.groupID,
          start: start_date,
          end: end_date,
        }

        const config = {
          url: url,
          params: params,
          method: "GET",
        };
        const res = await this.api_call(config);
        if (res.data.result == "success") {
          if (start_date != null && start_date == end_date) {
            // this.csatPerIntentRatings2(res.data.data);
            this.csatPerIntentRatings(res.data.data);

          } else {
            this.csatPerIntentRatings(res.data.data);
            
          }
        }
      }
    },
    async newStructCSAT(start_date = null, end_date = null) {

      // await this.csatPerIntent();
      // this.csatAgentSC();
      if (this.groupID !== "total") {
        if (start_date != null && start_date == end_date) {
          this.csatPerIntentRatings2();
        } else {
          this.csatPerIntentRatings();
        }
      }
    },

    async csatPerIntent(start_date = null, end_date = null) {
      let url = this.view_type_id == 3 ? `/result/getCSATPerIntent/getByOrganization?id=${this.org_id}` : "/result/getCSATPerIntent/getByGroup?id=" + this.groupID;

      if (this.view_type_id == 3) {
          url =
            "/result/getCSATPerIntent/getByOrganization?id=" +
            this.org_id +
            "&start=" +
            start_date +
            "&end=" +
            end_date;
        } else {
          url =
            "/result/getCSATPerIntent/getByGroup?id=" +
            this.groupID +
            "&start=" +
            start_date +
            "&end=" +
            end_date;
        }

      if (start_date != null && end_date != null) {
        if (this.view_type_id == 3) {
          url =
            "/result/getCSATPerIntent/getByOrganization?id=" +
            this.org_id +
            "&start=" +
            start_date +
            "&end=" +
            end_date;
        } else {
          url =
            "/result/getCSATPerIntent/getByGroup?id=" +
            this.groupID +
            "&start=" +
            start_date +
            "&end=" +
            end_date;
        }

      }

      const config = {
        url: url,
        method: "GET",
      };
      const res = await this.api_call(config);

      if (res.data.result == "success") {
        this.csatPerIntent_chart_data = {
          id_name: "cpi",
          labels: res.data.data.map((row) => row.intent_name),
          datasets_data: res.data.data.map(
            (row) => row.average
          ),
          styles: {
            "max-height": "215px",
          },
          max: 100,
        };
      }
    },

    csatPerIntentRatings(data) {
      let dates = []
      let datasets_data = []
      let count = []
  
      data.map(x => {
        const _split = x.formattedCreatedAt.split(" ")
        const _filter = dates.filter(q => q == _split[0])
        if (_filter.length == 0) {
          dates.push(_split[0])
          datasets_data.push(null)
          count.push(null)

        }
      })
      console.log("=====",dates)
      if (dates.length == 1) {
        dates = [];
        datasets_data = [];
        count = [];

        data.map(x => {
          const _split = x.formattedCreatedAt.split(" ")
          const _filter = dates.filter(q => q == _split[1] + " " + _split[2])
          if (_filter.length == 0) {
            dates.push(_split[1] + " " + _split[2])
            datasets_data.push(null)
            count.push(null)
          }
        })

        dates.map((x, i) => {
          data.map((z) => {
            const _split = z.formattedCreatedAt.split(" ")
            if (x == _split[1] + " " + _split[2]) {
    
              datasets_data[i] += z.average
              count[i] += 1
            
            }
          })
        })

        datasets_data = datasets_data.map((x, i) => {
        x = x / count[i]
        return x
      })
      
      } else {


        dates.map((x, i) => {
          data.map((z) => {
            const _split = z.formattedCreatedAt.split(" ")
            if (x == _split[0]) {
              datasets_data[i] += z.average
              count[i] += 1
            }
          })
        })

        datasets_data = datasets_data.map((x, i) => {
        x = x / count[i]
        return x
      })
      }
      

      
      this.csatPerPeriod_chart_data = {
        id_name: "cpi_ratings",
        labels: dates,
        datasets_data: datasets_data,
        styles: {
          "max-height": "215px",
        },
      };

      // this.csatPerPeriod_chart_data = {
      //   id_name: "cpi_ratings",
      //   labels: data.map((row) => row.formattedCreatedAt),
      //   datasets_data: data.map((row) => row.average),
      //   styles: {
      //     "max-height": "215px",
      //   },
      // };
      console.log(this.csatPerPeriod_chart_data)
    },
    csatPerIntentRatings2(data) {
      this.csatPerPeriod_chart_data = {
        id_name: "cpi_ratings",
        labels: data.map((row) => row.formattedCreatedAt),
        datasets_data: data.map((row) => row.average),
        styles: {
          "max-height": "215px",
        },
        options: {
          scales: {
            x: {
              type: "timeseries",
            },
          },
        },
      };
    },

    async KPIs(start_date = null, end_date = null) {
      let res;
      const type = this.$route.params.id

      if (type == "total") {
        const config = {
          url: "/result/getCSATPerKPI/getByOrganization?id=" + this.org_id,
          // params: {
          //   start: start_date,
          //   end: end_date,
          // },
          method: "GET",
        };
        res = await this.api_call(config);
      } else {
        const config = {
          url: `/result/getCSATPerKPI/getByGroup?id=${this.groupID}`,
          params: {
            start: start_date,
            end: end_date,
          },
          method: "GET",
        };
        res = await this.api_call(config);
      }

      if (res.data.result && res.data.result != 'error') {
        let temp = []
        res.data.data.a.map(x => {
          const checking_intent = temp.filter((z, i) =>
            z.intent_name == x.intent_name

          )

          if (checking_intent.length > 0) {
            const _index = temp.findIndex(z => z.intent_name == checking_intent[0].intent_name)
            temp[_index].kpis.push({ ...x })
          } else {
            temp.push({
              intent_name: x.intent_name,
              kpis: [{ ...x }]
            })
          }
        })

        this.kpis_chart_data = [];
        temp.map((row, i) => {
          this.kpis_chart_data.push({
            id_name: "kpis" + i,
            labels: row.kpis.map((x) => x.kpi_name),
            datasets_data: row.kpis.map((x) => x.average), //change to avg_count
            max: 100,
            intent_name: row.intent_name,
          });
        });
      }
    },
    async getAverageCsat(start_date = null, end_date = null) {
      try {
        let url;
        url = this.view_type_id == 3 ? "/result/getCSATversion2/getByOrganization" : "/result/getCSATversion2/getByGroup";
        const data = {
          id: this.view_type_id == 3 ? this.org_id : this.groupID,
          start: start_date,
          end: end_date,
        };

        const config = {
          url: url,
          method: "GET",
          params: data,
        };

        const res = await this.api_call(config);
        if (res.data.result && res.data.result != 'error') {
          this.speedometerdata = { name: "csat", num: res.data.data.average !== "NaN" ? res.data.data.average : 0 };
          console.log(this.speedometerdata)
        }

      } catch (error) {
        console.error(error.message)
      }
    },
    async getScoreCard(start, end) {
      try {
        let url;
        url = this.view_type_id == 3 ? "/result/getCSATAgentScoreCard/getByOrganization" : "/result/getCSATAgentScoreCard/getByGroup";
        const data = {
          id: this.view_type_id == 3 ? this.org_id : this.groupID,
          intent: this.score_card_intent,
          // start: start,
          // end: end,
        };

        const config = {
          url: url,
          method: "GET",
          params: data,
        };

        const res = await this.api_call(config);
        if (res.data.result && res.data.result != 'error') {
          this.agent_score_card = res.data.data
          this.addHeaders();
        }

      } catch (error) {
        console.error(error.message)
      }
    },
    addHeaders() {
      this.asc_total_headers = [];
      this.asc_headers = [
        {
          title: "Name",
          key: "agent_name",
          align: "start", sortable: true,
          type: "string"
        },
        { title: "Calls", key: "calls", align: "start", type: "number" },
        { title: "CSAT", key: "csat", align: "start" },
        { title: "Compliance", key: "compliance", align: "start" },
      ];

      this.agent_score_card.map((x) => {
        x.csat = parseFloat(x.csatAverage).toFixed(2) + "%";
        x.compliance = parseFloat(x.complianceAverage).toFixed(2) + "%";
        x.kpi.map((i) => {
          if (!this.asc_total_headers.find((n) => n == i.kpi_name.toLowerCase())) {
            this.asc_total_headers.push(i.kpi_name.toLowerCase());

            this.asc_headers.push({
              title: i.kpi_name,
              key: i.kpi_name.toLowerCase(),
              align: "start",
            });
          }
          x[i.kpi_name.toLowerCase()] = parseFloat(i.average).toFixed(2)
        });

        return x;
      });
    },

    async getTopIntents(type = "id") {
      this.top_intents = [];
      let res;
      if (type == "total") {
        const config = {
          url: "/result/getIntentsByOrg?id=" + this.org_id,
          method: "GET",
        };
        res = await this.api_call(config);
      } else {
        const config = {
          url: `/result/getIntentsByGroup?id=${this.groupID}`,
          method: "GET",
        };
        res = await this.api_call(config);
      }

      if (res.data.result == "success") {
        this.top_intents = res.data.data;
        if (this.top_intents[0]) {
          this.score_card_intent = this.top_intents[0].intent;
        }

        this.top_intents = this.top_intents.filter((x) => x.intent !== null);

      }
    },
    getCurrentWeekDates() {
      const currentDate = new Date();

      // Calculate 1 week ago from the current date
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(currentDate.getDate() - 6);

      return {
        startDate: oneWeekAgo.toISOString().split("T")[0],
        endDate: currentDate.toISOString().split("T")[0],
      };
    },
    async selectPeriod(id, custom_date = false, x = null) {
      switch (id) {
        case 1:
          this.loadscreen2(true);
          await this.initialData(this.last24HoursStart, this.last24HoursEnd, x);
          console.log("Day");
          this.loadscreen2(false);
          break;
        case 2:
          this.loadscreen2(true);
          await this.initialData(this.last7DaysStart, this.last7DaysEnd, x);
          console.log("Week");
          this.loadscreen2(false);
          break;
        case 3:
          this.loadscreen2(true);
          await this.initialData(this.last30DaysStart, this.last30DaysEnd, x);

          console.log("Month");
          this.loadscreen2(false);
          break;
        case 4:
          if (custom_date) {
            this.loadscreen2(true);
            const custom_startDate =  moment(this.custom_startDate).format("YYYY-MM-DD")
            const custom_endDate = moment(this.custom_endDate).format("YYYY-MM-DD")
            await this.initialData(
              custom_startDate,
              custom_endDate, x
            );
            this.load_process = false;
            this.showMenu = false;
            this.loadscreen2(false);
          }
          console.log("Custom");
          break;
        default:
          this.loadscreen2(true);
          console.log("default");
          await this.initialData(this.last24HoursStart, this.last24HoursEnd, x);

          this.loadscreen2(false);
          break;
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
    async changeGroup() {
      // this.period_type_id = null;
      // await this.initialData(this.last24HoursStart, this.last24HoursEnd);
      await this.selectPeriod(this.period_type_id)
    },
    async initialData(start_date = null, end_date = null) {
      if (this.$route.params.id == "total") {
        await this.getTopIntents("total", start_date, end_date)
      } else {
        await this.getGroup();
        await this.getTopIntents("",start_date, end_date)
      }
      await this.getScoreCard(start_date, end_date);
      await this.csatPerIntent(start_date, end_date);
      await this.getAverageCsat(start_date, end_date);
      await this.KPIs(start_date, end_date);
      await this.csatPerPeriod(start_date, end_date)
      this.loadscreen2(false);

    },
  },
  async mounted() {
    this.loadscreen2(true);

    this.org_id = Cookies.get("_org");
    await this.initialData(this.last24HoursStart, this.last24HoursEnd);
    // setTimeout(()=>{
    //    this.initialData();
    // },60000)
  },
};
</script>
<style lang=""></style>
  