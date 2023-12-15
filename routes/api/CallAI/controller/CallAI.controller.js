import { computeForKpi } from "../../../../helper/Compute.js";
import { changeSend, tojson } from "../../../../helper/toSend.js";
import IntentDetails from "../../../../models/IntentDetails.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import KpiAnylsis from "../../../../models/KpiAnylsis.model.js";
import SentimentAnylsis from "../../../../models/SentimentAnylsis.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import { proccessIntent } from "../proccess/proccess.js";

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
    throw err;
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
