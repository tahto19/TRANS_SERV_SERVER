<template lang="">
  <v-chip
    :to="{ name: 'reports_default', params: { id: 'total' } }"
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
        <v-progress-circular v-if="load_process" color="primary" indeterminate></v-progress-circular>&nbsp; Submit
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
    agentDataset(data) {
      const agents = {
        datasets: [],
        labels: [],
      }

      const labels = []
      const intents = []
      const datasets = []

      data.map(x => {
        x.intents.map(q => {
          const _filter = intents.filter(z => z == q.name)
          if (_filter.length == 0) {
            intents.push(q.name)
          }
        })

        const _filter_name = labels.filter(z => z == x.agent_name)
        if (_filter_name.length == 0) {
          labels.push(x.agent_name)
        }

      })

      intents.map((x, p) => {
        const d = [];
        labels.map((c, i) => {
          d.push(null);
          data.map(v => {
            if (c == v.agent_name) {
              v.intents.map(q => {
                if (x == q.name) {
                  d[i] += q.count
                }
              })

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
      this.agent_dataset = {
        id_name: "agent",
        data: agents
      }
    },
    async getAgents(start_date = null, end_date = null) {
      let url;

      if (this.view_type_id == 3) {
        url =
          "/result/getIntentV2/getByOrganization?id=" +
          this.org_id +
          "&start=" +
          start_date +
          "&end=" +
          end_date;
      } else {
        url =
          "/result/getIntentV2/getByGroup?id=" +
          this.org_id +
          "&start=" +
          start_date +
          "&end=" +
          end_date;
      }

      if (start_date != null && end_date != null) {
        if (this.view_type_id == 3) {
          url =
            "/result/getIntentV2/getByOrganization?id=" +
            this.org_id +
            "&start=" +
            start_date +
            "&end=" +
            end_date;
        } else {
          url =
            "/result/getIntentV2/getByGroup?id=" +
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
        this.groups = res.data.data;
        this.periodDatasetEdit(this.groups.IntentPerPeriod);
        this.agentDataset(this.groups.perAgent);
        this.intentGraph(this.groups.totalPerIntent);
      }
    },
    periodDatasetEdit(data) {
      let dates = []
      let chart_data = {
        datasets: [],
        labels: []
      }

      data.map(x => {
        const _split = x.formattedCreatedAt.split(" ")
        const _filter = dates.filter(q => q == _split[0])
        if (_filter.length == 0) {
          dates.push(_split[0])
        }
      })
      console.log(dates)
      if (dates.length == 1) {
        dates = [];

        data.map(x => {
          const _split = x.formattedCreatedAt.split(" ")
          if (_split.length > 1) {
            const _filter = dates.filter(q => q == _split[1] + " " + _split[2])
            if (_filter.length == 0) {
              dates.push(_split[1] + " " + _split[2])
            }
          } else {
            const _filter = dates.filter(q => q == _split[0])
            if (_filter.length == 0) {
              dates.push(_split[0])
            }
          }

        })

        dates.map((x, i) => {
          data.map((z) => {
            const _split = z.formattedCreatedAt.split(" ")
            if (_split.length > 1) {
              if (x == _split[1] + " " + _split[2]) {
                const _filter = chart_data.datasets.filter(p => p.label == z.name)
                if (_filter.length == 0) {
                  chart_data.datasets.push({
                    backgroundColor: "",
                    data: [],
                    label: z.name
                  })
                }
              }
            } else {
              if (x == _split[0]) {
                const _filter = chart_data.datasets.filter(p => p.label == z.name)
                if (_filter.length == 0) {
                  chart_data.datasets.push({
                    backgroundColor: "",
                    data: [],
                    label: z.name
                  })
                }
              }
            }
          })
        })

        // dates.map((x, i) => {
        //   data.map(z => {
        //     if (x == z.formattedCreatedAt) {
        //       const _filter = chart_data.datasets.filter(p => p.label == z.name)
        //       if (_filter.length == 0) {
        //         chart_data.datasets.push({
        //           backgroundColor: "",
        //           data: [],
        //           label: z.name
        //         })
        //       }
        //     }
        //   })
        // })
      } else {
        // dates = [];

        // data.map(x => {
        //   const _split = x.formattedCreatedAt.split(" ")
        //   const _filter = dates.filter(q => q == _split[1] + " " + _split[2])
        //   if (_filter.length == 0) {
        //     dates.push(_split[1] + " " + _split[2])
        //   }
        // })

        dates.map((x, i) => {
          data.map((z) => {
            const _split = z.formattedCreatedAt.split(" ")
            if (x == _split[0]) {
              const _filter = chart_data.datasets.filter(p => p.label == z.name)
              if (_filter.length == 0) {
                chart_data.datasets.push({
                  backgroundColor: "",
                  data: [],
                  label: z.name
                })
              }
            }
          })
        })
      }
      //   dates.map((x, i) => {
      //     data.map((z) => {
      //       const _split = z.formattedCreatedAt.split(" ")
      //       if (x == _split[1] + " " + _split[2]) {
      //         const _filter = chart_data.datasets.filter(p => p.label == z.name)
      //         if (_filter.length == 0) {
      //           chart_data.datasets.push({
      //             backgroundColor: "",
      //             data: [],
      //             label: z.name
      //           })
      //         }
      //       }
      //     })
      //   })
      // }

      data.map(z => {
        chart_data.datasets.map((x, i) => {
          if (z.name == x.label) {
            x.data.push(z.count)
          }
          x.backgroundColor = this.color_picker[i]
        })
      })

      console.log(dates)
      chart_data.labels = dates;
      console.log(chart_data)
      this.intentPerPeriod_chart_data = {
        id_name: "period",
        data: chart_data,
        styles: {
          "max-height": "215px",
        },
      }
    },
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    intentGraph(data) {
      const highestScore_intent = data.reduce(
        (maxScore, currentItem) => {
          return currentItem.count > maxScore
            ? currentItem.count
            : maxScore;
        },
        0
      );

      this.intent_chart_data = {
        id_name: "top-intents",
        labels: data.map((row) => this.capitalizeFirstLetter(row.name)),
        datasets_data: data.map((row) => row.count),
        max: highestScore_intent * 1.5,
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
  },
};
</script>

<style lang=""></style>
