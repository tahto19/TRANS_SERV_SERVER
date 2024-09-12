<template>
  <v-chip
    :to="{ name: 'reports_default', params: { id: this.report_info.Group.id } }"
    @click="destroyAll"
    variant="text"
    class="mb-3 px-0"
  >
    <v-icon color="rgb(0, 116, 228)" start icon="mdi-chevron-left"></v-icon>
    <p style="color: rgb(0, 116, 228)">Back to call analysis</p>
  </v-chip>
  <h1 class="top-header">Analysis Details</h1>
  <v-card class="mx-auto my-7 px-3 pt-1 pb-1" max-width="100%" elevation="4">
    <v-card-text>
      <v-row>
        <div class="d-flex align-center mb-1 mr-4">
          <v-btn
            icon="mdi-phone-outgoing"
            color="primary"
            v-if="report_info.call_type == 'outgoing'"
            readonly
            size="large"
          ></v-btn>
          <v-btn
            icon="mdi-phone-incoming"
            color="info"
            v-if="report_info.call_type == 'incoming'"
            readonly
            size="large"
          ></v-btn>
        </div>
        <v-col cols="11" class="pl-0">
          <v-row>
            <v-col cols="12" md="3" class="pb-0">
              <div class="d-flex align-center">
                <h2 class="color-light mr-3">
                  {{
                    report_info.IntentResults[0].main_intent.intent_name
                  }}
                  Call
                </h2>
              </div>
            </v-col>
            <!-- <v-col cols="12" md="2">
          <div class="d-flex align-center">
            <h4 class="color-light mr-3">From</h4>
            <p class="color-light">0982671623</p>
          </div>
        </v-col> -->
            <v-col cols="12" md="4" class="pb-0">
              <div class="d-flex align-center">
                <h4 class="color-light mr-3">Agent Name</h4>
                <p class="color-light">{{ report_info.Agent.fullname }}</p>
              </div>
            </v-col>
            <v-col cols="12" md="5" class="pb-0">
              <div class="d-flex align-center">
                <h4 class="color-light mr-3">Duration</h4>
                <p class="color-light">
                  {{ report_info.StoredSpeeches[0].duration }} seconds
                </p>
              </div>
            </v-col>
            <v-col cols="12" md="3">
              <div class="d-flex align-center" v-if="report_info.callerid">
                <h4 class="color-light mr-3">
                  {{ report_info.call_type == "incoming" ? "From" : "To" }}
                </h4>
                <p class="color-light">{{ report_info.callerid }}</p>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="d-flex align-center">
                <h4 class="color-light mr-3">Group</h4>
                <p class="color-light">{{ report_info.Group.name }}</p>
              </div>
            </v-col>
            <v-col cols="12" md="5">
              <div class="d-flex align-center">
                <h4 class="color-light mr-3">Date/Time of Call</h4>
                <p class="color-light">
                  {{ formatDateTime(report_info.queue_date) }}
                </p>
              </div>
            </v-col>
            <!-- <v-col cols="12" md="4">
                    <div class="d-flex align-center">
                        <h4 class="color-light mr-3">Evaluator</h4>
                        <p class="color-light">test</p>
                    </div>
                </v-col> -->
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-card class="mx-auto my-7 px-3 pt-1 pb-1" max-width="100%" elevation="4">
    <v-card-text>
      <v-row>
        <v-col
          :cols="windowWidth <= 1120 ? '12' : '1'"
          class="py-0 d-flex align-center"
        >
          <h4 class="color-light">Agent</h4>
        </v-col>
        <v-col
          :cols="windowWidth <= 1120 ? '12' : '11'"
          class="pa-0 border-left"
        >
          <div id="waveform-0"></div>
        </v-col>
        <v-divider></v-divider>
        <v-col
          :cols="windowWidth <= 1120 ? '12' : '1'"
          class="py-0 d-flex align-center"
        >
          <h4 class="color-light">Customer</h4>
        </v-col>
        <v-col
          :cols="windowWidth <= 1120 ? '12' : '11'"
          class="pa-0 border-left"
        >
          <div id="waveform-1"></div>
        </v-col>

        <br />
        <v-col
          v-if="windowWidth >= 480"
          :cols="windowWidth <= 1120 ? '12' : '1'"
          class="d-flex align-center pl-7 pr-0"
        >
          <v-btn
            color="rgb(24,103,192)"
            theme="dark"
            icon
            elevation="0"
            @click="playMe()"
            class="mr-8"
          >
            <v-icon
              size="large"
              :icon="playing ? 'mdi-pause' : 'mdi-play'"
            ></v-icon>
          </v-btn>
        </v-col>
        <v-col
          :cols="windowWidth <= 1120 ? '12' : '11'"
          class="d-flex align-center px-0"
        >
          <v-slider
            v-if="windowWidth <= 480"
            thumb-label="always"
            @click="playMe()"
            hide-details=""
            v-model="audio_value"
            class="mx-0"
            color="primary"
            track-color="grey"
            min="0"
            :max="audioDuration"
          >
            <template v-slot:thumb-label="{ modelValue }">
              <v-icon>{{ playing ? "mdi-pause" : "mdi-play" }}</v-icon>
            </template>
          </v-slider>
          <v-slider
            v-else
            @click="playMe()"
            hide-details=""
            v-model="audio_value"
            class="mx-0"
            color="primary"
            track-color="grey"
            min="0"
            :max="audioDuration"
          >
          </v-slider>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-row>
    <v-col cols="12" md="7">
      <v-row>
        <v-col  class="d-flex" cols="12" md="5" ref="col3">
          <v-row>
            <v-col cols="12">
              <v-card
                class="mx-auto bt-blue"
                max-width="100%"
                elevation="4"
                height="100%"
              >
                <v-card-title class="d-flex justify-space-between mb-2">
                  <v-row>
                    <v-col cols="6">Call Score</v-col>
                  </v-row>
                </v-card-title>
                <v-card-text
                  class="d-flex align-center justify-center"
                  style="height: calc(100% - 48.8px)"
                >
                  <v-divider></v-divider>
                  <c-speedometer
                    :speedometerdata="{
                      name: 'csat_score',
                      num: report_info.csatTotal
                        ? parseFloat(report_info.csatTotal)
                        : 0,
                    }"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card
                class="mx-auto"
                max-width="100%"
                elevation="4"
                height="100%"
              >
                <v-card-title class="d-flex mb-2">
                  Sentiment
                  <template v-if="upperCaseFirstLetter(report_info.SentiAnylses[0].sentiment_name) == 'Negative'">
                    <span class="highlight-red text-body-1 ml-3 d-flex align-center">{{ upperCaseFirstLetter(report_info.SentiAnylses[0].sentiment_name) }}</span>
                  </template>
                  <template v-else-if="upperCaseFirstLetter(report_info.SentiAnylses[0].sentiment_name) == 'Positive'">
                    <span class="highlight-green text-body-1 ml-3 d-flex align-center">{{ upperCaseFirstLetter(report_info.SentiAnylses[0].sentiment_name) }}</span>
                  </template>
                  <template v-else>
                    <span class="text-body-1 ml-3 d-flex align-center">{{ upperCaseFirstLetter(report_info.SentiAnylses[0].sentiment_name) }}</span>
                  </template>
                </v-card-title>
                <v-card-text height="100%">
                  <v-divider></v-divider>
                  <br />
                  <v-row>
                    <v-col cols="12" class="py-0">{{
                      report_info.SentiAnylses[0].explanation
                    }}</v-col>
                  </v-row>
                  <br />
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card
                class="mx-auto bt-blue"
                max-width="100%"
                elevation="4"
                height="100%"
              >
                <v-card-title class="d-flex justify-space-between mb-2">
                  <v-row>
                    <v-col cols="6">Compliance</v-col>
                  </v-row>
                </v-card-title>
                <v-card-text
                  class="d-flex align-center justify-center"
                  style="height: calc(100% - 48.8px)"
                >
                  <v-divider></v-divider>
                  <c-speedometer
                    :speedometerdata="{
                      name: 'compliance_score',
                      num: report_info.Compliance.score
                        ? parseFloat(report_info.Compliance.score)
                        : 0,
                    }"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="d-flex" cols="12" md="7" ref="col1">
          <v-row>
            <v-col cols="12">
              <v-card
                max-width="100%"
                elevation="4"
                height="100%"
              >
                <v-card-title class="d-flex justify-space-between mb-2">
                  <v-row>
                    <v-col cols="6">Call Metrics</v-col>
                  </v-row>
                </v-card-title>
                <v-card-text height="100%">
                  <v-divider></v-divider>
                  <br />
                  <div
                    v-for="(v, n) in report_info.KpiAnylses"
                    class="px-0 py-1 pb-1"
                  >
                    <div class="qmb border-1">
                      <div class="number">
                        <span>{{ v.rating.replace("%", "") + "%" }}</span>
                      </div>
                      <div>
                        <h4 class="color-light mr-3">
                          {{ v.kpi }}
                        </h4>
                        <span class="" style="font-size: 13px">{{
                          v.anaylsis
                        }}</span>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card
                max-width="100%"
                elevation="4"
                height="100%"
              >
                <v-card-title class="d-flex justify-space-between mb-2">
                  <v-row>
                    <v-col cols="6">Script Compliance Analysis</v-col>
                  </v-row>
                </v-card-title>
                <v-card-text height="100%">
                  <v-divider></v-divider>
                  <br />
                  {{
                      report_info.Compliance.explaination
                    }}
                  <br />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="5" ref="col2">
      <v-card
        v-if="show_col"
        class="px-3 pb-1 d-flex"
        style="min-height: 440px"
        height="100%"
        elevation="4"
      >
        <v-card-text height="100%">
          <v-row class="border-1 my-2">
            <v-col cols="12" class="text-center">{{
              report_info.IntentResults[0].main_intent.desc
            }}</v-col>
          </v-row>
          <v-tabs
            v-model="tab2"
            color="#494949"
            align-tabs="start"
            slider-color="#0074e4"
            border="bottom"
          >
            <v-tab :value="3" class="text-capitalize">Transcript</v-tab>
            <v-tab :value="2" class="text-capitalize">Summary</v-tab>
          </v-tabs>
          <v-window
            v-model="tab2"
            class="analysis_sd"
            style="height: calc(100% - 93.6px)"
          >
            <v-window-item :value="2" height="100%">
              <br />
              <v-sheet class="overflow-auto">
                <v-textarea
                  label=""
                  variant="outlined"
                  class="overflow-auto"
                  hide-details="auto"
                  rows="12"
                  row-height="10"
                  v-model="report_info.note.notes"
                >
                </v-textarea>
              </v-sheet>
              <v-btn
                elevation="0"
                @click="saveNote()"
                color="rgb(0, 116, 228)"
                variant="flat"
                class="text-overline text-none float-right"
              >
                Save
              </v-btn>
            </v-window-item>
            <v-window-item :value="3">
              <br />
              <v-sheet class="overflow-auto pr-5" height="110%">
                {{ report_info.content }}
              </v-sheet>

              <!-- ===============Two Way design================ -->

              <!-- <v-sheet v-if="separateText.length > 2 && typeof separateText == 'object'" class="overflow-auto pr-5"
                height="100%">
                <template v-for="text in separateText">
                  <div v-if="text.customer_message" class="customer-box">
                    <div class="wrap">
                      <div class="title">Customer</div>
                      <div class="message">{{ text.customer_message }}</div>
                    </div>
                  </div>
                  <div v-if="text.agent_message" class="agent-box">
                    <div class="wrap">
                      <div class="title">Agent</div>
                      <div class="message">{{ text.agent_message }}</div>
                    </div>
                  </div>
                </template>
              </v-sheet>
              <v-sheet v-else class="overflow-auto pr-5" height="110%">
                {{ report_info.content }}
              </v-sheet> -->
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-dialog
    v-model="dialog"
    v-if="view_text == 'intent_analysis'"
    scrollable
    persistent
    width="950"
  >
    <v-card>
      <v-toolbar dark color="white" class="sticky">
        <v-toolbar-title>Intent</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>

      <v-card-text class="px-6">
        <v-row>
          <v-col cols="3">
            <p class="f-14 color-light">Intent Name</p>
          </v-col>
          <v-col cols="9">
            <v-text-field
              v-model="agent_info.intent[0].main_intent"
              hide-details="auto"
              variant="outlined"
              density="compact"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <p class="f-14 color-light">Explanation</p>
          </v-col>
          <v-col cols="9">
            <v-textarea
              v-model="agent_info.intent[0].description"
              hide-details="auto"
              variant="outlined"
              density="compact"
              rows="3"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn color="rgb(0, 116, 228)" variant="flat" class="text-none">
          Save</v-btn
        >
        <v-btn
          color="rgb(0, 116, 228)"
          variant="flat"
          class="text-none"
          @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="dialog"
    v-if="view_text == 'sentiment_analysis'"
    scrollable
    persistent
    width="950"
  >
    <v-card>
      <v-toolbar dark color="white" class="sticky">
        <v-toolbar-title>Sentiment</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>

      <v-card-text class="px-6">
        <v-row>
          <v-col cols="3">
            <p class="f-14 color-light">Analysis</p>
          </v-col>
          <v-col cols="9">
            <v-text-field
              v-model="agent_info.sentiment[0].sentiment"
              hide-details="auto"
              variant="outlined"
              density="compact"
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <p class="f-14 color-light">Explanation</p>
          </v-col>
          <v-col cols="9">
            <v-textarea
              v-model="agent_info.sentiment[0].description"
              hide-details="auto"
              variant="outlined"
              density="compact"
              rows="3"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-3">
        <v-spacer></v-spacer>
        <v-btn
          color="rgb(0, 116, 228)"
          variant="flat"
          @click="saveData"
          class="text-none"
        >
          Save</v-btn
        >
        <v-btn
          color="rgb(0, 116, 228)"
          variant="flat"
          class="text-none"
          @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from "axios";
