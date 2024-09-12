<template lang="">
  <h1 class="top-header">Call Analysis</h1>
  <div id="graphs">
    <!-- <v-card class="mx-auto mt-7 px-3 pt-1 pb-1" max-width="100%" elevation="4">
      <v-card-text>
        <div class="av-csat average">
          <span class="title">
            <span class="font-weight-bold">Average CSAT</span
            >&nbsp;&nbsp;&nbsp;&nbsp;
            <span class="float-right view" @click="ExpandGraph('csat')"
              >View</span
            >
          </span>
          <span
            class="d-flex align-center justify-center mt-1 font-weight-medium text-h3"
            >{{ parseFloat(this.groups.average).toFixed(2) }}</span
          >
        </div>
        <div class="av-compliance average">
          <span class="title">
            <span class="font-weight-bold">Average Compliance</span
            >&nbsp;&nbsp;&nbsp;&nbsp;
            <span class="float-right view" @click="ExpandGraph('compliance')"
              >View</span
            >
          </span>
          <span
            class="-flex align-center justify-center mt-1 font-weight-medium text-h3"
            >{{ complianceAverage }}</span
          >
        </div>
      </v-card-text>
    </v-card> -->
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
                :items="org_data.data"
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
  <v-col cols="12" md="2"></v-col>
  <v-col cols="12" md="4">
    <v-card class="mx-auto mt-7 px-3 pt-1 pb-1 bt-blue" max-width="100%" elevation="4">
      <v-card-title class="d-flex justify-space-between mb-2 border-bottom-1">
        <v-row>
          <v-col cols="6">Average Call Ratings</v-col>
          <v-col cols="6">
            <span class="float-right view" @click="ExpandGraph('csat')">View</span>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <c-speedometer :speedometerdata="speedometerdata" />
      </v-card-text>
    </v-card>
  </v-col>
  <v-col cols="12" md="4">
    <v-card class="mx-auto mt-7 px-3 pt-1 pb-1 bt-blue" max-width="100%" elevation="4">
      <v-card-title class="d-flex justify-space-between mb-2 border-bottom-1">
        <v-row>
          <v-col cols="6">Average Compliance</v-col>
          <v-col cols="6">
            <span class="float-right view" @click="ExpandGraph('compliance')">View</span>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <c-speedometer :speedometerdata="speedometerdata2" />
      </v-card-text>
    </v-card>
  </v-col>
  <v-col cols="12" md="2"></v-col>
</v-row>
<v-row>
  <v-col cols="12" md="6">
    <v-card class="mx-auto mt-7 px-3 pt-1 pb-1 bt-red" max-width="100%" elevation="4">
      <v-card-title class="d-flex justify-space-between mb-2 border-bottom-1">
        <v-row>
          <v-col cols="6">Top Intents</v-col>
          <v-col cols="6"><span @click="ExpandGraph('ti')" class="float-right view">View</span></v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <c-horizontal-bar :chart="intent_chart_data" />
      </v-card-text>
    </v-card>
  </v-col>
  <v-col cols="12" md="6">
    <v-card class="mx-auto mt-7 px-3 pt-1 pb-1 bt-red" max-width="100%" elevation="4">
      <v-card-title class="mb-2 border-bottom-1">
        <v-row>
          <v-col cols="6">Sentiment</v-col>
          <v-col cols="6"><span @click="ExpandGraph('senti')" class="float-right view">View</span></v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <c-horizontal-bar :chart="sentiment_chart_data" />
      </v-card-text>
    </v-card>
  </v-col>
  <!-- <v-col cols="12">
        <score-card
          :data="agent_score_card"
          v-model="score_card_intent"
          :total_headers="asc_total_headers"
          :headers="asc_headers"
          :intents="top_intents"
        />
      </v-col> -->
