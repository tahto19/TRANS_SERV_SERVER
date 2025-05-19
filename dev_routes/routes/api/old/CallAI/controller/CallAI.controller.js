import axios from "axios";
import { computeForKpi } from "../../../../helper/Compute.js";
import {
  changeToJson,
  shortSaveToDatabase,
  uploadDestination,
  uploadQueueFile,
} from "../../../../helper/helpersHere.js";
import { changeSend, tojson } from "../../../../helper/toSend.js";
import Agents from "../../../../models/Agents.model.js";
import IntentDetails from "../../../../models/IntentDetails.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import KpiAnylsis from "../../../../models/KpiAnylsis.model.js";
import SentimentAnylsis from "../../../../models/SentimentAnylsis.model.js";
import StoredSpeech from "../../../../models/StoredSpeech.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";
// import NewIntentProcess from "../proccess/newIntentProcess.js";
import { proccessIntent } from "../proccess/proccess.js";
import { processSpeechToText } from "../proccess/processSpeechToText.js";
import { Group } from "../../Group/Group.js";
import Groups from "../../../../models/Groups.model.js";
import { Op, Sequelize } from "sequelize";
import { findAgent, saveToDatabase, updateDataBase } from "../helper/Query.js";
import Query from "../../../../models/Query.model.js";
import Queue from "../../../../models/Queue.model.js";
import getOrg from "../outsideCall/getDetailsofOrg.js";
import processNew from "../proccess/processNew.js";
import GroupServiceConfig from "../../../../models/GroupServiceConfig.model.js";
import Intents from "../../../../models/Intents.model.js";
import executeRequest from "../proccess/excuteRequest.js";

import * as mm from "music-metadata";
import fs from "fs";
import { getDetailsofOrgByAccountCode } from "../outsideCall/getDetailsofOrgByAccountCode.js";
import { processingData } from "../helper/ProcessData.js";
import processSameQueueId from "../proccess/processSameQueueId.js";

