import { Op } from "sequelize";
import {
  changeToJson,
  filterIntents,
  getBase64,
  getConfigurationByTranscriptId,
  isValidDate,
} from "../../../../helper/helpersHere.js";
import { changeSend } from "../../../../helper/toSend.js";
import Agents from "../../../../models/Agents.model.js";
import Compliance from "../../../../models/Compliance.model.js";
import ConfigNotif from "../../../../models/ConfigNotif.model.js";
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
import TranscriptSeperation from "../../../../models/TranscriptSeperation.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import averageTotal from "../../../../models/averageTotal.model.js";
import sentimentLists from "../../../../models/sentimentLists.model.js";
import { Agent } from "../../Agent/Agent.js";
import {
  findTable,
  saveToDatabase,
  updateDataBase,
} from "../../CallAI/helper/Query.js";
import { intent_config } from "../../CallAI/proccess/assets/chatgptconfig.js";
import executeRequest from "../../CallAI/proccess/excuteRequest.js";
import processNewKPI from "../../CallAI/proccess/processNewKPI.js";
import { getGroups } from "../../Group/controller/Group.controller.js";
import { getDetailsofOrgByAccountCode } from "../../CallAI/outsideCall/getDetailsofOrgByAccountCode.js";
import { processingData } from "../../CallAI/helper/ProcessData.js";

