import Agents from "../../../../models/Agents.model.js";
import GroupServiceConfig from "../../../../models/GroupServiceConfig.model.js";
import Groups from "../../../../models/Groups.model.js";
import Intents from "../../../../models/Intents.model.js";
import * as fs from "fs";
import { intent_prompt, kpi_prompt } from "./assets/prompt.js";
import { changeToJson } from "../../../../helper/helpersHere.js";
import {
  chatgptConfig,
  kpi_config,
  sentimental_config,
} from "./assets/chatgptconfig.js";
import executeRequest from "./excuteRequest.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import IntentDetails from "../../../../models/IntentDetails.model.js";
import KpiAnylsis from "../../../../models/KpiAnylsis.model.js";
import SentimentAnylsis from "../../../../models/SentimentAnylsis.model.js";
// import Transcripts from "../../../../models/Transcripts.model.js";
const returnByAi =
  '{"intents":[{"name":"Sales","score":0.8,"explanation":"The conversation is related to a potential sale or business transaction."},{"name":"Support","score":0.2,"explanation":"The conversation is seeking assistance or support with a product or service."},{"name":"Interview","score":0.0,"explanation":"The conversation is not related to an interview."},{"name":"Complaint","score":0.0,"explanation":"The conversation is not a complaint."}]}';
