import Agents from "../../../../models/Agents.model.js";
import Compliance from "../../../../models/Compliance.model.js";
import GroupServiceConfig from "../../../../models/GroupServiceConfig.model.js";
import Groups from "../../../../models/Groups.model.js";
import IntentDetails from "../../../../models/IntentDetails.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import Intents from "../../../../models/Intents.model.js";
import KpiAnylsis from "../../../../models/KpiAnylsis.model.js";
import Notes from "../../../../models/Notes.model.js";
import SentimentAnylsis from "../../../../models/SentimentAnylsis.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import Query from "../../../../models/Query.model.js";
import {
  chatgptConfig,
  compliance_config,
  kpi_config,
  sentimental_config,
} from "./assets/chatgptconfig.js";
import {
  compliance_prompt,
  intent_prompt,
  kpi_prompt,
} from "./assets/prompt.js";
import executeRequest from "./excuteRequest.js";
import { handleError } from "./proccess.js";

class NewIntentProcess {
  constructor() {
    this.transcript = "";
    this.transcript_id;
    this.userInfo;
    this.user_id;
    this.group_id;
    this.Intents;
    this.error = [];
    this.saveTranscript_id;
    this.main_intent = null;
    this.getServiceConfig = null;
    this.apikey = 22;
  }
  // this is old below ////
  // async start(transcript, user_id) {
  //   try {
  //     this.transcript = transcript;
  //     this.user_id = user_id;
  //     this.userInfo = await this.getUserInfo();
  //     this.group_id = this.userInfo.id;
  //     this.getServiceConfig = await this.getServiceConfigDetails();
  //     this.Intents = this.getServiceConfig.Intents;
  //     let getGeneratedPrompt = await this.createPromptIntent();
  //     let getPromptIntent = await chatgptConfig(
  //       transcript,
  //       getGeneratedPrompt.explanation,
  //       getGeneratedPrompt.intent_prompt
  //     );

  //     // this.saveTranscript_id = saveTranscript.id;

  //     let getIntent = await this.request(getPromptIntent);

  //     let saveTranscript = await this.saveToDatabase(Transcripts, {
  //       content: transcript,
  //       agent_id: user_id,
  //       group_id: this.group_id,
  //     });
  //     this.saveTranscript_id = saveTranscript.id;

  //     await saveToQuery(getIntent, "IntentResult");
  //     return;
  //     await this.saveIntent(getIntent);

  //     // let kpiProcess = await this.savekpi();
  //     let senti = await this.saveSenti();

  //     let saveCompliance = await this.saveCompliance();

