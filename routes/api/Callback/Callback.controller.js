import {
  changeToJson,
  filterIntents,
  getConfigurationByTranscriptId,
  isValidDate,
} from "../../../../helper/helpersHere.js";
import { changeSend } from "../../../../helper/toSend.js";
import Agents from "../../../../models/Agents.model.js";
import Compliance from "../../../../models/Compliance.model.js";
import GroupServiceConfig from "../../../../models/GroupServiceConfig.model.js";
import Groups from "../../../../models/Groups.model.js";
import IntentDetails from "../../../../models/IntentDetails.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import Intents from "../../../../models/Intents.model.js";
import KpiAnylsis from "../../../../models/KpiAnylsis.model.js";
import Notes from "../../../../models/Notes.model.js";
import Query from "../../../../models/Query.model.js";
import Queue from "../../../../models/Queue.model.js";
import SentimentAnylsis from "../../../../models/SentimentAnylsis.model.js";
import StoredSpeech from "../../../../models/StoredSpeech.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import { saveToDatabase } from "../../CallAI/helper/Query.js";
import { intent_config } from "../../CallAI/proccess/assets/chatgptconfig.js";
import executeRequest from "../../CallAI/proccess/excuteRequest.js";
import processNewKPI from "../../CallAI/proccess/processNewKPI.js";
import { getGroups } from "../../Group/controller/Group.controller.js";