export class proccessIntent {
  constructor() {
    this.api_key = "";
    this.group_id;
    this.Intents = [];
    this.error = [];
    this.kind;
  }
  async process(transcript, userId, kind) {
    try {
      var getUserInfo = await this.getUserInfo(userId);
      this.kind = kind;
      if (getUserInfo === null)
        handleError("Id Provided cant find in the database");

      this.group_id = getUserInfo.id;
      var getServiceConfig = await this.getServiceConfigDetails();
      if (getServiceConfig === null)
        handleError("Cant Find Config for this group");

      if (getServiceConfig.Intents.length === 0)
        handleError("Cant Find Intent for this group");
      this.Intents = getServiceConfig.Intents;

      let getGeneratedPrompt = await this.createPromptIntent();
      let getPromptIntent = await chatgptConfig(
        transcript,
        getGeneratedPrompt.explanation,
        getGeneratedPrompt.intent_prompt
      );
      //
      console.log("getIntent");
      let getIntent = await this.request(getPromptIntent);

      let getMainAndSubIntent = this.filterIntents(getIntent.details);
      let kpiDetails = await this.kpiProcess(getMainAndSubIntent);
      let processIntentData = await this.createKPI_Prompt(
        transcript,
        kpiDetails.data,
        getServiceConfig.metricRange
      );

      let kpi_prompt = await kpi_config(processIntentData);
      console.log("getKpi");
      let getKpi = await this.request(kpi_prompt);
      //
      let getKPIResult = JSON.parse(getKpi.details);

      let senti_prompt = sentimental_config(transcript);
      console.log("getSenti");
      let getSenti = await this.request(senti_prompt);
      //
      console.log("saving Transcripts");
      let saveTranscript = await this.saveIntoDatabase(Transcripts, {
        content: transcript,
        agent_id: userId,
        group_id: getUserInfo.id,
      });
      var saveSubIntentDetails = null;
      console.log("saving IntentDetails");
      let saveMainIntentDetails = await this.saveIntoDatabase(IntentDetails, {
        intent_name: getMainAndSubIntent.main_intent.name,
        score: getMainAndSubIntent.main_intent.score,
        desc: getMainAndSubIntent.main_intent.explanation,
      });
      if (getMainAndSubIntent.sub_intents.length !== 0) {
        saveSubIntent = await this.saveIntoDatabase(IntentDetails, {
          intent_name: getMainAndSubIntent.sub_intents.name,
          score: getMainAndSubIntent.sub_intents.score,
          desc: getMainAndSubIntent.sub_intents.explanation,
        });
      }
      console.log("saving Intent Result " + getIntent.id);
      let saveIntentResult = await this.saveIntoDatabase(IntentResult, {
        sub_intent_id:
          saveSubIntentDetails === null
            ? saveSubIntentDetails
            : saveSubIntentDetails.id,
        main_intent_id: saveMainIntentDetails.id,
        transcript_id: saveTranscript.id,
        setup_id: getIntent.id,
      });
      console.log("saving kpiDetails");
      getKPIResult.data.forEach(async (x) => {
        let findKpiDetails = kpiDetails.data.find((xx) => {
          return xx.call_quality.toLowerCase() === x.kpi.toLowerCase();
        });
        if (findKpiDetails.length === 0)
          this.error.push(`${x.kpi} Didnt save to backend`);
        await this.saveIntoDatabase(KpiAnylsis, {
          kpi: x.kpi,
          rating: x.grade,
          anaylsis: x.explain,
          transcript_id: saveTranscript.id,
          getWeight: findKpiDetails.cust_sat_weight,
          setup_id: getKpi.id,
        });
      });
      // console.log("saving sentiment", getSentiPromptIdDetails);
      let parseGetSenti = JSON.parse(getSenti.details);
      parseGetSenti["setup_id"] = getSenti.id;
      parseGetSenti["transcript_id"] = saveTranscript.id;
      let getSentimentResult = await this.saveIntoDatabase(
        SentimentAnylsis,
        parseGetSenti
      );
      return saveTranscript;
    } catch (err) {
      console.log(err);
      if (err.data !== undefined) handleError(err.data.error);
      else handleError(err.message);
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
  async getUserInfo(userId) {
    let r = await Groups.findAll({
      raw: true,
      include: [
        {
          model: Agents,
          require: true,
          attributes: ["fullname", "contact_details", "id", "agent_group_id"],
          where: { id: userId },
        },
      ],
    });
    console.log(r);
    return changeToJson(r);
  }
  async getServiceConfigDetails() {
    let r = await GroupServiceConfig.findAll({
      raw: true,
      where: { groupId: this.group_id },
      include: [
        {
          model: Intents,
          attributes: ["intent", "desc", "data"],
          where: { active: true },
        },
      ],
    });
    return changeToJson(r);
  }
  filterIntents(data) {
    let intents = JSON.parse(data);

    let filtered_intent = {
      main_intent: {},
      sub_intents: [],
    };

    const filter_main = intents.intents.reduce((maxObject, currentObject) => {
      return currentObject.score > maxObject.score ? currentObject : maxObject;
    }, intents.intents[0]);

    filtered_intent.main_intent = filter_main;

    const filter_sub = intents.intents.filter((x) => {
      const score = filtered_intent.main_intent.score - x.score;
      return (
        x !== filtered_intent.main_intent &&
        (x.score > 0.5 || score == 0.1 || score == 0.2)
      );
    });
    filtered_intent.sub_intents = filter_sub;

    return filtered_intent;
  }
  async kpiProcess(d) {
    let getMainIntent = this.Intents.find((x) => {
      return x.intent === d.main_intent.name;
    });

    return getMainIntent;
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
  async saveIntoDatabase(table, data) {
    try {
      let save = await table.create(data);
      return save;
    } catch (err) {
      handleError(err.message);
    }
  }
  async request(prompt, data) {
    let a = {
      id: data === undefined ? null : data.id,
      details: data === undefined ? null : data.details,
    };
    try {
      let er = await new executeRequest();
      await er.start(prompt);
      let i = 0;
      let j = 0;
      while (a.id === null) {
        if (j !== 0) console.log("Attempting to reconnect create " + j);
        a.id = await er.create();
        j++;
      }
      console.log(a);
      while (a.details === null) {
        if (i !== 0) {
          console.log("Attempting to reconnect get " + i);
          // a.details = await er.callback();
        }
        // else

        a.details = await er.execute();
        i++;
      }

      return a;
    } catch (err) {
      handleError(err.message);
    }
  }
}
export function handleError(message) {
  let error = new Error(message);
  error.code = 400;
  error.statusCode = 400;
  throw error;
}
