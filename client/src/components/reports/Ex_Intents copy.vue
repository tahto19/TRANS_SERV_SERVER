<template lang="">
  <v-chip
    :to="{ name: 'reports_default', params: { id: this.$route.params.id } }"
    variant="text"
    class="mb-3 px-0"
  >
    <v-icon color="rgb(0, 116, 228)" start icon="mdi-chevron-left"></v-icon>
    <p style="color: rgb(0, 116, 228)">Back to call analysis</p>
  </v-chip>
  <h1 class="top-header">Intent</h1>

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
    <v-col cols="5" md="5">
      <v-card class="mx-auto px-3 pt-1 pb-1 bt-blue" max-width="100%" elevation="4">
        <v-card-title class="d-flex justify-space-between mb-2">
          Top Intents
        </v-card-title>
        <v-card-text>
          <c-horizontal-bar :chart="intent_chart_data" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="7" md="7" class="d-flex">
      <v-card class="mx-auto px-3 pt-1 pb-1 bt-blue" min-width="100%" elevation="4">
        <v-card-title class="d-flex justify-space-between mb-2">
          Intent by Period
        </v-card-title>
        <v-card-text>
          <c-bar-stack :chart="intentPerPeriod_chart_data" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card class="mx-auto px-3 pt-1 pb-1 bt-gray" max-width="100%" elevation="4">
        <v-card-title class="d-flex justify-space-between mb-2">
          <c-horizontal-bar-stack :chart="agent_dataset" />
          <!-- <v-data-table
            :headers="agent_headers"
            :items="agent_dataset"
          ></v-data-table> -->
        </v-card-title>
        <v-card-text> </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import Cookies from "js-cookie";
import moment from "moment-timezone";

