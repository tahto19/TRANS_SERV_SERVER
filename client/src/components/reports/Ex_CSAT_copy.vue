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

    <v-col v-if="view_type_id == 1"  cols="12">
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
      kpis_chart_data_temp: [],
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
        // this.getScoreCard()
      }
    },
    async view_type_id(val) {
      this.loadscreen2(true);
      console.log(val)
      if (val !== 3) {
        this.loadscreen2(false);
        await this.getGroup();
        this.groupID = "";
      } else {
        // this.selectPeriod(this.period_type_id, true, 1);
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
    async getAgents(start_date = null, end_date = null) {
      // let url = this.view_type_id == 3 ? `/result/getCSAt/getByOrganization?id=${this.org_id}` : "/result/getCSAt/getByGroup?id=" + this.groupID;
      let url;
      if (this.view_type_id == 3) {
        url =
          "/result/getCSAt/getByOrganization?id=" +
          this.org_id +
          "&start=" +
          start_date +
          "&end=" +
          end_date;
      } else {
        url =
          "/result/getCSAt/getByOrganization?id=" +
          this.org_id +
          "&start=" +
          start_date +
          "&end=" +
          end_date;
      }

      if (start_date != null && end_date != null) {
        if (this.view_type_id == 3) {
          url =
            "/result/getCSAt/getByOrganization?id=" +
            this.org_id +
            "&start=" +
            start_date +
          "&end=" +
          end_date;
        } else {
          url =
            "/result/getCSAt/getByGroup?id=" +
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
        // params: {
        //     start: this.previousDate_test,
        //     end: this.currentDate_test,
        //   }
      };
      const res = await this.api_call(config);

      if (res.data.result == "success") {
        (this.groups = []), (this.groups = res.data.data);
        this.speedometerdata = {};
        await this.newStructCSAT(start_date, end_date);
      }
    },
    async newStructCSAT(start_date = null, end_date = null) {
      this.csat_data = {
        avg_csat: null,
        csat_per_intent: [],
      };
      this.csat_per_period = {
        headers: [],
        data: [],
      };
      this.agent_scorecard = {
        agent_data: [],
      };

      if (this.groups.data.length > 0) {
        this.csat_data.avg_csat = this.groups.average;
        if (this.groups.average != null) {
          this.ac_disable = true;
          setTimeout(() => {
            this.ac_disable = false;
          }, 800);
        }
        this.speedometerdata = { name: "csat", num: this.groups.average };
        let intent_headers = [];
        this.groups.data.map((x, h) => {
          if (x.IntentResults.length > 0) {
            const intent_name = x.IntentResults[0].main_intent.intent_name;
            const _filter = this.csat_data.csat_per_intent.filter(
              (z) => z.intent_name == intent_name
            );

            //Get Intents
            if (_filter.length == 0) {
              this.csat_data.csat_per_intent.push({
                intent_name: intent_name,
                kpi_total: null,
                kpi_rating_total: null,
                avg_kpi_rating: null,
                kpis: [],
              });
            }

            //KPIs per Intent
            x.ComputeKpiAnylsis.map((z) => {
              this.csat_data.csat_per_intent.map((e) => {
                const _filter2 = e.kpis.filter((q) => q.kpi == z.kpi);
                if (_filter2.length == 0) {
                  e.kpis.push({
                    kpi: z.kpi,
                    count: 0,
                    avg_rating_per_kpi: 0,
                    total_rating_per_kpi: 0,
                    rating_per_kpi_count: 0,
                  });
                }
              });
            });

            x.ComputeKpiAnylsis.map((z) => {
              //Calculate each KPIs count
              this.csat_data.csat_per_intent.map((e) => {
                if (e.intent_name == intent_name) {
                  e.kpis.map((q) => {
                    if (q.kpi == z.kpi) {
                      q.count = q.count + Number(z.weightConverted);
                      q.total_rating_per_kpi =
                        q.total_rating_per_kpi +
                        Number(z.rating.replace("%", ""));
                      q.rating_per_kpi_count = q.rating_per_kpi_count + 1;
                    }
                  });
                }
              });

              this.csat_data.csat_per_intent.map((e) => {
                e.kpis = e.kpis.map((q) => {
                  var cc = q.count;
                  var rr = q.rating_per_kpi_count;
                  q.avg_count = cc == 0 && rr == 0 ? 0 : cc / rr;
                  return q;
                });
              });

              //Calculate average rating per KPI
              this.csat_data.csat_per_intent.map((e) => {
                e.kpis = e.kpis.map((q) => {
                  q.avg_rating_per_kpi =
                    q.total_rating_per_kpi == 0 && q.rating_per_kpi_count == 0
                      ? 0
                      : q.total_rating_per_kpi / q.rating_per_kpi_count;
                  return q;
                });
              });

              //Calculate KPIs overall total by intent
              this.csat_data.csat_per_intent.map((e) => {
                const total = e.kpis.reduce((accumulator, currentValue) => {
                  return accumulator + currentValue.avg_count;
                }, 0);

                e.kpi_total = total;
              });

              //Calculate KPIs overall total rating (percentage) by intent
              this.csat_data.csat_per_intent.map((e) => {
                let count = 0;
                const total = e.kpis.reduce((accumulator, currentValue) => {
                  count += 1;
                  return accumulator + currentValue.avg_rating_per_kpi;
                }, 0);
                e.kpi_rating_total = total;
                e.avg_kpi_rating = total / count;
              });
            });

            //KPIs
            if (x.KpiAnylses.length > 0) {
              let z = x.KpiAnylses[0];
              let date;
              if (start_date != null && start_date == end_date) {
                date = z.createdAt;
              } else {
                date = this.formatDateString(z.createdAt);
              }
              const _filter = this.csat_per_period.headers.filter(
                (x) => x == date
              );
              if (_filter.length > 0) {
                this.csat_per_period.data.map((o) => {
                  if (_filter[0] == o.date) {
                    o.count += 1;
                    o.csatTotal = o.csatTotal + x.csatTotal;
                  }
                });
              } else {
                this.csat_per_period.headers.push(date);
                this.csat_per_period.data.push({
                  count: 1,
                  csatTotal: x.csatTotal,
                  date: date,
                  csatComputed: 0,
                });
              }
            }

            //Agents

            const _filter2 = this.agent_scorecard.agent_data.filter(
              (z) => z.fullname == x.Agent.fullname
            );
            if (_filter2.length > 0) {
              const index = this.agent_scorecard.agent_data.indexOf(
                _filter2[0]
              );

              this.agent_scorecard.agent_data[index].kpis.map((k) => {
                x.ComputeKpiAnylsis.map((j) => {
                  if (k.kpi == j.kpi) {
                    k.count += 1;
                    k.getWeight += Number(j.weightConverted);
                  }
                });
              });
            } else {
              this.agent_scorecard.agent_data.push({
                fullname: x.Agent.fullname,
                kpis: x.ComputeKpiAnylsis.map((k) => {
                  return {
                    kpi: k.kpi,
                    getWeight: Number(k.weightConverted),
                    count: 1,
                  };
                }),
              });
            }
          }
        });
        this.csat_per_period.data = this.csat_per_period.data.map((x) => {
          x.csatComputed = x.csatTotal / x.count;
          return x;
        });

        this.agent_scorecard.agent_data = this.agent_scorecard.agent_data.map(
          (z) => {
            z.kpis = z.kpis.map((x) => {
              x.computedKpi = x.getWeight / x.count;
              return x;
            });
            return z;
          }
        );
      }

      this.csatPerIntent();
      // this.csatAgentSC();
      if (this.groupID !== "total") {
        if (start_date != null && start_date == end_date) {
          this.csatPerIntentRatings2();
        } else {
          this.csatPerIntentRatings();
        }
      }
    },

    csatPerIntent(data = "cpi") {
      this.csatPerIntent_chart_data = {
        id_name: "cpi",
        labels: this.csat_data.csat_per_intent.map((row) => row.intent_name),
        datasets_data: this.csat_data.csat_per_intent.map(
          (row) => row.kpi_total
        ),
        styles: {
          "max-height": "215px",
        },
        max: 100,
      };
    },

    csatPerIntentRatings(data = "cpi_ratings") {
      this.csatPerPeriod_chart_data = {
        id_name: "cpi_ratings",
        labels: this.csat_per_period.headers,
        datasets_data: this.csat_per_period.data.map((row) => row.csatComputed),
        styles: {
          "max-height": "215px",
        },
      };
    },
    csatPerIntentRatings2(data = "cpi_ratings") {
      this.csatPerPeriod_chart_data = {
        id_name: "cpi_ratings",
        labels: this.csat_per_period.headers,
        datasets_data: this.csat_per_period.data.map((row) => row.csatComputed),
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

    KPIs() {
      this.kpis_chart_data_temp = [];
      this.csat_data.csat_per_intent.map((row, i) => {
        this.kpis_chart_data_temp.push({
          id_name: "kpis" + i,
          labels: row.kpis.map((x) => x.kpi),
          datasets_data: row.kpis.map((x) => x.avg_rating_per_kpi), //change to avg_count
          max: 100,
          intent_name: row.intent_name,
        });
      });
    },
    async getScoreCard(start, end) {
      console.log(this.groupID)
      try {
        let url;
        url = this.view_type_id == 3 ? "/result/getMetricsPerIntentByOrganization" : "/result/getMetricsPerIntentByGroup";
        const data = {
          id: this.view_type_id == 3 ? this.org_id : this.groupID,
          intent: this.score_card_intent,
          start: start,
          end: end,
        };

        const config = {
          url: url,
          method: "POST",
          data: data,
        };
        const res = await this.api_call(config);
        console.log(res)
        if (res.data.result && res.data.result != 'error') {
          this.agent_score_card = res.data.data.filter((x) => x.kpi.length > 0);
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
          key: "name",
          align: "start", sortable: true,
          type: "string"
        },
        { title: "Calls", key: "calls", align: "start", type: "number" },
        { title: "CSAT", key: "csat", align: "start" },
        { title: "Compliance", key: "compliance", align: "start" },
      ];

      this.agent_score_card.map((x) => {
        x.csat = parseFloat(x.csat).toFixed(2) + "%";
        x.compliance = parseFloat(x.compliance) + "%";
        x.kpi.map((i) => {
          if (!this.asc_total_headers.find((n) => n == i.kpi.toLowerCase())) {
            this.asc_total_headers.push(i.kpi.toLowerCase());

            this.asc_headers.push({
              title: i.kpi,
              key: i.kpi.toLowerCase(),
              align: "start",
            });
          }

          x.calls = x.kpi[0].count;
          x[i.kpi.toLowerCase()] = parseFloat(i.weightConverted).toFixed(2)
        });
      });
    },
    async getTopIntents(type = "id", start,end) {
      this.top_intents = [];
      let res;
      if (type == "total") {
        const config = {
          url: "/result/getIntentsByOrg?id=" + this.org_id,
          params:{
            start: start,
            end: end,
          },
          method: "GET",
        };
        res = await this.api_call(config);
      } else {
        const config = {
          url: `/result/getIntentsByGroup?id=${this.groupID}`,
          params:{
            start: start,
            end: end,
          },
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
      await this.selectPeriod(this.period_type_id)
    },
    async initialData(start_date = null, end_date = null, x = null) {
     
        if (this.$route.params.id == "total") {
          await this.getTopIntents("total", start_date, end_date)
        } else {
          await this.getGroup();
          await this.getTopIntents("",start_date, end_date)
        }
      
     
      await this.getScoreCard(start_date, end_date);
      await this.getAgents(start_date, end_date);
      this.kpis_chart_data = [];
      this.$nextTick(() => {
        this.KPIs();
        this.kpis_chart_data = this.kpis_chart_data_temp;
        this.cols_num =
          this.csat_data.csat_per_intent.length >= 4
            ? 6
            : 12 / this.csat_data.csat_per_intent.length;
      });
      this.loadscreen2(false);

    },
  },
  async mounted() {
    console.log(this.$route);
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