</v-row>
</div>
<v-card class="mx-auto my-8 px-5 pt-1 pb-1 bt-gray" max-width="100%" elevation="4">
  <v-card-title class="d-flex justify-space-between mb-2 border-bottom-1">
    Transcript Search
  </v-card-title>
  <v-card-text>
    <v-text-field v-model="transcript_search" label="Enter text here..." prepend-inner-icon="mdi-magnify"
      @input="handleInput" @keyup.enter="searchTranscript" single-line variant="outlined" density="compact"
      class="rounded-xl" clearable hide-details></v-text-field>
    <br />
    <div v-if="searching" class="d-flex justify-center align-center">
      <v-progress-circular indeterminate></v-progress-circular>&nbsp;
      Searching...
    </div>

    <template v-if="transcript_search_list.data.length > 0" v-for="item in transcript_search_list.data">
        <v-card class="pb-0" elevation="0">
            <v-card-title class="d-flex">
              <v-row>
                <v-col cols="12" class="d-flex pb-0 align-center">
                  <router-link
            class="text-decoration-none d-flex"
            :to="{ name: 'view_analysis', params: { id: item.id } }"
          >
          
                  <v-btn
                    color="primary"
                    v-if="item.call_type == 'outgoing'"
                    icon="mdi-phone-outgoing"
                    variant="tonal"
                    size="small"
                    class="mr-3"
                  ></v-btn>
                  <v-btn
                    color="info"
                    v-if="item.call_type == 'incoming'"
                    icon="mdi-phone-incoming"
                    variant="tonal"
                    size="small"
                    class="mr-3"
                  ></v-btn>

                  <div class="d-flex flex-column pr-5">
                    <span class="text-caption">{{ item.agent }}</span>
                    <span class="text-caption"> {{ item.callerid }}</span>
                  </div>
                </router-link>

                  <span
                    style="border-left: 1px solid #ccc"
                    class="pl-3 text-caption"
                    >{{ formatDate2(item.queue_date) }}</span
                  >

                </v-col>
                <v-col cols="12">
                  <div>
                    <v-chip
                      v-if="item.intent && item.intent != ''"
                      color="cyan"
                      class="mr-3"
                      variant="tonal"
                      size="small"
                    >
                      Intent: {{ item.intent }}
                    </v-chip>
                    <v-chip
                      v-if="item.sentiment_name && item.sentiment_name != ''"
                      :color="
                        item.sentiment_name.toLowerCase() == 'positive'
                          ? 'success'
                          : item.sentiment_name.toLowerCase() == 'neutral'
                          ? 'info'
                          : 'error'
                      "
                      class="mr-3"
                      variant="tonal"
                      size="small"
                    >
                      Sentiment: {{ item.sentiment_name }}
                    </v-chip>
                    <v-chip
                      color="warning"
                      class="mr-3"
                      variant="tonal"
                      size="small"
                      v-if="item.csat && item.csat != ''"
                    >
                      Call rating: {{ item.csat }}%
                    </v-chip>
                    <v-chip
                      color="purple"
                      class="mr-3"
                      variant="tonal"
                      size="small"
                      v-if="item.compliance && item.compliance != ''"
                    >
                      Compliance: {{ item.compliance }}%
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
            </v-card-title>
          <v-card-text v-html="item.content"></v-card-text>
        </v-card>
        <br />
      </template>
    <br />
    <div v-if="transcript_search_list.data.length !== transcript_search_list.count"
      class="d-flex justify-center position-relative py-6">
      <v-progress-circular v-if="progress_more_results" color="info" indeterminate></v-progress-circular>

      <template v-else>
        <v-divider></v-divider>
      <v-btn @click="_moreResults" style="top:5px" color="#e6e6e6" elevation="0"
        class="position-absolute text-capitalize font-weight-regular px-10 rounded-pill">More results</v-btn>
      </template>
    </div>
    <!-- <v-card class="pb-0" elevation="0">
      <v-card-title class="d-flex">
        <v-row>
          <v-col cols="12" class="d-flex pb-0 align-center">
            <v-btn icon="mdi-phone-outgoing" variant="tonal" size="small" class="mr-3"></v-btn>
            <div class="d-flex flex-column pr-5">
              <span class="text-caption">4413215</span>
              <span class="text-caption">Justin Carl</span>
            </div>
            <span style="border-left: 1px solid #ccc"
              class="pl-3 text-caption">{{formatDate2('2024-02-16T12:04:33.000Z')}}</span>
          </v-col>
          <v-col cols="12">
            <div>
              <v-chip color="cyan" class="mr-3" variant="tonal" size="small">
                Intent: Support
              </v-chip>
              <v-chip color="success" class="mr-3" variant="tonal" size="small">
                Sentiment: Neutral
              </v-chip>
              <v-chip color="warning" class="mr-3" variant="tonal" size="small">
                Call rating: 80%
              </v-chip>
              <v-chip color="purple" class="mr-3" variant="tonal" size="small">
                Compliance: 80%
              </v-chip>
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        asdasd adasdasdasd asdasd as as a
      </v-card-text>
    </v-card> -->

    <!-- <div style="background: #ccc; width: 6px; height: 25px;"></div> -->
  </v-card-text>
