import { getConfigurationByTranscriptId } from "../../../../helper/helpersHere.js";
import { changeSend } from "../../../../helper/toSend.js";
import Query from "../../../../models/Query.model.js";
import Queue from "../../../../models/Queue.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import { Op, Sequelize } from "sequelize";
export const getListener = async (req, res) => {
  // BETWEEN '2024-04-04 00:00:00.000000' AND '2024-04-04 20:59:59.999999'
  // ORDER BY ID DESC LIMIT 250`
  try {
    let getTranscriptLatest = await Queue.findAll({
      limit: 50,
      attributes: ["queue_id", "id"],
      order: [["queue_id", "DESC"]],
      where: {
        queue_date: {
          [Op.between]: [
            "2024-04-04 00:00:00.000000",
            "2024-04-04 20:59:59.999999",
          ],
        },
      },
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
