import { getConfigurationByTranscriptId } from "../../../../helper/helpersHere.js";
import { changeSend } from "../../../../helper/toSend.js";
import Query from "../../../../models/Query.model.js";
import Queue from "../../../../models/Queue.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";

export const getListener = async (req, res) => {
  try {
    let getTranscriptLatest = await Queue.findAll({
      limit: 200,
      attributes: ["queue_id", "id"],
      order: [["queue_id", "DESC"]],
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