</v-card>
<v-card class="mx-auto my-8 px-5 pt-1 pb-1 bt-gray" max-width="100%" elevation="4">
  <v-card-title>Analysis Logs</v-card-title>
  <v-divider></v-divider>
  <v-card-text>
    <v-row>
      <v-col cols="12" class="pb-0">
        <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" single-line variant="outlined"
          density="compact" class="re-border-radius-r" hide-details></v-text-field>
      </v-col>
      <v-col cols="12" class="pt-0">
        <v-data-table v-if="my_groups" items-per-page="10" :items-per-page-options="itemsPerPageOptions"
          :items="my_groups" :headers="headers" :search="search" :sort-by="[{ key: 'id', order: 'desc' }]"
          :must-sort="true">

          <template v-slot:item.sentiment="{ item }">
              <p
                :class="
                  item.sentiment > 'Negative'
                    ? item.sentiment == 'Positive'
                      ? 'highlight-green'
                      : ''
                    : item.sentiment == ''
                    ? ''
                    : 'highlight-red'
                "
              >
                {{ item.sentiment }}
              </p>
            </template>

          <template v-slot:item.score="{ item }">
              <!-- <p :class="Number(item.score) <= 70 ? 't-red' : ''"> -->
              <p
                :class="
                  Number(item.score) <= score_config.low
                    ? 'highlight-red'
                    : Number(item.score) >= score_config.high
                    ? 'highlight-green'
                    : ''
                "
              >
                {{ Number(item.score) }} %
              </p>
            </template>

          <template v-slot:item.call_type="{ item }">
              <!-- <p :class="Number(item.score) <= 70 ? 't-red' : ''"> -->
              <v-tooltip :text="item.call_type">
                <template v-slot:activator="{ props }">
                  <v-chip
                    v-bind="props"
                    color="primary"
                    v-if="item.call_type == 'outgoing'"
                    variant="tonal"
                    size="default"
                  >
                    <v-icon>mdi-phone-outgoing</v-icon>
                  </v-chip>
                  <v-chip
                    v-bind="props"
                    color="info"
                    v-if="item.call_type == 'incoming'"
                    variant="tonal"
                    size="default"
                  >
                    <v-icon>mdi-phone-incoming</v-icon>
                  </v-chip>
                </template>
          </v-tooltip>
          </template>

          <template v-slot:item.callerid="{ item }">
            <span v-if="item.call_type == 'outgoing'" >{{item.number_dialled}}</span>
            <span v-if="item.call_type == 'incoming'">{{item.callerid}}</span>
          </template>

          <template v-slot:item.compliance="{ item }">
              <p
                :class="
                  Number(item.compliance) <= score_config.low
                    ? 'highlight-red'
                    : Number(item.compliance) >= score_config.high
                    ? 'highlight-green'
                    : ''
                "
              >
                {{ Number(item.compliance) }} %
              </p>
            </template>

          <template v-slot:item.action="{ item }">
              <v-tooltip text="Tooltip">
                <template v-slot:activator="{ props }">
                  <v-chip
                    style="background: rgb(31, 144, 19) !important"
                    :to="{ name: 'view_analysis', params: { id: item.id } }"
                    label
                  >
                    <v-icon color="white" icon="mdi-magnify"></v-icon>
                  </v-chip>
                </template>
          </v-tooltip>
          </template>

          <template v-slot:item.queue_date="{ item }">
              {{ item.queue_date }}
            </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
</template>

