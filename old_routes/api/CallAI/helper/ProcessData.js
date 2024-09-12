import { changeToJson } from "../../../../helper/helpersHere.js";
import Query from "../../../../models/Query.model.js";
import TranscriptSeperation from "../../../../models/TranscriptSeperation.js";
import {
  compliance_config,
  intent_config,
  kpi_config,
  notes_config,
  sentimental_config,
  speech_cofig,
} from "../proccess/assets/chatgptconfig.js";
import { intent_prompt, kpi_prompt } from "../proccess/assets/prompt.js";
import executeRequest from "../proccess/excuteRequest.js";
import processNew from "../proccess/processNew.js";
import { saveToDatabase } from "./Query.js";
export const processingData = async (
  file,
  apikey,
  agent,
  service,
  intent,
  transcript,
  transcript_id
) => {
  let type = "";
  try {
    if (!service.Service && !service.Service.ServiceBundles)
      throw new Error("No Services Found");
    let serviceBundle = service.Service.ServiceBundles;
    let data = {
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AIAPI_KEY,
      },
      data: [],
    };

    let agentDetails =
      agent.Group.GroupServiceConfigs[0].Intents[0].intent === undefined
        ? changeToJson(agent)
        : agent;

    serviceBundle.sort((a, b) => a.sequence - b.sequence);

    // serviceBundle.forEach(async (v) => {
    for (let i = 0; i < serviceBundle.length; i++) {
      let v = serviceBundle[i];
      let getAiModule = v.AiModule;
      type += type === "" ? getAiModule.name : "|" + getAiModule.name;
      if (getAiModule.name === "DEV-TEXT-TO-SPEECH") {
        let fileToChage = v.sequence === 1 ? 2 : 1;
        data.data.push(speech_cofig(file[fileToChage]));
      } else {
        if (v.requirement !== null) {
          if (getAiModule.name === "Sentiment Analysis") {
            data.data.push(sentimental_config());
          } else if (getAiModule.name === "Intent Analysis") {
            let createPrompt = createPromptIntent(
              agentDetails.Group.GroupServiceConfigs[0].Intents
            );
            let prompt = intent_config(
              null,
              createPrompt.explanation,
              createPrompt.intent_prompt
            );
            data.data.push(prompt);
          } else if (getAiModule.name === "Compliance") {
            console.log(v);
            let prompt = compliance_config(
              null,
              intent.script,
              agentDetails.Group.GroupServiceConfigs[0].metricRange
            );

            data.data.push(prompt);
          }
        } else {
          if (getAiModule.name === "Text Analysis") {
            let prompt = kpiPromt(
              intent,
              transcript,
              agentDetails.Group.GroupServiceConfigs[0].metricRange
            );

            data.data.push(prompt);
          } else if (getAiModule.name === "Content Summarizer") {
            let prompt = notes_config(transcript);

            data.data.push(prompt);
          } else if (getAiModule.name === "Compliance") {
            let prompt = await compliancePropmt_with_no_target(
              transcript_id,
              intent.script,
              agentDetails.Group.GroupServiceConfigs[0].metricRange
            );
            console.log(data.data.length);
            data.data.push(prompt);
          }
        }
      }
    }

    let er = new executeRequest();

    await er.start(data, apikey);
    let response = await er.start_call(apikey);

    return { response, type };
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const compliancePropmt_with_no_target = async (
  transcript_id,
  script,
  metricRange
) => {
  try {
    let transcriptSeperation = await TranscriptSeperation.findOne({
      where: { transcript_id },
    });
    if (transcriptSeperation === null) throw new Error("Somethin went wrong");
    let tS = changeToJson(transcriptSeperation);
    let agentText = "";
    tS.agentSegment.forEach((v, i) => {
      agentText += v.text + "/n";
    });
    let prompt = compliance_config(agentText, script, metricRange);
    return prompt;
  } catch (err) {
    console.log(err);
  }
};
export const createPromptIntent = (intents) => {
  const intentNames = intents.map((intent) => intent.intent).join(",");
  const newPrompt = intent_prompt.replace("[callintent]", intentNames);

  const explanations = intents
    .filter((intent) => intent.desc.trim() !== "")
    .map((intent) => `${intent.intent}: ${intent.desc}`)
    .join("\n");

  const response = {
    response: true,
    intent_prompt: newPrompt,
    explanation: explanations || " ",
  };

  return response;
};
export const kpiPromt = (kpi_array, transcript, metric_range) => {
  let array = [];
  let prompt = kpi_prompt;
  for (let i = 0; i < kpi_array.data.length; i++) {
    const kpi_name = kpi_array.data[i].call_quality;
    const kpi_explanation = kpi_array.data[i].metric_desc;
    array.push("\n" + "- " + kpi_name + ":if" + kpi_explanation);
  }
  prompt = prompt.replace("[kpi_array]", array.join(""));
  prompt = prompt.replace("[transcript]", `"${transcript}"`);
  prompt = prompt.replace("[metricrange]", metric_range);
  let config = kpi_config(prompt);
  return config;
};