  //     return { Transcripts: saveTranscript, error: this.error };
  //   } catch (err) {
  //     console.log(err);
  //     throw err;
  //   }
  // }
  // this is old upper ////
  async start(transcript, user_id, Access) {
    try {
      this.apikey = Access.ApiKeys.find(
        (x) => x.callback_url === "http://localhost:4118/gateway/mock/callback"
      ).api_key;
      this.transcript = transcript;
      this.user_id = user_id;
      this.userInfo = await this.getUserInfo();
      this.group_id = this.userInfo.id;
      this.getServiceConfig = await this.getServiceConfigDetails();
      this.Intents = this.getServiceConfig.Intents;
      let getGeneratedPrompt = await this.createPromptIntent();
      let getPromptIntent = await chatgptConfig(
        transcript,
        getGeneratedPrompt.explanation,
        getGeneratedPrompt.intent_prompt
      );
      let senti_prompt = sentimental_config(this.transcript);
      // this.saveTranscript_id = saveTranscript.id;
      return getPromptIntent;
      let getIntent = await this.request(getPromptIntent);

      let saveTranscript = await this.saveToDatabase(Transcripts, {
        content: transcript,
        agent_id: user_id,
        group_id: this.group_id,
      });
      this.saveTranscript_id = saveTranscript.id;
      await this.saveToQuery(getIntent, "IntentResult");
      let getSenti = await this.request(senti_prompt);
      await this.saveToQuery(getSenti, "SentimentAnylsis");

      return {
        Transcripts: saveTranscript,
        error: this.error,
        getSenti,
        getIntent,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  process() {}
  async getUserInfo() {
    try {
      let r = await Groups.findOne({
        include: [
          {
            model: Agents,
            require: true,
            attributes: ["fullname", "contact_details", "id", "agent_group_id"],
            where: { id: this.user_id },
          },
        ],
      });
      if (r == null) throw new Error("Not user Found");
      return r.toJSON();
    } catch (err) {
      throw err;
    }
  }
  async getServiceConfigDetails() {
    try {
      let r = await GroupServiceConfig.findOne({
        where: { groupId: this.group_id },
        include: [
          {
            model: Intents,
            attributes: ["intent", "desc", "data", "script"],
            where: { active: true },
          },
        ],
      });
      if (r === null) throw new Error("Not Found Config");
      let toReturn = r.toJSON();
      if (toReturn.Intents.length === 0) throw new Error("No Intent Found");
      return toReturn;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  createPromptIntent() {
    const intentNames = this.Intents.map((intent) => intent.intent).join(",");
    const newPrompt = intent_prompt.replace("[callintent]", intentNames);

    const explanations = this.Intents.filter(
      (intent) => intent.desc.trim() !== ""
    )
      .map((intent) => `${intent.intent}: ${intent.desc}`)
      .join("\n");

    const response = {
      response: true,
      intent_prompt: newPrompt,
      explanation: explanations || " ",
    };

    return response;
  }
  async request(prompt, data) {
    let a = {
      id: data === undefined ? null : data.id,
      details: data === undefined ? null : data.details,
      createDetails: data === undefined ? null : data.createDetails,
    };
    try {
      let er = await new executeRequest();

      let i = 0;
      let j = 0;
      prompt["data"] = [prompt["fields"]];
      delete prompt.fields;
      delete prompt.service_api_id;
      delete prompt.request_link_id;
      await er.start(prompt, this.apikey);

      // if (j !== 0) console.log("Attempting to reconnect create " + j);
      // let a = await er.create();
      // console.log(a);

      let a = await er.create();

      // while (a.details === null || i === 3) {
      //   if (i !== 0) {
      //     if (i === 3) {
      //       a.details = {
      //         error: true,
      //         message: "Waiting for Intent to Finish",
      //       };
      //       console.log("Closing execute wait for call back");
      //     }
      //     console.log("Attempting to reconnect get " + i);
      //     // a.details = await er.callback();
      //   }

      //   // else

      //   a.details = await er.execute();
      //   i++;
      // }

      return a;
    } catch (err) {
      handleError(err.message);
    }
  }

  async createKPI_Prompt(transcript, kpi_array, metric_range) {
    let prompt = kpi_prompt;
    let array = [];

    for (let i = 0; i < kpi_array.length; i++) {
      const kpi_name = kpi_array[i].call_quality;
      const kpi_explanation = kpi_array[i].metric_desc;
      array.push("\n" + "- " + kpi_name + " which means: " + kpi_explanation);
    }

    prompt = prompt.replace("[kpi_array]", array.join(""));
    prompt = prompt.replace("[transcript]", `"${transcript}"`);
    prompt = prompt.replace("[metricrange]", metric_range);

    return prompt;
  }
  // new saving below
  async saveToQuery(data, TableName) {
    let toReturn = await this.saveToDatabase(Query, {
      type: TableName,
      setup_id: data.id,
      code: data.code,
      transcript_id: this.saveTranscript_id,
    });
    return toReturn;
  }

  // new saving above
  async saveIntent(data) {
    var saveSubIntentDetails = null;
    var saveMainIntentDetails = null;
    var toReturn = null;
    let intents = JSON.parse(data.details);
    if (data.details.error) {
      toReturn = await this.saveToDatabase(Query, {
        type: "Intents",
        setup_id: data.id.id,
        code: data.id.code,
        transcript_id: this.saveTranscript_id,
      });
      this.error.push(data.details.error);
    } else {
      let filtered_intent = {
        main_intent: {},
        sub_intents: {},
      };

      const filter_main = intents.intents.reduce((maxObject, currentObject) => {
        return currentObject.score > maxObject.score
          ? currentObject
          : maxObject;
      }, intents.intents[0]);

      // filtered_intent.main_intent = filter_main;

      const filter_sub = intents.intents.filter((x) => {
        const score = filtered_intent.main_intent.score - x.score;
        return (
          x !== filtered_intent.main_intent &&
          (x.score > 0.5 || score == 0.1 || score == 0.2)
        );
      });

      saveMainIntentDetails = await this.saveToDatabase(IntentDetails, {
        intent_name: filter_main.name,
        score: filter_main.score,
        desc: filter_main.explanation,
      });

      if (filter_sub.length !== 0) {
        saveSubIntentDetails = await this.saveToDatabase(IntentDetails, {
          intent_name: filter_sub[0].name,
          score: filter_sub[0].score,
          desc: filter_sub[0].explanation,
        });
      }
      toReturn = await this.saveToDatabase(IntentResult, {
        sub_intent_id:
          saveSubIntentDetails === null
            ? saveSubIntentDetails
            : saveSubIntentDetails.id,
        main_intent_id: saveMainIntentDetails.id,
        transcript_id: this.saveTranscript_id,
        setup_id: data.id,
      });
    }
    this.main_intent = saveMainIntentDetails.toJSON();
    return toReturn;
  }
  async savekpi(d) {
    var toReturn = null;
    if (this.main_intent === null) {
      this.error.push({
        error: true,
        message: "Need Intent to Finish this transaction",
      });
    } else {
      let getMainIntent = this.Intents.find((x) => {
        return x.intent === this.main_intent.intent_name;
      });

      let processIntentData = await this.createKPI_Prompt(
        this.transcript,
        getMainIntent.data,
        this.getServiceConfig.metricRange
      );
      // console.log(processIntentData);
      let kpi_prompt = await kpi_config(processIntentData);

      let getKpi = await this.request(kpi_prompt);
      if (getKpi.details.error) {
        toReturn = await this.saveToDatabase(Query, {
          type: "KPI",
          setup_id: getKpi.id.id,
          code: getKpi.id.code,
          transcript_id: this.saveTranscript_id,
        });
        this.push({ error: true, message: "Waiting for KPI to finish" });
      } else {
        let getKPIResult = JSON.parse(getKpi.details);

        getKPIResult.data.forEach(async (x) => {
          console.log(x, getMainIntent.data);
          let findKpiDetails = getMainIntent.data.find((xx) => {
            return xx.call_quality.toLowerCase() === x.kpi.toLowerCase();
          });

          if (findKpiDetails === undefined)
            this.error.push(`${x.kpi} Didnt save to backend`);
          toReturn = await this.saveToDatabase(KpiAnylsis, {
            kpi: x.kpi,
            rating: x.grade,
            anaylsis: x.explain,
            transcript_id: this.saveTranscript_id,
            getWeight: findKpiDetails.cust_sat_weight,
            setup_id: getKpi.id,
            metricsRange: this.getServiceConfig.metricRange,
          });
        });
      }
    }

    return toReturn;
  }
  async saveSenti() {
    var toReturn = null;
    let senti_prompt = sentimental_config(this.transcript);
    let getSenti = await this.request(senti_prompt);
    if (getSenti.details.error) {
      toReturn = await this.saveToDatabase(Query, {
        type: "Sentiment Anylsis",
        setup_id: getSenti.id.id,
        code: getSenti.id.code,
        transcript_id: this.saveTranscript_id,
      });

      this.error.push({ error: true, message: "waiting for senti to finish" });
    } else {
      let parseGetSenti = JSON.parse(getSenti.details);
      parseGetSenti["setup_id"] = getSenti.id;
      parseGetSenti["transcript_id"] = this.saveTranscript_id;
      toReturn = await this.saveToDatabase(SentimentAnylsis, parseGetSenti);
    }
    return toReturn;
  }
  async saveCompliance() {
    // change below to this.main_intent === null
    if (this.main_intent === null) {
      this.error.push({
        error: true,
        message: "Need Intent to Finish this transaction",
      });
    } else {
      let getMainIntent = this.Intents.find((x) => {
        return x.intent === this.main_intent.intent_name;
      });

      if (getMainIntent === undefined) {
        console.log(this.Intents);
        this.error.push({
          error: true,
          message: "Cant Find Main Intent",
        });
      } else {
        let config = compliance_config(
          this.transcript,
          getMainIntent.script,
          this.getServiceConfig.metricRange
        );
        let getRequest = await this.request(config);
        if (getRequest.details.error) {
          toReturn = await this.saveToDatabase(Query, {
            type: "Compliance",
            setup_id: getRequest.id.id,
            code: getRequest.id.code,
            transcript_id: this.saveTranscript_id,
          });
          this.push({
            error: true,
            message: "Waiting for Compliance to finish",
          });
        } else {
          let getResult = JSON.parse(getRequest.details);
          await this.saveToDatabase(Notes, {
            transcript_id: this.saveTranscript_id,
            notes: getResult.explaination,
          });
          await this.saveToDatabase(Compliance, {
            transcript_id: this.saveTranscript_id,
            explaination: getResult.explaination,
            score: getResult.score,
          });
          return { getResult, config };
        }
      }
    }
  }

  async saveToDatabase(table, data) {
    try {
      let dataToInsert = data.error ? {} : data;
      let save = await table.create(dataToInsert);
      return save;
    } catch (err) {
      handleError(err);
    }
  }
}
export default NewIntentProcess;
