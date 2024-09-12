import { changeToJson } from "../../../../helper/helpersHere.js";
import Agents from "../../../../models/Agents.model.js";
import GroupServiceConfig from "../../../../models/GroupServiceConfig.model.js";
import Groups from "../../../../models/Groups.model.js";
import IntentDetails from "../../../../models/IntentDetails.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import Intents from "../../../../models/Intents.model.js";
import NotesFilterD from "../../../../models/NotesFilterD.model.js";
import PiiFilter from "../../../../models/PiiFilter.model.js";
import Query from "../../../../models/Query.model.js";
import TranscriptSeperation from "../../../../models/TranscriptSeperation.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import { Agent } from "../../Agent/Agent.js";
import {
  compliance_config,
  intent_config,
  kpi_config,
  notes_config,
  notes_configV2,
  pii_filter,
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

    let getNotesConfigDetails = serviceBundle.sort(
      (a, b) => a.sequence - b.sequence
    );

    // serviceBundle.forEach(async (v) => {
    for (let i = 0; i < serviceBundle.length; i++) {
      let v = serviceBundle[i];
      let getAiModule = v.AiModule;

      type += type === "" ? getAiModule.name : "|" + getAiModule.name;
      if (
        getAiModule.name === "Speech-to-Text" ||
        getAiModule.name === "DEV-TEXT-TO-SPEECH"
      ) {
        // let fileToChage = v.sequence === 1 ? 2 : 1;

        data.data.push(speech_cofig(file[2]));
      } else {
        if (v.requirement !== null && v.requirement !== undefined) {
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
            let prompt = compliance_config(
              null,
              intent.OrgIntentsConf.script,
              agentDetails.Group.GroupServiceConfigs[0].metricRange
            );

            data.data.push(prompt);
          }
        } else {
          if (getAiModule.name === "Text Analysis") {
            let prompt = await kpiPromt(
              intent,
              transcript,
              agentDetails.Group.GroupServiceConfigs[0].metricRange
            );

            data.data.push(prompt);
          } else if (getAiModule.name === "Sentiment Analysis") {
            data.data.push(sentimental_config(transcript));
          } else if (getAiModule.name === "Compliance") {
            console.log(agentDetails);
            let prompt = compliance_config(
              transcript,
              intent.OrgIntentsConf.script,
              agentDetails.Group.GroupServiceConfigs[0].metricRange
            );

            data.data.push(prompt);
          } else if (getAiModule.name === "Intent Analysis") {
            let createPrompt = await createPromptIntent(
              agentDetails.Group.GroupServiceConfigs[0].Intents
            );
            let forChatGpt = await GroupServiceConfig.findOne({
              where: { organization_id: agentDetails.Group.organization_id },
              order: [["chatgpt_version", "DESC"]],
            });
            let chatgpt = forChatGpt === null ? null : forChatGpt.toJSON();
            let prompt = intent_config(
              transcript,
              createPrompt.explanation,
              createPrompt.intent_prompt,
              null,
              forChatGpt.chatgpt_version
            );
            console.log(prompt);
            data.data.push(prompt);
          } else if (getAiModule.name === "Content Summarizer") {
            let prompt = await notes_propmt_with_config(
              transcript,
              null,
              intent.OrgIntentsConf
            );

            data.data.push(prompt);
          } else if (getAiModule.name === "Pii Filter") {
            let createPrompt = await pii_filter_prompt(transcript_id, agent);
            // let prompt = intent_config(
            //   transcript,
            //   createPrompt.explanation,
            //   createPrompt.intent_prompt
            // );

            if (createPrompt.success) data.data.push(createPrompt);
            else {
              return false;
            }
          }
        }
      }
    }

    let er = new executeRequest();

    await er.start(data, apikey);
    let response = await er.start_call(apikey);

    return { response, type, data };
  } catch (err) {
    console.log(err);
    return { error: true, message: err.message };
  }
};
const notes_propmt_with_config = async (tranascript, callflow, intent) => {
  try {
    let getConfig = intent.OrgNotesConfig;

    if (!getConfig) {
      // get default config
      let getDefaultConfig = await NotesFilterD.findOne({});
      getConfig = changeToJson(getDefaultConfig);
      getConfig["initial_prompt"] = getConfig.default_prompt;
    }

    let prompt = notes_configV2(tranascript, callflow, getConfig);

    return prompt;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const pii_filter_prompt = async (transcript_id, agent) => {
  try {
    let getT = await Transcripts.findOne({
      where: { id: transcript_id },
      include: [
        {
          required: true,
          model: IntentResult,
          // attributes: ["main_intent_id", "sub_intent_id", "id"],
          include: [
            {
              model: IntentDetails,
              // attributes: ["intent_name", "desc", "score"],
              as: "main_intent",
            },
          ],
        },
      ],
      attributes: ["id"],
    });
    let t = changeToJson(getT);
    let findIntent = agent.Group.GroupServiceConfigs[0].Intents.find(
      (x) => x.id === t.IntentResults[0].main_intent.conn
    );

    if (
      findIntent !== undefined &&
      findIntent.OrgIntentsConf.OrgPiifilter !== null &&
      findIntent.OrgIntentsConf.OrgPiifilter.active
    ) {
      let prompt = pii_filter(t.content, findIntent.piifilter.data);
      return prompt;
    } else {
      return {
        success: false,
        data: t,
        config: agent.Group.GroupServiceConfigs[0],
        findIntent,
      };
    }

    // console.log(t.IntentResults[0].main_intent.intent_name);
    // let prompt = Pii_filter_function(tranascript, callflow, getConfig);
    // // console.log(prompt);
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
const array_move = async (arr, old_index, new_index) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};
export const createPromptIntent = async (intents) => {
  let findIndex = intents.findIndex((x) => x.OrgIntentsConf.default === true);

  let changePosition = await array_move(intents, findIndex, 0);

  const intentNames = changePosition
    .map((intent) => intent.OrgIntentsConf.intent)
    .join(",");
  const newPrompt = intent_prompt.replace("[callintent]", intentNames);

  const explanations = " ###Instructions###";
  const instructions = ` Categorize the document using the categories below.
 `;
  //  Class: [${changePosition
  //   .filter((intent) => intent.desc.trim() !== "")
  //   .map((intent, i) => `${intent.intent}`)}]
  // Text:`;
  let intentsExplanations = changePosition
    .filter((intent) => intent.OrgIntentsConf.desc.trim() !== "")
    .map(
      (intent) =>
        `if ${intent.OrgIntentsConf.desc} classify it as ${intent.OrgIntentsConf.intent}`
    )
    .join("\n");
  const response = {
    response: true,
    intent_prompt: newPrompt,
    explanation: explanations + instructions + intentsExplanations,
  };

  return response;
};
export const kpiPromt = async (kpi_array, transcript, metric_range) => {
  let array = [];
  let prompt = kpi_prompt;
  let r = null;
  for (let i = 0; i < kpi_array.OrgIntentsConf.OrgIntentMetrics.length; i++) {
    if (r === null) {
      r = await GroupServiceConfig.findOne({
        where: { organization_id: kpi_array.OrgIntentsConf.organization_id },
        order: [["chatgpt_version", "DESC"]],
        attributes: ["chatgpt_version"],
      });
    }
    const kpi_name = kpi_array.OrgIntentsConf.OrgIntentMetrics[i].call_quality;
    const kpi_explanation =
      kpi_array.OrgIntentsConf.OrgIntentMetrics[i].metric_desc;
    array.push("\n" + "- " + kpi_name + ":if " + kpi_explanation);
  }
  prompt = prompt.replace("[kpi_array]", array.join(""));
  prompt = prompt.replace("[transcript]", `"${transcript}"`);

  prompt = prompt.replace("[metricrange]", metric_range);
  let config = kpi_config(prompt, r);
  return config;
};