export default {
  emits: ["showNotification", "loadingScreen", "loadingScreen2"],
  data() {
    return {
      org_id: null,
      custom_startDate: new Date(),
      custom_endDate: new Date(),
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
      groupID:
        this.$route.params.id == "total"
          ? ""
          : Number(this.$route.params.id),
      groups_data: [],
      groups: [
        {
          QueueAgents: [],
          ChatGroupQueueResultCSAT: {},
          ChatGroupQueueResultSentiments: [],
          ChatGroupQueueResultIntents: [],
          code: "asd",
        },
      ],
      top_intents: [],
      chart_dataset: [],
      agent_dataset: [],
      agent_headers: [{ title: "Agent", key: "fullname", align: "start" }],
      showMenu: false,
      load_process: false,
      intent_chart_data: {},
      intentPerPeriod_chart_data: {},
    };
  },
  watch: {
    period_type_id(val) {
      this.selectPeriod(val);
    },
    async groupID(val) {
      this.loadscreen2(true);
      await this.changeGroup()
      this.loadscreen2(false);
    },
    async view_type_id(val) {

      if (val !== 3) {
        this.groupID = "";
      } else {
        this.loadscreen2(true);

        this.groupID = "total";
        this.loadscreen2(false);
      }

    },
  },
  methods: {
    ActivateMenu(data) {
      this.showMenu = false;
      if (data == "Custom") {
        this.showMenu = true;
      }
    },
    formatDateTime(inputDateTime) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
    },
    periodDatasetEdit(data_array, start_date = null, end_date = null) {
      let data = { labels: [], datasets: [] };
      var color_id = 0;
      let new_struct = [];

      data_array.map((x) => {
        let date = null;
        if (x.IntentResults[0]) {

          if (start_date != null && start_date == end_date) {
            date = x.queue_date;
          } else {
            date = this.formatDateString(x.queue_date)
          }

          const _filter = new_struct.filter((x) => x.date == date);

          if (_filter.length == 0) {
            new_struct.push({
              date: date,
              group: [x.IntentResults[0].main_intent.intent_name.toUpperCase()],
            });
          } else {
            const index = new_struct.indexOf(_filter[0]);
            new_struct[index].group.push(
              x.IntentResults[0].main_intent.intent_name.toUpperCase()
            );
          }
        }
        return x;
      });

      new_struct.map((x, i) => {
        data.labels.push(x.date);
        let l = x.date;

        x.group.map((e) => {
          const _filter = data.datasets.filter((x) => x.label == e);
          if (_filter.length == 0) {
            data.datasets.push({
              label: e,
              backgroundColor: this.color_picker[color_id],
              data: [],
            });
            color_id = color_id + 1;
          }
          return e;
        });
      });
      data.datasets.map((x) => {
        data.labels.map((z) => {
          x.data.push(0);
        });
      });

      data.datasets.map((x) => {
        data.labels.map((z, i) => {
          let count = 0;
          new_struct.map((a) => {
            if (z == a.date) {
              a.group.map((q) => {
                if (x.label == q) {
                  count += 1;
                }
              });
            }
          });
          if (count == 0) {
            x.data[i] = null;
          } else {
            x.data[i] = count;
          }
        });
      });

      //   }
      data.datasets = data.datasets.map(x => { x.label = this.capitalizeFirstLetter(x.label.toLowerCase()); return x; });
      this.chart_dataset = data
      console.log(this.chart_dataset)
      if (start_date != null && start_date == end_date) {
        this.intentByPeriod2()
      } else {
        this.intentByPeriod();
      }

    },
    agentDataset(data) {
      const agents = {
        datasets: [],
        labels: [],
      }
      const labels = []
      const intents = []
      const datasets = []
      console.log(data)
      data.map(x => {
        const name = x.Agent.fullname;
        const _filter = labels.filter(q => q == name)
        if (_filter.length == 0) {
          labels.push(name);
        }

        const intent = x.IntentResults[0].main_intent.intent_name;
        const _filter2 = intents.filter(q => q == intent)
        if (_filter2.length == 0) {
          intents.push(intent);
        }
      })

      intents.map((x, p) => {
        const d = [];
        labels.map((c, i) => {
          d.push(null);
          data.map(v => {
            if (c == v.Agent.fullname) {
              if (x == v.IntentResults[0].main_intent.intent_name) {
                d[i] += 1
              }
            }
          })
        })
        datasets.push(
          {
            backgroundColor: this.color_picker[p],
            label: x,
            data: d,
            barPercentage: 0.5,
            padding: 1,
          }
        )
      })

      agents.labels = labels
      agents.datasets = datasets
      // ================== DO NOT DELETE ===============
      // this.agent_headers;
      // const agents = [];
      // const headers = [];
      // this.agent_headers = [
      //   { title: "Agent", key: "fullname", align: "start" },
      // ];
      // data.map((x) => {
      //   if (x.IntentResults.length !== 0) {
      //     const _filter = agents.filter((y) => y.fullname == x.Agent.fullname);
      //     const _filter2 = headers.filter(
      //       (y) => y.toUpperCase() == x.IntentResults[0].main_intent.intent_name.toUpperCase()
      //     );

      //     if (_filter.length == 0) {
      //       agents.push({ fullname: x.Agent.fullname });
      //     }

      //     if (_filter2.length == 0) {
      //       this.agent_headers.push({
      //         title: x.IntentResults[0].main_intent.intent_name.toUpperCase(),
      //         key: x.IntentResults[0].main_intent.intent_name.toUpperCase(),
      //         align: "start",
      //       });
      //       headers.push(x.IntentResults[0].main_intent.intent_name.toUpperCase());
      //     }
      //   }
      // });

      // headers.map((x) => {
      //   agents.map((q) => {
      //     q[x] = null;
      //   });
      // });

      // agents.map((x) => {
      //   // const count_array = []
      //   headers.map((q, i) => {
      //     let count = 0;
      //     data.map((y) => {
      //       if (y.IntentResults.length !== 0) {
      //         if (
      //           x.fullname == y.Agent.fullname &&
      //           q == y.IntentResults[0].main_intent.intent_name.toUpperCase()
      //         ) {
      //           count += 1;
      //         }
      //       }
      //     });

      //     if (count == 0) {
      //       x[q] = null;
      //     } else {
      //       x[q] = count;
      //     }
      //   });
      // });

      this.agent_dataset = {
        id_name: "agent",
        data: agents
      }

      console.log(this.agent_dataset)
    },
    async getAgents(start_date = null, end_date = null) {
      // let url = "/result/getCSAt/getByGroup?id=" + this.groupID;

      // if (start_date != null && end_date != null) {
      //   url =
      //     "/result/getCSAt/getByGroup?id=" +
      //     this.groupID +
      //     "&start=" +
      //     start_date +
      //     "&end=" +
      //     end_date;
      // }

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
          "/result/getCSAt/getByGroup?id=" +
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
      };
      const res = await this.api_call(config);

      if (res.data.result == "success") {
        console.log(res.data.data.data);
        this.groups = res.data.data;
        this.periodDatasetEdit(this.groups.data, start_date, end_date);
        this.agentDataset(this.groups.data);
        await this.getTopIntents(start_date, end_date);
      }
    },
    async getTopIntents(start_date = null, end_date = null) {
      this.top_intents = [];

      // let url = this.view_type_id == 3 ? `/result/getByOrganization?id=${this.org_id}` : "/result/getByGroup?id=" + this.groupID;
      let url;

      if (this.view_type_id == 3) {
        url =
          "/result/getByOrganization?id=" +
          this.org_id +
          "&start=" +
          start_date +
          "&end=" +
          end_date;
      } else {
        url =
          "/result/getByGroup?id=" +
          this.org_id +
          "&start=" +
          start_date +
          "&end=" +
          end_date;
      }
      if (start_date != null && end_date != null) {
        if (this.view_type_id == 3) {
          url =
            "/result/getByOrganization?id=" +
            this.org_id +
            "&start=" +
            start_date +
            "&end=" +
            end_date;
        } else {
          url =
            "/result/getByGroup?id=" +
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
        this.top_intents = res.data.data.MainIntentTotal;
        this.top_intents = this.top_intents.filter(
          (x) => x.Intent_Name.toUpperCase() !== null
        );
      }
      this.intentGraph();
    },
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    intentGraph() {
      const highestScore_intent = this.top_intents.reduce(
        (maxScore, currentItem) => {
          return currentItem.main_intent_count > maxScore
            ? currentItem.main_intent_count
            : maxScore;
        },
        0
      );

      this.intent_chart_data = {
        id_name: "top-intents",
        labels: this.top_intents.map((row) => this.capitalizeFirstLetter(row.Intent_Name.toLowerCase())),
        datasets_data: this.top_intents.map((row) => row.main_intent_count),
        max: highestScore_intent * 1.5,
      }
    },
    intentByPeriod(data = "period") {
      this.intentPerPeriod_chart_data = {
        id_name: "period",
        data: this.chart_dataset,
        styles: {
          "max-height": "215px",
        },
      }

      console.log(this.intentPerPeriod_chart_data)
    },
    intentByPeriod2(data = "period") {
      this.intentPerPeriod_chart_data = {
        id_name: "period",
        data: this.chart_dataset,
        styles: {
          "max-height": "215px",
        },
        options: {
          scales: {
            x: {
              type: "timeseries"
            }
          }
        }
      }
    },
    async selectPeriod(id, custom_date = false) {
      switch (id) {
        case 1:
          this.loadscreen2(true);

          await this.getAgents(this.last24HoursStart, this.last24HoursEnd);
          console.log("Day");
          this.loadscreen2(false);
          break;
        case 2:
          this.loadscreen2(true);
          await this.getAgents(this.last7DaysStart, this.last7DaysEnd);
          console.log("Week");
          this.loadscreen2(false);
          break;
        case 3:
          this.loadscreen2(true);
          await this.getAgents(this.last30DaysStart, this.last30DaysEnd);
          console.log("Month");
          this.loadscreen2(false);
          break;
        case 4:
          this.loadscreen2(true);
          if (custom_date) {
            this.load_process = true;
            const custom_startDate = moment(this.custom_startDate).format("YYYY-MM-DD")
            const custom_endDate = moment(this.custom_endDate).format("YYYY-MM-DD")
            await this.getAgents(
              custom_startDate,
              custom_endDate
            );
            this.load_process = false;
            this.showMenu = false;
          }
          this.loadscreen2(false);
          break;
        default:
          this.loadscreen2(true);
          await this.initialData(this.last24HoursStart, this.last24HoursEnd);
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
      // this.period_type_id = null
      // await this.initialData()
      await this.selectPeriod(this.period_type_id)
    },
    async initialData(start_date = null, end_date = null) {
      await this.getGroup();
      await this.getAgents(start_date, end_date);
    },
  },
  async mounted() {
    this.org_id = Cookies.get("_org");
    this.loadscreen(true);
    await this.initialData(this.last24HoursStart, this.last24HoursEnd);
    this.loadscreen(false);
    // setTimeout(()=>{
    //    this.initialData();
    // },60000)
  },
};
</script>
<style lang=""></style>
