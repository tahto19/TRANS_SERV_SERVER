import axios from "axios";
import { getConfigurationByTranscriptId } from "../../../../helper/helpersHere.js";
import { changeSend } from "../../../../helper/toSend.js";
import { WhereFilters } from "../../../../helper/utils.js";
import Query from "../../../../models/Query.model.js";
import Queue from "../../../../models/Queue.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import {
  runQueryChecker,
  statusChecker,
} from "../helperFunction/helperFunctionsForListener.js";

export const getListener = async (req, res) => {
  try {
    let getTranscriptLatest = await Queue.findAll({
      limit: 50,
      attributes: ["queue_id", "id"],
      order: [["id", "DESC"]],
    });
    res.send(changeSend(getTranscriptLatest));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const testListener = async (req, res) => {
  const { id } = req.body;
  let a = await getConfigurationByTranscriptId(id);
  console.log(a);
  res.send(changeSend(a));
};
export const getProcess = async (req, res) => {
  let getProcessData = await Query.findAll({
    where: {
      limit: 1,
      status: "Proccessing",
    },
  });
  res.send(changeSend(getProcessData));
  console.log(getProcessData);
};
export const reprocessErrorStatus = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body || !req.body.filters) throw new Error("No Filters");
    let r = await reprocessErrorStatus_function(req.body.filters);
    res.send(r);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const reprocessErrorStatus_function = async (filters) => {
  let a = await Queue.findAll({
    where: WhereFilters(filters),
    limit: 1,
    order: [["createdAt", "DESC"]],
  });

  for (let i = 0; i < a.length; i++) {
    let val = a[i].toJSON();

    if (val.status === "2nd") {
      let r = await proccess(val);
      console.log(r);
      // search for all query that is done and check if already inserted or not
    }
  }

  return a;
};
const proccess = async (val) => {
  console.log(val.id);
  let findQuery = await Query.findAll({ where: { queue_id: val.id } });
  if (findQuery.length === 0) {
    // call ai listener
    // return '';
    // let listenerReprocess = await axios.get(
    //   "http://localhost:1235/resendProcess"
    // );
    return findQuery;
    //await Queue.updateOne({status:'processing'},{where:{id:val.id}})
  } else {
    let toSend = [];
    console.log("start");
    for (let i = 0; i < findQuery.length; i++) {
      let queryInfo = findQuery[i].toJSON();

      if (queryInfo.type.includes("TEXT-TO-SPEECH")) {
        // check if devtext to speech  is done
        let transcript = await Transcripts.findOne({
          where: { id: queryInfo.transcript_id },
        });
        if (transcript === null) {
          // re run all
          recallListener(val.id);
          i = findQuery.length;
        }
      } else if (
        queryInfo.type.includes("Intent Analysis") ||
        queryInfo.type.includes("Sentiment Analysis")
      ) {
        if (queryInfo.status !== "Done") {
          //  check the code first
        }
      } else if (
        queryInfo.type.includes("Compliance") ||
        queryInfo.type.includes("Text Analysis") ||
        queryInfo.type.includes("Content Summarizer")
      ) {
        if (queryInfo.status !== "Done") {
          //  check the code first
          let statusChecker_ = await runQueryChecker(queryInfo);
        }
      }
    }
    console.log("_end");
  }
};
const recallListener = (val) => {
  console.log("recallListener");
};