import Cookies from "js-cookie";
import WaveformData from "waveform-data";
import WaveSurfer from "wavesurfer.js";
import _ from "lodash";
import AppBarNotif from '@/mixin/AppBarNotif'

export default {
  emits: ["showNotification", "loadingScreen", "loadingScreen2"],
  mixins: [AppBarNotif],
  data() {
    return {
      show_col: false,
      windowWidth: 2000,
      org_id: null,
      audioDuration: 0,
      audio_value: 0,
      playing: false,
      score_config: {
        low: null,
        high: null,
      },
      analysis_box_list: {
        title: [
          {
            name: "Intent Analysis",
            index: 1,
          },
          {
            name: "Sentiment Analysis",
            index: 2,
          },
          //   {
          //     name: "Text Analysis",
          //     index: 3,
          //   },
        ],
      },
      csat_score: 25,
      agent_info: {
        compliance: [],
        intent: [{ main_intent: "", description: "" }],
        quality_metrics: [],
        queue: { Client: { code: "asd" }, QueueAgents: [{ qa_queue_id: 0 }] },
        sentiment: [],
        summary: [],
      },
      tab: null,
      tab2: 3,
      view_text: "",
      dialog: false,
      report_info: {
        IntentResults: [
          {
            main_intent: { intent_name: "" },
          },
        ],
        SentiAnylses: [
          {
            sentiment_name: "",
          },
        ],
        StoredSpeeches: [
          {
            duration: 0,
          },
        ],
        Compliance: {
          score: "",
          explaination: "",
        },
        Agent: { fullname: "" },
        Group: { name: "" },
        createdAt: "",
        csatTotal: "",
        note: "",
        group_id: null,
        id: null,
      },
      wavesurfer: [],
      separateText: [],
    };
  },
  created() {
    // Debounce the function call to handle frequent changes
    this.debouncedChangeMe = _.debounce(this.changeMe, 200); // Adjust debounce duration as needed

    //Detect width on resize
    window.addEventListener("resize", this.getWindowWidth.bind(this));
  },
  watch: {
    audio_value(val) {
      this.debouncedChangeMe(val);
    },
  },
  methods: {
    getWindowWidth() {
      // Update the windowWidth data property with the current window Width
      this.windowWidth = window.innerWidth;
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

      const formattedDate = new Date(inputDateTime).toLocaleDateString(
        "en-US",
        options
      );

      return formattedDate;
    },
    viewIntent(text) {
      this.view_text = text;
      this.dialog = true;
    },
    async saveNote() {
      // this.report_info.note = this.notes.notes
      const data = {
        id: this.$route.params.id,
        notes: this.report_info.note.notes,
      };
      const config = {
        url: "/notes",
        method: "POST",
        data: data,
      };

      const res = await this.api_call(config);
      if (res.data.result == "success") {
        this.notif({
          type: "success",
          message: "Note saved successfully!",
          title: "Note",
        });
        await this.getNotes();
      }
    },
    async getAudio() {
      // const config = {
      //   url: "/transaction-service/result/getAudio?id=" + this.$route.params.id,
      //   method: "GET",
      // };
      const config = {
        url:
          "https://ai-insight.etpbx.com/transaction-service/result/getAudio?id=" +
          this.$route.params.id,
        method: "GET",
        headers: {
          "x-auth": 123123,
        },
      };
      const res = await axios.request(config);
      this.testMe("agent", res.data.data[1]);
      this.testMe("customer", res.data.data[0]);
      // this.waveForm("agent",res.data.data[2])
      // this.waveForm("customer",res.data.data[1])
    },
    async testMe(type, data) {
      const container = type == "agent" ? "#waveform-0" : "#waveform-1";
      const color =
        type == "agent" ? this.color_picker[0] : this.color_picker[1];
      const color2 = type == "agent" ? "#002d4d" : "#0f3e1a";
      const interact = type == "agent" ? true : false;

      var wavesurfer = WaveSurfer.create({
        container: container,
        waveColor: color,
        progressColor: color2,
        // Set a bar width
        barWidth: 2,
        // Optionally, specify the spacing between bars
        barGap: 1,
        // And the bar radius
        barRadius: 2,
        interact: false,
        height: 70,

        mediaControls: true,
      });
      wavesurfer.load("data:audio/mp3;base64," + data);

      this.wavesurfer.push(wavesurfer);
    },
    changeMe(val) {
      this.wavesurfer[0].seekTo(val / this.wavesurfer[0].getDuration());
      this.wavesurfer[1].seekTo(val / this.wavesurfer[1].getDuration());
    },
    playMe() {
      this.playing = !this.playing;
      this.audioDuration = this.wavesurfer[0].getDuration();

      this.wavesurfer[0].on("audioprocess", () => {
        const currentTime = this.wavesurfer[0].getCurrentTime();
        this.audio_value = currentTime;
        this.wavesurfer[1].seekTo(
          this.audio_value / this.wavesurfer[1].getDuration()
        );
      });

      this.wavesurfer[0].playPause();
      this.wavesurfer[1].playPause();
    },
    destroyAll() {
      this.wavesurfer[0].pause();
      this.wavesurfer[1].pause();
    },
    async getReportDetails() {
      const config = {
        url: "/result/getCSAt/getByTranscript?id=" + this.$route.params.id,
        method: "GET",
      };
      const res = await this.api_call(config);
      this.report_info = res.data.data.data[0];
    },
    async getSeparate() {
      const config = {
        url: "/result/getSeperation?id=" + this.$route.params.id,
        method: "GET",
      };
      const res = await this.api_call(config);
      if (res.data.data.length > 0) {
        this.separateText = res.data.data[0].content;
      }
    },
    async getNotes() {
      const config = {
        url: "/notes?id=" + this.$route.params.id,
        method: "GET",
      };

      const res = await this.api_call(config);
      this.report_info.note = res.data.data;
    },
    async updateNotif() {
      if (this.$route.params.id != "total") {
        const config = {
          url: "/notif/seen?id=" + this.$route.params.id,
          method: "GET",
        };
        await this.api_call(config);
        await this.notification_bell()
      }
    },
    async notification_bell() {
      const config = {
        // url: "/groups?organization_id=" + 2,
        url: "/notif?id=" + this.org_id,
        method: "GET",
      };
      const res = await this.api_call(config);
      if (res.data.result == "success") {
      //  this.getNotification(res)
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
    async waveForm(type, data) {
      const audioContext = new AudioContext();

      const buffer = this.base64ToArrayBuffer(data);
      audioContext
        .decodeAudioData(buffer)
        .then((audioBuffer) => {
          const options = {
            audio_context: audioContext,
            audio_buffer: audioBuffer,
            scale: 128,
          };

          return new Promise((resolve, reject) => {
            WaveformData.createFromAudio(options, (err, waveform) => {
              if (err) {
                reject(err);
              } else {
                resolve(waveform);
              }
            });
          });
        })
        .then((waveform) => {
          console.log(`Waveform has ${waveform.channels} channels`);
          console.log(`Waveform has length ${waveform.length} points`);
          if (type == "agent") {
            this.waveFormImage(waveform, "wave-canvas-0");
          } else {
            this.waveFormImage(waveform, "wave-canvas-1");
          }
        });
    },

    base64ToArrayBuffer(base64) {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const buffer = new ArrayBuffer(len);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < len; i++) {
        view[i] = binaryString.charCodeAt(i);
      }
      return buffer;
    },

    waveFormImage(waveform, canvas_id) {
      const canvas = document.getElementById(canvas_id);
      const scaleY = (amplitude, height) => {
        const range = 256;
        const offset = 128;

        return height - ((amplitude + offset) * height) / range;
      };

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#73bff2"; // Set your desired fill color
      ctx.strokeStyle = "#a2d4f6"; // Set your desired stroke color
      ctx.beginPath();

      const channel = waveform.channel(0);

      // Loop forwards, drawing the upper half of the waveform
      for (let x = 0; x < waveform.length; x++) {
        const val = channel.max_sample(x);

        ctx.lineTo(x + 0.5, scaleY(val, canvas.height) + 0.5);
      }

      // Loop backwards, drawing the lower half of the waveform
      for (let x = waveform.length - 1; x >= 0; x--) {
        const val = channel.min_sample(x);

        ctx.lineTo(x + 0.5, scaleY(val, canvas.height) + 0.5);
      }

      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    },
  },
  beforeRouteLeave(to, from, next) {
    this.destroyAll();
    next();
  },
  async mounted() {
    this.org_id = Cookies.get("_org");
    this.show_col = false;
    this.loadscreen(true);
    await this.updateNotif();
    await this.getReportDetails();
    await this.getNotes();
    await this.getNotif();
    await this.getSeparate();

    const col1Height = this.$refs.col1.$el.clientHeight;
    const col3Height = this.$refs.col3.$el.clientHeight;
    if(col1Height > col3Height){
      this.$refs.col2.$el.style.height = col1Height + "px";
      this.$refs.col3.$el.style.height = col1Height + "px";
    } else {
      this.$refs.col2.$el.style.height = col3Height + "px";
      this.$refs.col1.$el.style.height = col3Height + "px";
    }

    this.show_col = true;
    this.loadscreen(false);
    await this.getAudio();

  },
};
</script>
<style>
.v-tabs {
  border-bottom: 1px solid #dee2e6;
}

.analysis {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e3e3e3;
}

.analysis span {
  display: flex;
  gap: 20px;
}

.analysis span p {
  color: #0074e4 !important;
  cursor: pointer;
}

.analysis span p:hover {
  text-decoration: underline;
}

.analysis-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.customer-box {
  width: 100%;
  margin-bottom: 20px;
}

.customer-box .wrap {
  width: fit-content;
  max-width: 80%;
}

.customer-box .title,
.agent-box .title {
  color: gray !important;
  font-size: 14px;
  margin-bottom: 5px;
}

.customer-box .message {
  background: #e8f0f4;
  padding: 10px;
  border-radius: 8px;
}

.agent-box {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: end;
}

.agent-box .wrap {
  width: fit-content;
  max-width: 80%;
}

.agent-box .message {
  background: #0091ff;
  color: #fff !important;
  padding: 10px;
  border-radius: 8px;
}

.v-field textarea {
  font-size: 14px !important;
}

.v-sheet {
  min-height: 300px !important;
}

/* .v-chip.t-green p {
  color: green;
}

.v-chip.t-red p {
  color: red;
} */

.v-chip.bg-green .v-chip__content,
.v-chip.bg-red .v-chip__content {
  color: #fff;
}

/* New */
.analysis_list .v-expansion-panel__shadow {
  box-shadow: none !important;
}

.analysis_list .v-expansion-panel-title .v-icon {
  margin-right: 10px;
}

.analysis_list .v-expansion-panel-title {
  padding: 0 0 0 10px !important;
}

.v-window.analysis_sd {
  overflow-y: auto !important;
}

.analysis_list .v-row:not(.text_analysis) {
  background: #e8f0f4;
  border-radius: 8px;
}

.qmb {
  display: flex;
  gap: 20px;
  background: #e8f0f4;
  /* padding: 10px 10px 10px 18px; */
  padding: 5px 5px 5px 8px;
  border-radius: 8px;
}

.qmb .number {
  display: flex;
  /* height: fit-content; */
  align-items: center;
}

.qmb .number span {
  background-color: #3987bf;
  color: #fff;
  border-radius: 26px;
  font-size: 14px;
  padding: 1px 7px;
}

.border-1 {
  border: 1px solid #bee5eb;
  background: #e8f0f4;
  border-radius: 8px;
}

.csat_score_box .v-expansion-panel__shadow {
  box-shadow: none;
}

.csat_score_box .v-expansion-panel-title {
  background: #e8f0f4;
  border-radius: 8px;
}

.csat_score_box .v-row:not(.text_analysis) {
  background: #e8f0f4;
  border-radius: 8px;
}

.border-left {
  border-left: 1px solid #bfbfbf;
}
</style>