export const intentAnylsis = async (req, res) => {
  try {
    const { transcript, id } = req.body;

    const processIntent = new proccessIntent();
    let response = await processIntent.process(transcript, id);

    res.send(changeSend(response));
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getIntentAnylsis = async (req, res) => {
  try {
    const { id } = req.query;
    const r = await Transcripts.findOne({
      where: { id },
      include: [
        {
          require: false,
          model: IntentResult,
          attributes: ["main_intent_id", "sub_intent_id", "id"],
          include: [
            {
              require: false,
              model: IntentDetails,
              attributes: ["intent_name", "desc", "score"],
              as: "main_intent",
            },
          ],
        },
        {
          require: false,
          model: KpiAnylsis,
          attributes: ["anaylsis", "kpi", "rating", "getWeight"],
        },
        {
          require: false,
          model: SentimentAnylsis,
          attributes: ["sentiment_score", "explanation", "sentiment_name"],
        },
      ],
    });

    let change = tojson(r);

    let ckpi = new computeForKpi();
    await ckpi.start(change.KpiAnylses);
    let computeInfo = ckpi.details();
    change["ComputeKpiAnylsis"] = computeInfo;
    res.send(changeSend(change));
    // res.send(change);
  } catch (err) {
    console.log(err);
    res.send({ result: "error", message: err });
  }
};
export const getIntentByuserOrByGroup = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(req.url);
    let queryFind = req.url.includes("getByUser")
      ? { group_id: id }
      : { agent_id: id };
    const r = await Transcripts.findAll({
      where: queryFind,
      include: [
        {
          require: false,
          model: IntentResult,
          attributes: ["main_intent_id", "sub_intent_id", "id"],
          include: [
            {
              require: false,
              model: IntentDetails,
              attributes: ["intent_name", "desc", "score"],
              as: "main_intent",
            },
          ],
        },
        {
          require: false,
          model: KpiAnylsis,
          attributes: ["anaylsis", "kpi", "rating", "getWeight"],
        },
        {
          require: false,
          model: SentimentAnylsis,
          attributes: ["sentiment_score", "explanation", "sentiment_name"],
        },
      ],
    });
    let getAllPercent = 0;
    let total = 0;
    let totalEach = 0;
    let dataToReturn = [];
    r.forEach((x) => {
      let data = tojson(x);

      let ckpi = new computeForKpi();
      ckpi.start(data.KpiAnylses);
      let computeInfo = ckpi.details();
      data["ComputeKpiAnylsis"] = computeInfo;
      let getTotalRating = ckpi.totalRating();
      computeInfo.forEach((xx) => {
        if (!isNaN(xx.weightConverted)) {
          getAllPercent += xx.percent;
          totalEach += 1;
        }
      });
      dataToReturn.push(data);
    });
    total = getAllPercent / totalEach;
    res.send(changeSend({ data: dataToReturn, kpiTotal: total }));
  } catch (err) {
    throw err;
  }
};
export const speechTotext = async (req, res) => {
  try {
    const files = req.parts();
    const { id } = req.query;
    let chatGPTSpeechDetails = [];
    let storeFile = await uploadDestination("audio", files);
    let process = new processSpeechToText();
    var audio = [];
    var transcript_id;
    for (let i = 0; i < storeFile.length; i++) {
      console.log(i);
      let v = storeFile[i];
      console.log(v);

      let process = new processSpeechToText();
      await process.process(v.replace("file:///", ""));
      await process.getPromptAndeChangeToBase64();
      let getChatGPTDetails = await process.executeRequest();
      chatGPTSpeechDetails.push(getChatGPTDetails);
    }
    if (chatGPTSpeechDetails.length === 1) {
      let pI = new proccessIntent();
      let response = await pI.process(chatGPTSpeechDetails[0].details, id);
      transcript_id = response.id;
      let data = shortSaveToDatabase(StoredSpeech, {
        transcript_id,
        path: storeFile[0].replace("file:///", ""),
      });
      audio.push(data);
    }
    res.send(changeSend({ transcript_id, audio }));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const newIntentAnylsis = async (req, res) => {
  try {
    const { transcript, id } = req.body;
    let agentInfo = await Agents.findOne({
      where: { id },
      include: [{ model: Groups, attributes: [] }],
      attributes: [[Sequelize.col("Group.organization_id"), "organization_id"]],
    });
    let agentInfoJson = changeToJson(agentInfo);
    let getAccess = await axios.get(
      "https://ai-insight.etpbx.com/general-info/organization/complete-details/" +
        agentInfoJson.organization_id
    );

    if (!getAccess.data.response) throw new Error(getAccess.data.error);
    let getAcc = getAccess.data.details;
    // let process = new NewIntentProcess();
    // let start = await process.start(transcript, id, getAcc);
    res.send(changeSend(start));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const speechTotextFromListener = async (req, res) => {
  try {
    const {
      user_id,
      queue_id,
      file,
      group_id,
      client_id,
      createdAt,
      account_code,
      callerid,
      call_id,
      call_type,
    } = req.body;
    console.log("#########################");
    console.log(account_code);
    console.log("#########################");
    // let getPath = await uploadQueueFile("audio", file);
    // let path_ = await new URL("../../../../upload/" + getPagetPathth, import.meta.url);

    // const a = await mm.parseFile(converted);

    // if (!a) {
    //   fs.unlink(path);
    //   throw new Error("Something went wrong");
    // } else if (a.format.duration <= 15) {
    //   fs.unlink(path);
    //   console.log("error");
    //   throw new Error("10 Seconds only");
    // }

    let getQuery = await Queue.findAll({
      where: { queue_id },
    });
    if (getQuery.length > 0) throw new Error("9991");
    if (user_id !== "") {
      let agent = await findAgent(user_id, {
        model: Groups,

        include: {
          model: GroupServiceConfig,
          include: [
            {
              model: Intents,
              attributes: ["intent", "desc", "data", "script"],
              where: { active: true },
            },
          ],
        },
      });

      var queueId;

      const path = [];
      var duration = 0;
      try {
        for (let i = 0; i < file.length; i++) {
          let f = file[i];
          let getPath = await uploadQueueFile("audio", f);

          let path_ = await new URL(
            "../../../../upload/" + getPath,
            import.meta.url
          );
          let converted = path_.href.replace("file:///", "");

          const a = await mm.parseFile("/" + converted);

          if (!a) {
            console.log("data is not correct");

            return res.code(401).send({ error: true, queueId });
          } else if (a.format.duration <= 15) {
            fs.unlink("/" + converted, (e, d) => {
              console.log(e);
            });
            queueId = await saveToDatabase(Queue, {
              user_id,
              queue_id,
              user_group_id: group_id,
              queue_date: createdAt,
              account_code,
              status: "10 seconds mp3",
              callerid,
              call_id,
              call_type,
            });
            throw new Error("10 Seconds only");
          }
          duration = a.format.duration;
          path.push(getPath);
        }
      } catch (err) {
        console.log(err);
        path.forEach(async (path__) => {
          // console.log(path__);
          let path_ = await new URL(
            "../../../../upload/" + path__,
            import.meta.url
          );
          let converted = path_.href.replace("file:///", "");

          fs.unlink("/" + converted, (e, d) => {
            console.log(e);
          });
        });
        throw new Error(err.message);
      }
      queueId = await saveToDatabase(Queue, {
        user_id,
        queue_id,
        user_group_id: group_id,
        queue_date: createdAt,
        account_code,
        callerid,
        call_id,
        call_type,
      });
      let q_id = changeToJson(queueId);

      path.forEach(async (v, i) => {
        await StoredSpeech.create({
          queueId: q_id.id,
          path: v,
          type: i,
          duration,
        });
      });
      console.log(user_id, group_id);
      let agentInfo = await Agents.findOne({
        where: { user_id, agent_group_id: group_id },
        include: [{ required: true, model: Groups, attributes: [] }],
        attributes: [
          [Sequelize.col("Group.organization_id"), "organization_id"],
        ],
      });

      if (agentInfo !== null) {
        let agentChangeToJSon = changeToJson(agentInfo);
        console.log(agentChangeToJSon);
        // **************************************//
        let org = new getOrg();
        await org.start("0082006");
        let apikey = org.getApiByCallback(
          "http://localhost:4118/gateway/mock/callback"
        );
        let getAccess = await org.getAccess();
        let getOrgDetails = await org.getOrgDetails();
        let getOrgServices = await org.getOrgServices();

        let getOrgServiceBundles = await org.getOrgServiceBundles();

        // **************************************//
        let p = new processNew();

        await p.start(file[2], apikey, agent);
        let speechToText = p.speechToText();
        let getIntent = p.getIntent();
        let getSentiment = p.getSentiment();

        let getPrompt = p.getGeneratedPrompt();
        res.send(changeSend(getPrompt));
        let er = new executeRequest();
        await er.start(getPrompt, apikey);
        let response = await er.start_call();

        let saveQuery = await saveToDatabase(Query, {
          type: "Transcript,Intent,Sentiment",
          status: "Proccessing",
          code: response.code,
          setup_id: 1,
          transcript_id: null,
          queue_id: queueId.id,
        });
        let a = await updateDataBase(
          Queue,
          {
            where: { queue_id },
          },
          { status: "Processed" }
        );

        res.send(changeSend({ queue: a, saveQuery, response }));
      } else {
        console.log("no user id found " + user_id);
        throw new Error("no User Id FOund");
      }
    }
  } catch (err) {
    console.log(err);

    res.send({ result: "error", message: err.message });
  }
};
const sequencecalling = [2, 0, 1, 5];
export const fromListener = async (req, res) => {
  try {
    const {
      user_id,
      queue_id,
      file,
      group_id,
      client_id,
      createdAt,
      account_code,
      callerid,
      call_id,
      call_type,
      number_dialled,
    } = req.body;

    // res.send(changeSend(orgDetails));
    let check = await Queue.findOne({
      where: {
        queue_id,
        user_id,
        user_group_id: group_id === "" ? 2 : group_id,
      },
    });
    if (check !== null) {
      console.log("Already saved");
      throw new Error("Already saved");
    }
    var duration = 0;
    if (user_id === "" || user_id === undefined) {
      await saveToDatabase(Queue, {
        number_dialled,
        user_id: user_id ? user_id : null,
        queue_id,
        user_group_id: group_id === "" ? 2 : group_id,
        queue_date: createdAt,
        account_code,
        status: "No userID Recieved",
        callerid,
        call_id,
        call_type,
      });
      throw new Error("Something went wrong... No Userid received");
    }
    // check if account_code Exists

    // res.send(changeSend(orgDetails));
    // return;
    // check if user and its group exists
    let agent = await Agents.findOne({
      where: {
        user_id,
        agent_group_id: group_id === "" ? 2 : group_id,
        active: true,
      },
      include: {
        model: Groups,
        include: {
          model: GroupServiceConfig,
          include: [
            {
              model: Intents,
              attributes: ["intent", "desc", "data", "script"],
              where: { active: true },
            },
          ],
        },
      },
    });

    if (agent === null) {
      console.log(user_id);
      await saveToDatabase(Queue, {
        number_dialled,
        user_id: user_id ? user_id : null,
        queue_id,
        user_group_id: group_id === "" ? 2 : group_id,
        queue_date: createdAt,
        account_code,
        status: "No Agent Found",
        callerid,
        call_id,
        call_type,
      });

      throw new Error("No Agent Found");
    }
    var agentChangeToJSon = changeToJson(agent);
    // check query is already done
    let getQuery = await Queue.findAll({ where: { queue_id } });
    if (getQuery.length > 0) {
      let getIfExists = await Queue.findOne({ where: { queue_id, user_id } });
      if (getIfExists === null) {
        let a = await processSameQueueId(
          queue_id,
          user_id,
          group_id === "" ? 2 : group_id
        );

        let saveQuery = await saveToDatabase(Queue, {
          number_dialled,
          user_id,
          queue_id,
          user_group_id: group_id === "" ? 2 : group_id,
          queue_date: createdAt,
          account_code,
          status: a === "processing" ? "Processing" : a ? "Done" : "Error",
          callerid,
          call_id,
          call_type,
        });
        res.send(changeSend(saveQuery));
      } else {
        // check what kind of query
        // add mo dito ang bagong code mo
        throw new Error("Exists");
      }
    } else {
      let orgDetails = await getDetailsofOrgByAccountCode(
        account_code,
        sequencecalling[0]
      );

      if (orgDetails.error !== undefined) {
        await saveToDatabase(Queue, {
          number_dialled,
          user_id,
          queue_id,
          user_group_id: group_id === "" ? 2 : group_id,
          queue_date: createdAt,
          account_code,
          status: orgDetails.error,
          callerid,
          call_id,
          call_type,
        });
        throw new Error("No API key Found");
      }
      // save file
      const path = [];

      if (file === undefined) throw new Error("No File Found");
      try {
        for (let i = 0; i < file.length; i++) {
          let f = file[i];
          let getPath = await uploadQueueFile("audio", f);

          let path_ = await new URL(
            "../../../../upload/" + getPath,
            import.meta.url
          );
          let converted = path_.href.replace("file:///", "");
          // "/" +  add this below
          const a = await mm.parseFile("/" + converted);

          if (!a) {
            return res.code(401).send({ error: true, queueId });
          } else if (a.format.duration <= 15) {
            // "/" +  add this below
            fs.unlink("/" + converted, (e, d) => {
              console.log(e);
            });
            queueId = await saveToDatabase(Queue, {
              number_dialled,
              user_id,
              queue_id,
              user_group_id: group_id === "" ? 2 : group_id,
              queue_date: createdAt,
              account_code,
              status: "10 seconds mp3",
              callerid,
              call_id,
              call_type,
            });
            throw new Error("10 Seconds only");
          }
          duration = a.format.duration;
          path.push(getPath);
        }
      } catch (err) {
        console.log(err);
        path.forEach(async (path__) => {
          // console.log(path__);
          let path_ = await new URL(
            "../../../../upload/" + path__,
            import.meta.url
          );
          let converted = path_.href.replace("file:///", "");

          fs.unlink("/" + converted, (e, d) => {
            console.log(e);
          });
        });
        throw new Error(err.message);
      }
      // if all is correct save the queue as normal
      var queueId = await saveToDatabase(Queue, {
        number_dialled,
        user_id,
        queue_id,
        user_group_id: group_id === "" ? 2 : group_id,
        queue_date: createdAt,
        account_code,
        callerid,
        call_id,
        call_type,
        status: "Created",
      });
      let q_id = changeToJson(queueId);
      path.forEach(async (v, i) => {
        await StoredSpeech.create({
          queueId: q_id.id,
          path: v,
          type: i,
          duration,
        });
      });

      let processFirstRequests = await processingData(
        file,
        orgDetails.apikey,
        agent,
        orgDetails.service
      );

      let saveQuery = await saveToDatabase(Query, {
        type: processFirstRequests.type,
        status: "Proccessing",
        code: processFirstRequests.response.code,
        setup_id: processFirstRequests.response.id,
        transcript_id: null,
        queue_id: queueId.id,
      });
      let a = await updateDataBase(
        Queue,
        {
          where: { queue_id },
        },
        { status: "Proccessing" }
      );
      res.send(changeSend({ processFirstRequests, saveQuery, a }));
    }
  } catch (err) {
    // console.log(err);
    res.send({ result: "error", message: err.message });
  }
};