export const postCallBack = async (req, res) => {
  try {
    const { result, code } = req.body;

    let getQuery = await Query.findOne({
      where: { code },
      include: [{ model: Queue }],
    });
    console.log(code);
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
    let queueId = jsonChange.Queue.id;
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
            callerid: jsonChange.Queue.callerid,
            call_id: jsonChange.Queue.call_id,
            call_type: jsonChange.Queue.call_type,
          });
          transcript_id = saveTranscript.id;
          console.log(queueId, transcript_id);
          await updateDataBase(
            StoredSpeech,
            { where: { queueId } },
            { transcript_id }
          );
        } else if (v === "Intent" || v === "Sentiment") {
          let data =
            r.result.choices[0].message.tool_calls[0].function.arguments;

          if (v === "Intent") {
            const intent = filterIntents(data);
            let intentId = await getConfigurationByTranscriptId(
              transcript_id,
              intent.main_intent.name
            );

            var saveSubIntentDetails = null;

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

            let kpi = await kpi_process(
              data,
              transcript_id,
              transcript,
              agent,
              queueId
            );

            let saveQuery = await saveToDatabase(Query, {
              type: "Agent,Compliance,Seperation,KPI,Notes",
              status: "Proccessing",
              code: kpi.code,
              setup_id: kpi.id,
              transcript_id: transcript_id,
              queue_id: jsonChange.queue_id,
            });
          } else if (v === "Sentiment") {
            let parseGetSenti = JSON.parse(data);
            parseGetSenti["transcript_id"] = transcript_id;
            parseGetSenti["setup_id"] = r.request_id;
            if (
              parseGetSenti["sentiment_name"].toLowerCase() !== "positive" &&
              parseGetSenti["sentiment_name"].toLowerCase() !== "negative" &&
              parseGetSenti["sentiment_name"].toLowerCase() !== "neutral"
            ) {
              parseGetSenti["sentiment_name"] = "Negative";
            }

            await saveToDatabase(SentimentAnylsis, parseGetSenti);
          } else {
            let parseGetSeperate = JSON.parse(data);
            console.log(parseGetSeperate.data);
            await saveToDatabase(TranscriptSeperation, {
              content: parseGetSeperate.data,
              transcript_id,
            });
          }
        } else {
          let data =
            r.result.text === undefined
              ? r.result.choices[0].message.tool_calls[0].function.arguments
              : r.result.text;
          let d =
            r.result.text !== undefined
              ? "Speech-to-Text"
              : r.result.choices[0].message.tool_calls[0].function.name;
          if (d === "Speech-to-Text") {
            await TranscriptSeperation.update(
              { agent: data },
              { where: { transcript_id } }
            );
          } else if (d === "transcript_seperation") {
            console.log("#####################################");
            console.log(data);
            console.log("#####################################");
            let a = JSON.parse(data);
            let converted = a.data === undefined ? a : a.data;

            TranscriptSeperation.create({ transcript_id, content: converted });

            // if (r.length !== 0 && r !== null) {
            // }
          } else if (d === "text_analysis") {
            console.log("KPI *********************");
            await saveKpi(data, transcript_id, agent);
          } else if (d === "compliance_analysis") {
            console.log("Compliance *********************");
            let getResult = JSON.parse(data);

            await saveToDatabase(Compliance, {
              transcript_id: transcript_id,
              explaination: getResult.explaination,
              score: getResult.score,
            });
            let getConfigNotif = await ConfigNotifF(
              agent.Group.organization_id
            );

            await saveAverageTotal({
              csatScore: getResult.score,
              transcript_id,
              compliance:
                getResult.score <= getConfigNotif.low ||
                getConfigNotif.high <= getResult.score,
              status:
                getResult.score <= getConfigNotif.low ||
                getConfigNotif.high <= getResult.score
                  ? "Done"
                  : "Created",
            });
          } else if (d === "suggestion_compliance_analysis") {
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
export const callbackv2 = async (req, res) => {
  try {
    var transcript;
    var saveTranscript;
    var changePosition;
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
            include: [{ model: Intents, where: { active: true } }],
          },
        },
      ],
    });
    let agent = changeToJson(getAgent);
    // find first queue

    var transcript_id = jsonChange.transcript_id;

    let queueId = jsonChange.Queue.id;
    // change position result
    let findFirst = result.findIndex(
      (v) => v.result && v.result.task && v.result.task === "transcribe"
    );

    // if (findFirst !== 0 && findFirst !== -1) {
    //   changePosition = array_move(result, findFirst, 0);
    // }
    let toTransfer = 0;

    for (let i = 0; i < result.length; i++) {
      let v = result[i];
      if (v.result && v.result.task && v.result.task === "transcribe") {
        changePosition = array_move(result, i, toTransfer);
        toTransfer += 1;
      }
    }

    for (let i = 0; i < result.length; i++) {
      let v = result[i];
      if (v.status.toLowerCase() === "failed") {
        await Queue.update({ status: "Failed" }, { where: { id: queueId } });
        await Query.update({ status: "Failed" }, { where: { code } });
        throw new Error("Failed");
      }
      let d =
        v.result.choices === undefined
          ? "Speech-To-Text"
          : v.result.choices[0].message.tool_calls[0].function.name;

      let data =
        v.result.text === undefined
          ? v.result.choices[0].message.tool_calls[0].function.arguments
          : v.result.text;

      if (d === "Speech-To-Text") {
        if (jsonChange.query == 1) {
          if (transcript_id === null || transcript_id === undefined) {
            transcript = data;
            saveTranscript = await saveToDatabase(Transcripts, {
              content: transcript,
              agent_id: agent.id,
              group_id: jsonChange.Queue.user_group_id,
              queue_date: isValidDate(jsonChange.Queue.queue_date)
                ? jsonChange.Queue.queue_date
                : jsonChange.Queue.createdAt,
              callerid: jsonChange.Queue.callerid,
              call_id: jsonChange.Queue.callerid,
              call_type: jsonChange.Queue.callerid,
            });
            transcript_id = saveTranscript.id;

            await updateDataBase(
              StoredSpeech,
              { where: { queueId } },
              { transcript_id }
            );
          }

          await saveTranscriptSeperation(v.result.segments, transcript_id);
        } else if (jsonChange.query == 2) {
          await saveTranscriptSeperation(v.result.segments, transcript_id);
        }
      } else {
        if (d === "intent_analysis") {
          let r = await saveIntent(
            data,
            agent,
            transcript_id,
            transcript,
            queueId,
            v.request_id,
            jsonChange.Queue.account_code
          );
        } else if (d === "transcript_sentiment") {
          await saveSentiment(data, v.request_id, transcript_id);
        } else if (d === "compliance_analysis") {
          await saveCompliance(data, transcript_id, agent);
        } else if (d === "text_analysis") {
          await saveKpi(data, transcript_id, agent);
        } else if (d === "suggestion_compliance_analysis") {
          let getResult = JSON.parse(data);
          await saveToDatabase(Notes, {
            transcript_id: transcript_id,
            notes: getResult.suggestion,
          });
        }
      }
      if (i === result.length - 1) {
        await Query.update(
          { status: "Done", transcript_id },
          { where: { code } }
        );
        await Queue.update(
          { status: jsonChange.query == 1 ? "2nd" : "Done" },
          { where: { id: jsonChange.queue_id } }
        );
      }
    }

    res.send(changeSend(getQuery));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const kpi_process = async (
  data,
  transcript_id,
  transcript,
  agent,
  queueId,
  account_code
) => {
  const getStored = await findTable(StoredSpeech, { queueId, type: 1 });

  const path = changeToJson(getStored[0]);

  let filebase64 = await getBase64(path.path);

  const intent = filterIntents(data);
  let kpi = new processNewKPI();
  let start = kpi.start(
    transcript_id,
    transcript,
    agent.Group.GroupServiceConfigs[0].Intents,
    intent,
    agent.Group.GroupServiceConfigs[0].metricRange,
    filebase64
  );

  let er = new executeRequest();
  await er.start(
    start,
    "ei-4p2r859yz8LttNCbhwZl5zjmTwmdqGz1bLBIrYOqAdTnlEsA5q"
  );
  let response = await er.start_call(2);
  console.log(response);
  return response;
};
const callForAiProcess = async (
  data,
  transcript_id,
  transcript,
  IntentDetailsData,
  agent,
  queueId,
  account_code
) => {
  try {
    // const getStored = await findTable(StoredSpeech, { queueId, type: 1 });
    // console.log(queueId);
    // const path = changeToJson(getStored[0]);
    // let filebase64 = await getBase64(path.path);
    console.log(account_code);
    let orgDetails = await getDetailsofOrgByAccountCode(account_code, 1);
    const intent = filterIntents(data);
    let processSecondRequests = await processingData(
      null,
      orgDetails.apikey,
      agent,
      orgDetails.service,
      IntentDetailsData,
      transcript,
      transcript_id
    );

    let saveQuery = await saveToDatabase(Query, {
      type: processSecondRequests.type,
      status: "Proccessing",
      code: processSecondRequests.response.code,
      setup_id: processSecondRequests.response.id,
      transcript_id: transcript_id,
      queue_id: queueId,
      query: 2,
    });
    return processSecondRequests;
  } catch (err) {
    console.log(err);
    return false;
  }
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
  // getKPIResult.data.forEach(async (x, i) => {
  let total = 0;
  for (let i = 0; i < getKPIResult.data.length; i++) {
    let x = getKPIResult.data[i];
    let findKpiDetails = kpi_of_mainIntent.data.find((xx) => {
      return xx.call_quality.toLowerCase() === x.kpi.toLowerCase();
    });
    let rw = await saveToDatabase(KpiAnylsis, {
      kpi: x.kpi,
      rating: x.grade,
      anaylsis: x.explain,
      transcript_id: transcript_id,
      getWeight: findKpiDetails.cust_sat_weight,
      setup_id: 1,
      metricsRange: agent.Group.GroupServiceConfigs[0].metricRange,
    });
    total +=
      parseFloat(findKpiDetails.cust_sat_weight) * 0.01 * parseFloat(x.grade);
  }
  let getConfigNotif = await ConfigNotifF(agent.Group.organization_id);

  await saveAverageTotal({
    csatScore: total,
    transcript_id,
    csat: total <= getConfigNotif.low || total >= getConfigNotif.low,
    status:
      total <= getConfigNotif.low || total >= getConfigNotif.score
        ? "Done"
        : "Created",
  });
};
const ConfigNotifF = async (organization_id) => {
  console.log(organization_id);
  try {
    let getConfigNotif = await ConfigNotif.findOne({
      where: { organization_id: organization_id },
    });
    if (getConfigNotif !== undefined && getConfigNotif !== null) {
      console.log(getConfigNotif);
      return changeToJson(getConfigNotif);
    } else {
      return { low: 70, high: 90 };
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const saveAverageTotal = async (data) => {
  const f = await averageTotal.findOne({
    where: { transcript_id: data.transcript_id },
  });
  if (f === null) {
    await averageTotal.create(data);
  } else
    await averageTotal.update(data, {
      where: { transcript_id: data.transcript_id },
    });
  return true;
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
const saveIntent = async (
  data,
  agent,
  transcript_id,
  transcript,
  queueId,
  request_id,
  account_code
) => {
  try {
    const intent = filterIntents(data);
    let IntentDetailsData = agent.Group.GroupServiceConfigs[0].Intents.find(
      (x) => x.intent === intent.main_intent.name
    );
    // check if main intent have real intent in the database
    if (IntentDetailsData === undefined) {
      IntentDetailsData = agent.Group.GroupServiceConfigs[0].Intents.find(
        (x) => x.default === true
      );
    }

    const saveSubIntentDetails = null;

    const saveMainIntentDetails = await saveToDatabase(IntentDetails, {
      intent_name: intent.main_intent.name,
      score: intent.main_intent.score,
      desc: intent.main_intent.explanation,
      conn: IntentDetailsData.id,
    });

    if (intent.sub_intents.length !== 0) {
      // first find if sub intent is find
      let SubIntentDetails = agent.Group.GroupServiceConfigs[0].Intents.find(
        (x) => x.intent === intent.sub_intents.name
      );
      if (SubIntentDetails !== undefined) {
        saveSubIntentDetails = await saveToDatabase(IntentDetails, {
          intent_name: intent.sub_intents[0].name,
          score: intent.sub_intents[0].score,
          desc: intent.sub_intents[0].explanation,
          conn: intentId,
        });
      }
    }
    await saveToDatabase(IntentResult, {
      sub_intent_id:
        saveSubIntentDetails === null
          ? saveSubIntentDetails
          : saveSubIntentDetails.id,
      main_intent_id: saveMainIntentDetails.id,
      transcript_id,
      setup_id: request_id,
    });

    let kpi = await callForAiProcess(
      data,
      transcript_id,
      transcript,
      IntentDetailsData,
      agent,
      queueId,
      account_code
    );
    return kpi;
    // let saveQuery = await saveToDatabase(Query, {
    //   type: "Agent,Compliance,Seperation,KPI,Notes",
    //   status: "Proccessing",
    //   code: kpi.code,
    //   setup_id: kpi.id,
    //   transcript_id: transcript_id,
    //   queue_id: jsonChange.queue_id,
    // });
  } catch (err) {
    console.log(err);
    return false;
  }
};
const saveSentiment = async (data, request_id, transcript_id) => {
  try {
    let parseGetSenti = JSON.parse(data);
    parseGetSenti["transcript_id"] = transcript_id;
    parseGetSenti["setup_id"] = request_id;
    parseGetSenti["sentiment_name"] =
      parseGetSenti["sentiment_name"].toLowerCase();
    if (parseGetSenti["sentiment_name"] === undefined) {
      parseGetSenti["sentiment_name"] = "neutral";
    } else if (
      parseGetSenti["sentiment_name"].toLowerCase() !== "positive" &&
      parseGetSenti["sentiment_name"].toLowerCase() !== "negative" &&
      parseGetSenti["sentiment_name"].toLowerCase() !== "neutral"
    ) {
      // find sentinement
      let findSentiment = await sentimentLists.findOne({
        where: { list: { [Op.like]: `%${parseGetSenti["sentiment_name"]}%` } },
      });

      if (findSentiment !== null) {
        let changeToJsonS = changeToJson(findSentiment);
        parseGetSenti["sentiment_name"] = changeToJsonS.type;
      } else {
        parseGetSenti["sentiment_name"] = "neutral";
      }
    }

    await saveToDatabase(SentimentAnylsis, parseGetSenti);
  } catch (err) {
    console.log(err);
    return false;
  }
};
const saveTranscriptSeperation = async (data, transcript_id, transcript) => {
  try {
    let findTranscript = await TranscriptSeperation.findOne({
      where: { transcript_id },
    });
    let findTranscript2 = await TranscriptSeperation.findOne({
      where: { transcript_id },
    });

    if (findTranscript === null) {
      await saveToDatabase(TranscriptSeperation, {
        combineSegment: data,
        transcript_id,
      });
    } else {
      let cTranscript = changeToJson(findTranscript);
      let getCombine = cTranscript.combineSegment;

      let agent = [];
      data.forEach((v, i) => {
        let startMinus = i === 0 ? v.start : v.start - 1;
        let startPlus = i === 0 ? v.start : v.start + 1;
        let endMinus = i === 0 ? v.end : v.end - 2;
        let endPlus = i === 0 ? v.end : v.end + 2;

        let overTalk = 0;
        let a = getCombine.find((x) => {
          if (x.start >= startMinus && x.start <= startPlus) {
            if (x.end >= endMinus && x.end <= endPlus) return x;
          }
        });
        if (a !== undefined) {
          let temp = { start: a.start, end: a.end, text: a.text, id: a.id };
          agent.push(temp);
        }

        // getCombine.forEach((x) => {
        //   let temp = { start: x.start, end: x.end, text: x.text, id: x.id };
        //   if (x.start >= startMinus && x.start >= startPlus) {
        //     console.log(x.start);
        //     // if (x.text === " Yes, it's Yvonne.") {
        //     //   console.log(x);
        //     //   console.log(v.start, x.start);
        //     //   console.log(v.end, x.end);
        //     //   console.log(v);
        //     // }
        //     let check = contain(x.text, v.text);

        //     if (check) {
        //       let check = agent.find((w) => w.id === temp.id);
        //       if (!check) agent.push(temp);
        //     }
        //   } else {
        //     if (
        //       (x.start <= v.start ||
        //         x.start <= startMinus ||
        //         x.start <= startPlus) &&
        //       (x.end >= v.end || x.end >= v.endMinus || x.end >= v.endPlus)
        //     ) {
        //       if (x.end - 2 >= v.end && x.start === v.start) {
        //         temp = { start: v.start, end: v.end, text: v.text, id: null };
        //         agent.push(temp);
        //       } else if (x.end <= v.end + 2) {
        //         // console.log("END");
        //         // console.log(x.text, "|", v.text);
        //         // console.log(x.end, "|", v.end);
        //         // console.log("END");
        //         let check = contain(x.text, v.text);

        //         if (check) {
        //           let a = agent.find((vv) => vv.text === x.text);

        //           if (a === undefined) agent.push(temp);
        //           // else
        //         }
        //       }
        //     }
        //   }
        // });
      });

      let costumer = getCombine
        .map((x) => {
          let b = agent.find((xx) => xx.id === x.id);
          if (b === undefined) {
            return { start: x.start, end: x.end, text: x.text, id: x.id };
          } else return false;
        })
        .filter((x) => x);
      await TranscriptSeperation.update(
        {
          agentSegment: agent,
          costumerSegment: costumer,
        },
        { where: { transcript_id } }
      );
      return { costumer, agent };
    }
  } catch (err) {
    console.log(err);
    throw false;
  }
};
const saveCompliance = async (data, transcript_id, agent) => {
  console.log("Compliance *********************");
  let getResult = JSON.parse(data);

  await saveToDatabase(Compliance, {
    transcript_id: transcript_id,
    explaination: getResult.explaination,
    score: getResult.score,
  });
  let getConfigNotif = await ConfigNotifF(agent.Group.organization_id);

  await saveAverageTotal({
    csatScore: getResult.score,
    transcript_id,
    compliance:
      getResult.score <= getConfigNotif.low ||
      getConfigNotif.high <= getResult.score,
    status:
      getResult.score <= getConfigNotif.low ||
      getConfigNotif.high <= getResult.score
        ? "Done"
        : "Created",
  });
};
const contain = async (agent, combine) => {
  const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  let cSplit = combine.trim().split(" ");

  let countTrue = 0;

  cSplit.forEach((v) => {
    const agentClean = agent.replace(regex, "");
    const combineClean = v.replace(regex, "");
    let a = agentClean.toLowerCase().includes(combineClean.toLowerCase());
    countTrue += a ? 1 : 0;
  });
  let getPercent = countTrue / cSplit.length;

  if (getPercent >= 0.7) return true;
  else return false;
  // if ((a) => 3) return true;
};
