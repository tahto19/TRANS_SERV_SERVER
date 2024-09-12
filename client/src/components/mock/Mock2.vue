  <template>
    <iframe :src="iframe" frameborder="0"></iframe>
    <v-textarea v-model="url" placeholder="URL" label="URL" variant="outlined"></v-textarea>
    <v-textarea v-model="authorization" placeholder="Authorization Code" label="Authorization Code" variant="outlined"></v-textarea>
    <v-textarea v-model="data" placeholder="Data" label="Data" variant="outlined"></v-textarea>
    <v-btn @click="Submit()">
        submit
    </v-btn>
<!-- 
    <vue-speedometer
        value="22"
      /> -->
  </template>
  <script>
    import axios from "axios";
    import VueSpeedometer from "vue-speedometer";

    export default {
        components: {
    VueSpeedometer,
  },
      data() {
        return {
            url: 'https://ai-insight.etpbx.com/api-gateway/gateway/start',
            authorization: 'ei-pI8k0CvfPJQLOwOyUoKldwOiO49bnEegbWcML1UTfgf6fHut5S',
            data: ` {
                "headers": {
        "Authorization": "Bearer [api-key]"
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
}`,
iframe: '',
        };
      },

      methods: {
        async Submit(){
            const config = {
          url: this.url,
          method: "POST",
          data: this.data,
          headers: {
            AuthorizationCode: this.authorization,
            "Content-Type": "application/json",
          },
        };

        const res = await axios.request(config);
        console.log(res);
        },

        async Testing(){
            const config = {
          url: "https://insightsdev.etpbx.com/api/widget/queue_metrics/40fead5a5856c3e6f0dc59d0030aba10/003849",
          method: "get",
          data: {
            _token: "zChfN38HiLFh4QRxFDdv9Hoal6kDlzlSdLgCsWP6",
            email: "test@eacomm.com",
            password: "7o2Eit$84ziz"
          },
          headers: {
            AuthorizationCode: this.authorization,
            "Content-Type": "application/json",
          },
        };

        const res = await axios.request(config);
        this.iframe = res
        console.log(res);
        }
      },
      async mounted() {
        await this.Testing()
      },
    };
  </script>
  <style lang=""></style>