<script>
import Cookies from "js-cookie";
import moment from "moment-timezone";
export default {
  emits: ["showNotification", "loadingScreen", "loadingScreen2"],
  data() {
    return {
      pagination: {
        limit: 10,
      },
      addLimit: 0,
      showMenu: false,
      custom_startDate: new Date(),
      custom_endDate: new Date(),
      load_process: false,
      itemsPerPageOptions: [
        { title: "10", value: 10 },
        { title: "25", value: 25 },
        { title: "50", value: 50 },
        { title: "100", value: 100 },
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
      search: "",
      progress_more_results: false,
      transcript_search: "",
      transcript_search_list: {
        data: [],
        count: 0,
      },
      first_load: 0,
      score_config: {
        low: null,
        high: null,
      },
      speedometerdata: {},
      speedometerdata2: {},
      load_expand: false,
      ti_dialog: false,
      scorecard_dialog: false,
      senti_dialog: false,
      top_intents: [],
      top_intents2: [],
      top_sentiments: [],
      my_groups: [],
      view_type_id: 3,
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
      groups: [
        {
          QueueAgents: [],
          ChatGroupQueueResultCSAT: {},
          ChatGroupQueueResultSentiments: [],
          ChatGroupQueueResultIntents: [],
          code: "asd",
          data: null,
        },
      ],
      headers: [
        // { title: 'Record ID', key: 'id', align: 'start' },
        { title: "ID", key: "id", align: "start" },
        { title: "Name", key: "name", align: "start", sortable: true },
        { title: "Date/Time of Call", key: "queue_date", align: "start" },
        { title: "Call Type", key: "call_type", align: "start" },
        { title: "Caller ID", key: "callerid", align: "start" },
        { title: "Duration", key: "call_duration", align: "start" },
        { title: "Compliance", key: "compliance", align: "start" },
        { title: "Call Ratings", key: "score", align: "start" },
        { title: "Sentiment", key: "sentiment", align: "start" },
        { title: "Intent", key: "main_intent", align: "start" },
        //   { title: "User ID", key: "accountcode", align: "start" },
        { title: "Action", key: "action", align: "start" },
      ],
      asc_headers: [
        {
          title: "Name",
          key: "name",
          value: (item) => `${item.name}`,
          align: "center",
          sortable: true,
        },
        { title: "Calls", key: "calls", align: "center", sortable: true },
      ],
      asc_total_headers: [],
      score_card_intent: "",
      agent_score_card: [],
      complianceAverage: 0,
      intent_chart_data: {},
      sentiment_chart_data: {},
      org_data: [],
      org_id: null,
      groupID:
        this.$route.params.id == "total" ? "" : Number(this.$route.params.id),
      typingTimer: [],
      searching: false,
    };
  },
  computed: {
    // groupId() {
    //   return this.$route.params.id;
    // },
  },
  watch: {
    // transcript_search(val) {
    //   this.searchTranscript();
    //   console.log(val)
    // },
    period_type_id(val) {
      if (this.groupID != "") {
        this.selectPeriod(val, false, this.groupID);
      } else {
        this.selectPeriod(val, false, "total");
      }
    },
    async groupID(val) {
      if (val != "") {
        this.loadscreen2(true);
        await this.selectPeriod(this.period_type_id, true, val);
      }
    },
    async view_type_id(val) {
      if (val == 3) {
        this.loadscreen2(true);
        this.groupID = "";
        await this.selectPeriod(this.period_type_id, true, "total");
      }
    },
    // async groupId(newGroupId, oldGroupId) {
    //   this.loadscreen(true);
    //   await this.initialData();
    //   await this.getScoreCard();
    //   this.loadscreen(false);
    // },
    async score_card_intent(val) {
      if (this.first_load > 0) {
        // await this.getScoreCard();
      }
      this.first_load = 1;
    },
  },
  methods: {
    ActivateMenu(data) {
      this.showMenu = false;
      if (data == "Custom") {
        this.showMenu = true;
      }
    },
    _replace(x) {
      return x.replace("%", "");
    },
    async getOrg() {
      const config = {
        // url: "/groups?organization_id=" + 2,
        url: "/groups?organization_id=" + this.org_id,

        method: "GET",
      };
      const res = await this.api_call(config);
      this.org_data = res.data;
    },
    _find(data, h) {
      let x = data.find((x) => x.kpi.toLowerCase() == h);
      if (!x) {
        x = 0;
      } else {
        x = x.weightConverted;
      }
      return x;
    },
    addHeaders() {
      this.asc_total_headers = [];
      this.asc_headers = [];
      this.asc_headers = [
        {
          title: "Name",
          key: "name",
          align: "start",
          type: "string",
        },
        { title: "Calls", key: "calls", align: "start", type: "number" },
        { title: "Call Ratings", key: "csat", align: "start" },
        { title: "Compliance", key: "compliance", align: "start" },
      ];

      this.agent_score_card.map((x, m) => {
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
          x[i.kpi.toLowerCase()] = parseFloat(i.weightConverted).toFixed(2);
        });
        return x;
      });
    },
    // async(){
    //   getAgentsTotal

    // },
    handleInput() {
      this.searching = true;
      this.transcript_search_list.data = [];
      clearTimeout(this.typingTimer); // Clear the previous timer

      this.typingTimer = setTimeout(async () => {
        await this.searchTranscript();
        this.searching = false;

      }, 1000);
    },
    async _moreResults() {
      this.addLimit += 5
      this.progress_more_results = true
      await this.searchTranscript()
      this.progress_more_results = false
    },
    async searchTranscript() {
      const config = {
        url: "/transcript-details/TranscriptSearch",
        data: {
          text: this.transcript_search,
          organization_id: this.org_id,
          limit: this.pagination.limit + this.addLimit,
          offset: 0,
        },
        method: "POST",
      };
      const res = await this.api_call(config);
      if (res.data.result == "success") {
        this.transcript_search_list = res.data.data;

        const _split = this.transcript_search.split(" ");
        this.transcript_search_list.data.map((x) => {
          let text = x.content;
          _split.map((z) => {
            if (z !== '') {
              text = text.replace(new RegExp(z, "gi"), `<b>${z}</b>`); // Using regular expression to replace all occurrences of z
            }
          });
          x.content = text;
          return x;
        });
      }
    },
    async getAgents(val, start, end) {
      let res = [];
      if (val == "total") {
        const config = {
          url: `/result/getTranscripts/getByOrganization`,
          data: {
            start: start,
            end: end,
            id: this.org_id,
          },
          method: "POST",
          // params: {
          //   start: start,
          //   end: end,
          // }
        };
        res = await this.api_call(config);
      } else {
        const config = {
          url: "/result/getTranscripts/getByGroup",
          data: {
            start: start,
            end: end,
            id: val,
          },
          method: "POST",
          // params: {
          //   start: start,
          //   end: end,
          // }
        };
        res = await this.api_call(config);
      }
      if (res.data.result == "success") {
        this.my_groups = res.data.data.map((x) => {
          x.sentiment =
            x.sentiment.charAt(0).toUpperCase() + x.sentiment.slice(1);
          x.queue_date = this.formatDate2(x.queue_date);
          x.compliance = parseFloat(x.compliance)
            ? parseFloat(x.compliance)
            : "";
          x.score = parseFloat(x.csat) ? parseFloat(x.csat).toFixed(2) : "";
          x.main_intent = x.intent;
          x.name = x.agent;
          x.call_duration = x.call_duration ? this.formatTime(x.call_duration) : ""

          return x;
        });
      }
      await this.getAverageCompliace(val, start, end);
      await this.getAverageCsat(start, end);
      await this.getTopIntents2(val, start, end);
      await this.getTopIntents(val, start, end);
      // await this.getScoreCard(start, end);
    },
    async getAverageCsat(start_date = null, end_date = null) {
      try {
        let url;
        url =
          this.view_type_id == 3
            ? "/result/getCSATversion2/getByOrganization"
            : "/result/getCSATversion2/getByGroup";
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
        if (res.data.result && res.data.result != "error") {
          this.speedometerdata = {
            name: "csat",
            num: res.data.data.average !== "NaN" ? res.data.data.average : 0,
          };
        }
      } catch (error) {
        console.error(error.message);
      }
    },
    async getAgents1(val, start, end) {
      let res = [];
      if (val == "total") {
        const config = {
          url: `/result/getCSAt/getByOrganization?id=${this.org_id}`,
          method: "GET",
          // params: {
          //   start: start,
          //   end: end,
          // }
        };
        res = await this.api_call(config);
      } else {
        const config = {
          url: "/result/getCSAt/getByGroup?id=" + val,
          method: "GET",
          // params: {
          //   start: start,
          //   end: end,
          // }
        };
        res = await this.api_call(config);
      }
      if (res.data.result == "success") {
        this.groups = res.data.data;
        this.groups.data.map((x, i) => {
          // if(i == 2){
          //   const yeah = moment.utc().utcOffset("-08:00");
          //   console.log(moment().tz(""))
          // }
          return x;
        });
        // console.log("-----", this.groups)
        // console.log(this.groups.data)
        this.groups.data = this.groups.data.map((x) => {
          if (x.SentiAnylses[0]) {
            const sentiment = x.SentiAnylses[0].sentiment_name.toLowerCase();
            if (
              sentiment == "anxious" ||
              sentiment == "concerned" ||
              sentiment == "confused" ||
              sentiment == "frustrated" ||
              sentiment == "frustration"
            ) {
              x.SentiAnylses[0].sentiment_name = "Negative";
            }
          }

          return x;
        });
        this.speedometerdata = {
          name: "csat",
          num: this.groups.average ? this.groups.average : 0,
        };

        this.groups.data = this.groups.data.map((x) => {
          if (x.queue_date) {
            // x.createdAt = this.formatDateTime(x.createdAt);
            x.queue_date = this.parseDate(x.queue_date);
          }
          return x;
        });

        this.my_groups = this.groups.data.map((x) => {
          x.my_groups = {
            name: x.Agent.fullname,
            score: parseFloat(x.csatTotal)
              ? parseFloat(x.csatTotal).toFixed(2)
              : "",
            sentiment: x.SentiAnylses.map(
              (z) =>
                z.sentiment_name.charAt(0).toUpperCase() +
                z.sentiment_name.slice(1)
            ).join(" "),

            main_intent: x.IntentResults[0].main_intent.intent_name,
            queue_date: this.formatDate2(x.queue_date),
            id: x.id,
            number_dialled: x.number_dialled,
            callerid: x.callerid,
            compliance: parseFloat(x.Compliance.score)
              ? parseFloat(x.Compliance.score)
              : "",
            call_type: x.call_type,
          };
          return x.my_groups;
        });
        this.getAverageCompliace(val, start, end);
      }

      await this.getTopIntents2(val, start, end);
      await this.getTopIntents(val, start, end);
      // await this.getScoreCard(start, end);
      this.loadscreen2(false);
    },
    countAll(data) {
      let count = 0;
      data.kpi.map((x) => {
        count = x.count + count;
        return x;
      });
      return count;
    },
    async getScoreCard(start, end) {
      try {
        let url;
        url =
          this.view_type_id == 3
            ? "/result/getMetricsPerIntentByOrganization"
            : "/result/getMetricsPerIntentByGroup";
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
        if (res.data.result && res.data.result != "error") {
          this.agent_score_card = res.data.data.filter((x) => x.kpi.length > 0);
          this.addHeaders();
        }
      } catch (error) {
        console.log(error.message);
      }
    },
    async getTopIntents2(type = "id", start, end) {
      this.top_intents2 = [];
      let res;
      if (type == "total") {
        const config = {
          url: "/result/getByOrganization?id=" + this.org_id,
          method: "GET",
          params: {
            start: start,
            end: end,
          },
        };
        res = await this.api_call(config);
      } else {
        const config = {
          url: "/result/getByGroup?id=" + this.groupID,
          method: "GET",
          params: {
            start: start,
            end: end,
          },
        };
        res = await this.api_call(config);
      }

      if (res.data.result == "success") {
        this.top_intents2 = res.data.data.MainIntentTotal;

        if (this.top_intents2[0]) {
          this.score_card_intent = this.top_intents2[0].Intent_Name;
        }

        let total = 0;
        let indexs = [];
        this.top_sentiments = res.data.data.getTotalForSentimetal.map(
          (x, i) => {
            const sentiment = x.sentiment_name
              ? x.sentiment_name.toLowerCase()
              : null;
            if (
              sentiment == "anxious" ||
              sentiment == "concerned" ||
              sentiment == "confused" ||
              sentiment == "frustrated" ||
              sentiment == "frustration"
            ) {
              total += x.sentiment_count;
              indexs.push(x.sentiment_name);
            }

            return x;
          }
        );

        this.top_sentiments.map((x) => {
          if (
            x.sentiment_name &&
            x.sentiment_name.toLowerCase() == "negative"
          ) {
            x.sentiment_count += Number(total);
          }
        });

        indexs.map((x) => {
          this.top_sentiments = this.top_sentiments.filter(
            (z, i) => z.sentiment_name != x
          );
        });
        this.top_intents2 = this.top_intents2.filter(
          (x) => x.Intent_Name !== null
        );
        this.top_sentiments = this.top_sentiments.filter(
          (x) => x.sentiment_name !== null
        );
        this.intentGraph();
        this.sentimentGraph();
      }
    },

    async getTopIntents(type = "id", start, end) {
      this.top_intents = [];
      let res;
      if (type == "total") {
        const config = {
          url: "/result/getIntentsByOrg?id=" + this.org_id,
          method: "GET",
          params: {
            start: start,
            end: end,
          },
        };
        res = await this.api_call(config);
      } else {
        const config = {
          url: `/result/getIntentsByGroup?id=${this.groupID}`,
          method: "GET",
          params: {
            start: start,
            end: end,
          },
        };
        res = await this.api_call(config);
      }

      if (res.data.result == "success") {
        this.top_intents = res.data.data;
        if (this.top_intents[0]) {
          this.score_card_intent = this.top_intents[0].intent;
        }

        this.top_intents = this.top_intents.filter((x) => x.intent !== null);

        // this.top_sentiments = this.top_sentiments.filter(
        //   (x) => x.sentiment_name !== null
        // );

        // this.intentGraph();
        // this.sentimentGraph();
      }
    },

    intentGraph(data = "top-intents") {
      const highestScore_intent = this.top_intents2.reduce(
        (maxScore, currentItem) => {
          return currentItem.main_intent_count > maxScore
            ? currentItem.main_intent_count
            : maxScore;
        },
        0
      );

      this.intent_chart_data = {
        id_name: data,
        labels: this.top_intents2.map((row) => row.Intent_Name),
        datasets_data: this.top_intents2.map((row) => row.main_intent_count),
        max: highestScore_intent * 1.05,
      };
    },
    sentimentGraph(data = "top-sentiments") {
      const highestScore_sentiment = this.top_sentiments.reduce(
        (maxScore, currentItem) => {
          return currentItem.sentiment_count > maxScore
            ? currentItem.sentiment_count
            : maxScore;
        },
        0
      );

      this.sentiment_chart_data = {
        id_name: "top-sentiments",
        labels: this.top_sentiments.map(
          (row) =>
            row.sentiment_name.charAt(0).toUpperCase() +
            row.sentiment_name.slice(1)
        ),
        datasets_data: this.top_sentiments.map((row) => row.sentiment_count),
        max: highestScore_sentiment * 1.05,
        backgroundColor: this.sentiment_color,
      };
    },
    ExpandGraph(i) {
      this.load_expand = true;
      const type =
        this.view_type_id == 3
          ? "total"
          : Number(this.groupID)
            ? Number(this.groupID)
            : null;
      // const type = this.$route.params.id == "total"? "total" : this.groupID;
      if (!type) return;
      if (i == "ti") {
        this.$router.push("intents/" + type);
        // this.ti_dialog = true;
        // setTimeout(() => {
        //   this.intentGraph("expandIntents");
        //   this.load_expand = false;
        // }, 1000);
      }

      if (i == "senti") {
        this.$router.push("sentiments/" + type);

        // this.senti_dialog = true;
        // setTimeout(() => {
        //   this.sentimentGraph("expandSenti");
        //   this.load_expand = false;
        // }, 1000);
      }

      if (i == "scorecard") {
        this.scorecard_dialog = true;
        setTimeout(() => {
          this.load_expand = false;
        }, 1000);
      }

      if (i == "csat") {
        this.$router.push("call_ratings/" + type);
      }

      if (i == "compliance") {
        this.$router.push("compliance/" + type);
      }
    },
    async initialData(start, end, x = null) {
      await this.getOrg();
      if (x == null) {
        if (this.$route.params.id == "total") {
          await this.getAgents("total", start, end);
        } else {
          await this.getAgents(this.$route.params.id, start, end);
        }
      } else {
        await this.getAgents(x, start, end);
      }

      this.getNotif();
      this.intentGraph();
      this.sentimentGraph();
      this.addHeaders();
    },
    async getAverageCompliace(type = "id", start, end) {
      try {
        let r;
        if (type == "total") {
          r = await this.api_call_get(
            "/result/compliance/averagebyOrganization",
            {
              id: this.org_id,
              start: start,
              end: end,
            }
          );
        } else {
          r = await this.api_call_get("/result/compliance/averagebyGroup", {
            id: this.groupID,
            start: start,
            end: end,
          });
        }

        this.complianceAverage = r.data.data[0].average;
        this.speedometerdata2 = {
          name: "compliance",
          num: this.complianceAverage,
        };
      } catch (err) {
        alert(err.message);
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
          this.score_config = res.data.data[0];
        }
      }
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
            this.load_process = true;
            // const custom_startDate = new Date(this.custom_startDate);
            // const custom_endDate = new Date(this.custom_endDate);
            // const formattedDate = (dateObject) => {
            //   return `${dateObject.getMonth() + 1
            //     }/${dateObject.getDate()}/${dateObject.getFullYear()}`;
            // };

            const custom_startDate = moment(this.custom_startDate).format(
              "YYYY-MM-DD"
            );
            const custom_endDate = moment(this.custom_endDate).format(
              "YYYY-MM-DD"
            );
            await this.initialData(custom_startDate, custom_endDate, x);
            this.load_process = false;
            this.showMenu = false;
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
  },
  async mounted() {
    this.org_id = Number(Cookies.get("_org"));
    this.view_type_id = this.$route.params.id == "total" ? 3 : 1;
    this.loadscreen(true);
    await this.initialData(this.last24HoursStart, this.last24HoursEnd);
    this.loadscreen(false);

    // console.log("Last 24 Hours:");
    // console.log("Start:", last24HoursStart.format());
    // console.log("End:", last24HoursEnd.format());

    // console.log("\nLast 7 Days:");
    // console.log("Start:", last7DaysStart.format());
    // console.log("End:", last7DaysEnd.format());

    // console.log("\nLast 30 Days:");
    // console.log("Start:", last30DaysStart.format());
    // console.log("End:", last30DaysEnd.format());

    // setTimeout(() => {
    //   this.initialData();
    // }, 60000);
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to.path);
    if (to.path === from.path) {
      window.location.reload();
    } else {
      next();
    }
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
    };
    const accesscodeChecker = (code) => {
      const getAccessCode = Cookies.get("_aksis_code");
      const access_code = getAccessCode
        ? JSON.parse(Cookies.get("_aksis_code"))
        : [];
      const checker = access_code.filter((x) => x == code);
      return checker && checker.length > 0 ? true : false;
    };
    if (accesscodeChecker(access_code_default.rpts)) {
      next();
    } else {
      next("/error_page");
    }
  },
};
</script>

<style>
.average {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.average .text {
  font-size: 25px;
}

#graphs .v-card-text {
  display: flex;
  justify-content: space-around;
}

.expand-dialogs .v-progress-circular {
  position: absolute !important;
  top: 50%;
  left: 50%;
}

.my-intent-select .v-field__field,
.my-intent-select .v-field__append-inner,
.my-intent-select .v-field__outline {
  height: 30px;
}

.my-intent-select .v-field__input {
  padding-top: 0;
}

.my-intent-select .v-select__selection-text {
  font-size: 14px;
}

.border-bottom-1 {
  border-bottom: 1px solid #ccc;
}
</style>