export const postCallBack = async (req, res) => {
  try {
    console.log("Callback Running");

    const { result, code } = req.body;

    let getQuery = await Query.findOne({
      where: { code },
      include: [{ model: Queue }],
    });

    if (getQuery === null) throw new Error("Somethin went wrong 9989");
    let jsonChange = changeToJson(getQuery);
    let getAgent = await Agents.findOne({
      where: { user_id: jsonChange.Queue.user_id },
      include: [
        {
          model: Groups,
          include: {
            model: GroupServiceConfig,
            include: [{ model: Intents }],
          },
        },
      ],
    });
    let agent = changeToJson(getAgent);
    var transcript_id = jsonChange.transcript_id;
    var transcript;
    let queries = jsonChange.type.split(",");
    // let data =
    //   result[1].result.choices[0].message.tool_calls[0].function.arguments;
    // let kpi = await kpi_process(
    //   data,
    //   transcript_id,
    //   result[0].result.text,
    //   agent
    // );
    // let saveQuery = await saveToDatabase(Query, {
    //   type: "KPI,Compliance",
    //   status: "Proccessing",
    //   code: kpi.code,
    //   setup_id: kpi.id,
    //   transcript_id: transcript_id,
    //   queue_id: jsonChange.queue_id,
    // });
    // res.send(changeSend(kpi));

    for (let i = 0; i < queries.length; i++) {
      let v = queries[i];
      if (v !== "") {
        let r = result[i];
        if (r.status === "Failed" || r.status === 3) {
          let getQuery = await Query.update(
            { status: "Failed" },
            {
              where: { code },
            }
          );
          console.log(getQuery, "Failed");
          res.send(changeSend({ jsonChange }));
          return;
        }

        if (v === "Transcript") {
          transcript = r.result.text;
          let saveTranscript = await saveToDatabase(Transcripts, {
            content: transcript,
            agent_id: agent.id,
            group_id: jsonChange.Queue.user_group_id,
            queue_date: isValidDate(jsonChange.Queue.queue_date)
              ? jsonChange.Queue.queue_date
              : jsonChange.Queue.createdAt,
          });
          transcript_id = saveTranscript.id;
          await saveToDatabase(StoredSpeech, {
            path: jsonChange.Queue.filepath,
            transcript_id,
          });
        } else if (v === "Intent" || v === "Sentiment") {
          let data =
            r.result.choices[0].message.tool_calls[0].function.arguments;
          if (v === "Intent") {
            const intent = filterIntents(data);
            let intentId = await getConfigurationByTranscriptId(
              transcript_id,
              intent.main_intent.name
            );

            const saveSubIntentDetails = null;
            console.log(intentId);
            const saveMainIntentDetails = await saveToDatabase(IntentDetails, {
              intent_name: intent.main_intent.name,
              score: intent.main_intent.score,
              desc: intent.main_intent.explanation,
              conn: intentId,
            });
            if (intent.sub_intents.length !== 0) {
              saveSubIntentDetails = await saveToDatabase(IntentDetails, {
                intent_name: intent.sub_intents[0].name,
                score: intent.sub_intents[0].score,
                desc: intent.sub_intents[0].explanation,
                conn: intentId,
              });
            }
            await saveToDatabase(IntentResult, {
              sub_intent_id:
                saveSubIntentDetails === null
                  ? saveSubIntentDetails
                  : saveSubIntentDetails.id,
              main_intent_id: saveMainIntentDetails.id,
              transcript_id,
              setup_id: r.request_id,
            });

            let kpi = await kpi_process(data, transcript_id, transcript, agent);
            let saveQuery = await saveToDatabase(Query, {
              type: "KPI,Compliance,Notes",
              status: "Proccessing",
              code: kpi.code,
              setup_id: kpi.id,
              transcript_id: transcript_id,
              queue_id: jsonChange.queue_id,
            });
          } else {
            let parseGetSenti = JSON.parse(data);
            parseGetSenti["transcript_id"] = transcript_id;
            parseGetSenti["setup_id"] = r.request_id;
            if (
              (parseGetSenti["sentiment_name"].toLowerCase() !== "positive" &&
                parseGetSenti["sentiment_name"].toLowerCase() !== "negative") ||
              parseGetSenti["sentiment_name"].toLowerCase() !== "neutral"
            ) {
              parseGetSenti["sentiment_name"] = "Neutral";
            }
            await saveToDatabase(SentimentAnylsis, parseGetSenti);
          }
        } else {
          let data =
            r.result.choices[0].message.tool_calls[0].function.arguments;

          if (v === "KPI") {
            console.log("KPI *********************");
            await saveKpi(data, transcript_id, agent);
          } else if (v === "Compliance") {
            console.log("Compliance *********************");
            let getResult = JSON.parse(data);
            await saveToDatabase(Notes, {
              transcript_id: transcript_id,
              notes: getResult.suggestion,
            });
            await saveToDatabase(Compliance, {
              transcript_id: transcript_id,
              explaination: getResult.explaination,
              score: getResult.score,
            });
          } else if (v === "Notes") {
            let getResult = JSON.parse(data);
            await saveToDatabase(Notes, {
              transcript_id: transcript_id,
              notes: getResult.suggestion,
            });
          }
        }
      }
    }
    await Query.update({ status: "Done", transcript_id }, { where: { code } });
    await Queue.update(
      { status: "Done" },
      { where: { id: jsonChange.queue_id } }
    );
    res.send(changeSend({ jsonChange }));
    console.log("Callback Done");
  } catch (err) {
    console.log(err);
    res.send({ result: "error", message: "no code found" });
  }
};
export const getCallBack = async (req, res) => {
  try {
    console.log("Callback Running get");
    console.log(req.query);
    console.log(req.params);
    console.log("Callback Running get");
    res.send({ result: "success", message: "connected" });
  } catch (err) {
    throw err;
  }
};
const kpi_process = async (data, transcript_id, transcript, agent) => {
  const intent = filterIntents(data);
  let kpi = new processNewKPI();
  let start = kpi.start(
    transcript_id,
    transcript,
    agent.Group.GroupServiceConfigs[0].Intents,
    intent,
    agent.Group.GroupServiceConfigs[0].metricRange
  );
  let er = new executeRequest();
  await er.start(start, null);
  let response = await er.start_call(2);
  console.log(response);
  return response;
};
const saveKpi = async (data, transcript_id, agent) => {
  let getKPIResult = JSON.parse(data);
  console.log(getKPIResult);
  let getMainIntent = await IntentResult.findOne({
    where: { transcript_id },
    include: [{ model: IntentDetails, as: "main_intent" }],
  });

  let main_intent = changeToJson(getMainIntent).main_intent.intent_name;
  let kpi_of_mainIntent = agent.Group.GroupServiceConfigs[0].Intents.find(
    (x) => x.intent === main_intent
  );
  // let totalCSAT = 0;
  getKPIResult.data.forEach(async (x, i) => {
    let findKpiDetails = kpi_of_mainIntent.data.find((xx) => {
      return xx.call_quality.toLowerCase() === x.kpi.toLowerCase();
    });
    // let getKPIResult = computePerKpi({
    //   kpi: x.kpi,
    //   rating: x.grade,
    //   anaylsis: x.explain,
    //   transcript_id: transcript_id,
    //   getWeight: findKpiDetails.cust_sat_weight,
    //   setup_id: 1,
    //   metricsRange: agent.Group.GroupServiceConfigs[0].metricRange,
    // });
    // if (i === 0) totalCSAT += getKPIResult.weightConverted;
    // else totalCSAT = totalCSAT + getKPIResult.weightConverted / 2;
    let rw = await saveToDatabase(KpiAnylsis, {
      kpi: x.kpi,
      rating: x.grade,
      anaylsis: x.explain,
      transcript_id: transcript_id,
      getWeight: findKpiDetails.cust_sat_weight,
      setup_id: 1,
      metricsRange: agent.Group.GroupServiceConfigs[0].metricRange,
    });
    // console.log(totalCSAT);
  });
};
