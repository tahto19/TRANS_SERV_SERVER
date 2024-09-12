<template lang="">
  <div>
    <h1 class="top-header">Mock Build</h1>
    <v-card class="mx-auto my-8 px-5 pt-1 pb-3" max-width="100%" elevation="4">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <p class="mr-5 my-auto">Transcript</p>
          </v-col>
          <v-col cols="12">
            <v-tabs v-model="tab">
              <v-tab value="one">Text</v-tab>
              <v-tab value="two">Audio</v-tab>
            </v-tabs>
            <br />
            <v-window v-model="tab">
              <v-window-item value="one">
                <v-textarea
                  v-model="text_data.transcript"
                  placeholder="Enter text here..."
                  variant="outlined"
                ></v-textarea>
              </v-window-item>

              <v-window-item value="two">
                <v-row>
                  <v-col cols="4">
                    <!-- <v-select
                      variant="outlined"
                      hide-details="auto"
                      placeholder="Type"
                      :items="items2"
                      item-title="name"
                      item-value="id"
                      v-model="groupId"
                    ></v-select> -->
                    <v-file-input label="File input" v-model="audio_data.files"></v-file-input>
                  </v-col>
                </v-row>
              </v-window-item>

              <v-window-item value="three"> Three </v-window-item>
            </v-window>
          </v-col>
        </v-row>
        <v-row>
          <!-- <v-col cols="1">
              <p>Group</p>
            </v-col> -->
          <v-col cols="4">
            <v-select
              variant="outlined"
              hide-details="auto"
              placeholder="Group"
              :items="groups"
              item-title="name"
              item-value="id"
              v-model="groupId"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              variant="outlined"
              hide-details="auto"
              placeholder="Agent"
              :items="agents.Agents"
              item-title="fullname"
              item-value="id"
              v-model="agentId"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              @click="submitTranscript"
              elevation="0"
              color="rgb(0, 116, 228)"
              variant="outlined"
              class="text-overline text-none float-right"
            >
              Submit transcript
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <!-- <v-card class="mx-auto my-8 px-5 pt-1 pb-3" max-width="100%" elevation="4">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <p class="mr-5 my-auto">Intent Result</p>
          </v-col>
          <v-col cols="12" v-if="itent_result.details">
            <div>Main Intent: <br />{{ itent_result.details.main_intent }}</div>
            <br />
            <div>Sub Intent: {{ itent_result.details.sub_intent }}</div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto my-8 px-5 pt-1 pb-3" max-width="100%" elevation="4">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <p class="mr-5 my-auto">Sentiment Result</p>
          </v-col>
          <v-col cols="12" v-if="sentiment_result.details">
            {{ sentiment_result.details }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mx-auto my-8 px-5 pt-1 pb-3" max-width="100%" elevation="4">
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <p class="mr-5 my-auto">KPI Result</p>
          </v-col>
          <v-col cols="12" v-if="kpi_result.details">
            {{ kpi_result.details.data }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card> -->
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      tab: 'two',
      groups: [],
      agents: [],
      items: [
        { name: "California", id: 0 },
        { name: "Colorado", id: 1 },
        { name: "Florida", id: 2 },
        { name: "Georgia", id: 3 },
        { name: "Texas", id: 4 },
        { name: "Wyoming", id: 5 },
      ],
      items2: [
        { name: "MP3", id: 0 },
        { name: "WAV", id: 1 },
      ],
      audio_data: {
        type: "",
        files: null,
      },
      text_data: {
        transcript: "",
      },
      groupId: 1,
      agentId: null,
      selectedItem: [],
      metricRange: "",
      intent_array: [],
      kpi_array: [],
      itent_result: "",
      sentiment_result: "",
      kpi_result: "",
    };
  },
  watch: {
    // groupId(val) {
    //   this.getAgents();
    // },
  },
  methods: {
    async getAgents() {
      const config = {
        url: "/groups/getUsersByGroupId",
        method: "POST",
        data: { agent_group_id: this.groupId },
      };
      const res = await this.api_call(config);
      this.agents = res.data.data[0];
      console.log(this.agents);
    },
    async getGroup() {
      const config = {
        url: "/groups?organization_id=" + 2,
        method: "GET",
      };
      const res = await this.api_call(config);
      this.groups = res.data.data;
      console.log(this.groups);
      await this.getAgents();

    },
    async getAllData() {
      const config = {
        url: "/config?groupId=" + 3,
        method: "GET",
      };
      const res = await this.api_call(config);
      if (res.data && res.data.result) {
        this.selectedItem = res.data.data;
        this.metricRange = res.data.data.metricRange;

        this.selectedItem.Intents.map((x) => {
          this.intent_array.push({
            name: x.intent,
            description: x.desc,
          });
          return x;
        });

        // this.selectedItem.Intents.map( x => {
        //     x.data.map( n => {
        //         this.kpi_array.push({
        //             kpi_name: n.call_quality,
        //             kpi_explanation: n.metric_desc
        //         })
        //     })
        // })
        // this.intent_array.
        console.log(this.kpi_array);
        console.log(this.intent_array);
      }
    },
    async getInitials() {
      await this.getGroup();
      await this.getAgents();
      await this.getAllData();
    },
    async getSentiment() {
      const data = {
        transcript: this.text_data.transcript,
      };
      const res = await this.module_api_call({
        url: "/sentiment-analysis/request",
        method: "POST",
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.sentiment_result = res.data;
    },
    async getKPI() {
      console.log(this.selectedItem);
      const kpi_data = this.selectedItem.Intents.find(
        (x) => x.intent === this.itent_result.details.main_intent.name
      );
      kpi_data.data.map((x) => {
        this.kpi_array.push({
          kpi_name: x.call_quality,
          kpi_explanation: x.metric_desc,
        });
      });
      console.log(kpi_data);
      const data = {
        transcript: this.text_data.transcript,
        kpi_array: this.kpi_array,
        metric_range: this.metricRange,
      };
      const res = await this.module_api_call({
        url: "/text-analysis/request",
        method: "POST",
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
      });

      this.kpi_result = res.data;
    },
    async submitTranscript() {
      // const data = {
      //   transcript: this.text_data.transcript,
      //   id: this.agentId,
      // };


      // const res =  await axios.post('http://localhost:3333/speech-text/upload', {audio: this.audio_data.files[0]}, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })
      // console.log(res)

      
      // const data = this.data;


      // const res = await this.api_call({
      //   url: "/callai/newintentAnylsis",
      //   method: "POST",
      //   data: data,
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

      // if (res.data.response) {
      //   console.log(res.data);
      // }

      
      // const data = {
      //     transcript: this.transcript,
      //     intent_array: this.intent_array
      // }
      // const res = await this.module_api_call({
      //     url: "/intent-analysis/request",
      // method: "POST",
      // data: data,
      // headers: {
      //     "Content-Type": "application/json",
      //   },
      // })

      // if(res.data.response){
      //     this.itent_result = res.data;
      //     await this.getSentiment();
      //     await this.getKPI();
      // }

      // console.log(res);
    },
  },
  async mounted() {
    await this.getInitials();
    const data = {
    "headers": {
        "Authorization": "Bearer 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"
    },
    "data": [
        {
            "model": "gpt-3.5-turbo-1106",
            "messages": [
                {
                    "role": "system",
                    "content": "P-H-A-W, how may I help you? Yes, good afternoon. I'm phoning regarding a refund to my mother-in-law, which hasn't happened yet. And we're just wondering where the money is. Okay, mom, can I have your mother's name, please? Yes, her name is Jacqueline Dunn. Okay, Jacqueline Dunn. D-U-N. D-U-N, all right. Yes, ma'am. Can I have your postal code, please? Our postal code is T-D, T for Tommy, D for Douglas, Inc., 6, Japan, Papa. All right, okay. So, when did you pay for the human aid, ma'am? She paid for them on the 31st. No, hang on a minute. It was the 18th of October. Oh, that's quite some time. Okay. So, until now, there is no delivery yet, right? No, no. She had them being delivered, and she sent them back to you on the 8th of November. And she phoned and checked that week, the end of that week, that you had received them back. And you had. So, she returned within your 14-day period. So, we're wondering why she hasn't been refunded her money. Okay. So, okay. Can I have your name, ma'am? My name is Gwen. Okay. You are the donor, right? Yes. Okay. So, all of our consultants are busy attending to other calls right now. But rest assured, I'm going to invoice your consent to our consultants, and they'll get back to you as soon as we can. Will that be okay? Yes. What number are you going to ring me back on? Okay. Is this the number you're using now? 0-1-5-7-8-7-5-0-3-9-3. Yes, it is. Is this correct? Yes, it is. But I have my mother-in-law sitting with me here at the moment. Do you know when they'll be able to phone me back? Okay. So, it's getting late now. It's already in the afternoon. So, maybe if they can't call you back today, probably they'll call you back tomorrow. But then if they need to talk to my mother, she doesn't live with us. So, you know, this could go on for days. She won't be here if you need to talk to her for her approval to talk about this. So, is there any way I could wait to see, maybe get a consultant to speak to me? Okay. So, would you rather call you back? Would you rather let them call you back in another number? That's still going to have the same problem. My mother-in-law might not be here. Okay. So, do you have, okay, any specific time and date to call you back so I could write it down? Well, could I not just hold on and wait for somebody to become available? Oh, I'm afraid you can't, ma'am. So, all I have to do is endorse your call and they'll get back to you as soon as they can. So, maybe you could just wait within 24 hours. So, if they can't call you back today, maybe tomorrow. Are you open on a Saturday? Yes, we are. On Sunday, ma'am. On Sunday. And even if I, would there be any chance of a phone back in half an hour? Would there be somebody available there? Okay. I don't think so. I don't think so, ma'am. Why? Okay. You just have to wait. Maybe within this day. Okay. So, you could, okay, wait for their call. Well, could I speak to your customer services department, ma'am, please? Okay. They'll be here right now, ma'am. So, that's why I'm going to... Is everybody busy? Are they? Yes, ma'am. Yes, they are, ma'am. Right. Okay. This is... Okay. I'm... Anyway, I'm noting it down that they have to call you, okay, as soon as possible. Yes, please. Okay. So, will that be all? Can I have... Yes. Well, there's not an awful lot more you can do if nobody's available, which I find quite extraordinary, especially when you're sitting with £3,500 of somebody's money and you've not refunded it yet. Okay. I understand. Oh, I'm sorry to hear that, anyway. Yes. Well, I'll maybe get on to trading standards in the meantime to find out how they can help, and I'll speak to the bank, as well. Yes, ma'am. All right. So, okay, the best thing I could do is endorse you, okay, and let them call you as soon as they can. That would be wonderful. Okay. Thank you very much. Okay. Have a nice day. Goodbye. Bye."
                }
            ],
            "temperature": 0,
            "tools": [
                {
                    "type": "function",
                    "function": {
                        "name": "intent_analysis",
                        "parameters": {
                            "type": "object",
                            "description": "classify the document using the categories: Sales,Support,Interview. provide a confidence score of 0-1 for each category. explain your answer in 20 words or less.",
                            "properties": {
                                "intents": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "name": {
                                                "type": "string",
                                                "description": "Category name"
                                            },
                                            "score": {
                                                "type": "number",
                                                "description": "category score"
                                            },
                                            "explanation": {
                                                "type": "string",
                                                "description": "Category Explanation"
                                            }
                                        },
                                        "required": [
                                            "name",
                                            "score",
                                            "explanation"
                                        ]
                                    }
                                }
                            },
                            "required": [
                                "intents"
                            ]
                        }
                    }
                }
            ],
            "tool_choice": {
                "type": "function",
                "function": {
                    "name": "intent_analysis"
                }
            }
        }
    ]
}
console.log("hi")

        const config = {
          url: "http://127.0.0.1:4118/gateway/start",
          method: "POST",
          data: data,
          headers: {
            "AuthorizationCode": "ei-pI8k0CvfPJQLOwOyUoKldwOiO49bnEegbWcML1UTfgf6fHut5S",
            "Content-Type": "application/json",
          },
        };

        const res = await axios.request(config);
        console.log(res)
  },
};
</script>
<style lang=""></style>
