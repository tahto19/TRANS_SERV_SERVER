import { Op, Sequelize } from "sequelize";
import { changeSend } from "../../../../helper/toSend.js";
import IntentDetails from "../../../../models/IntentDetails.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import KpiAnylsis from "../../../../models/KpiAnylsis.model.js";
import SentimentAnylsis from "../../../../models/SentimentAnylsis.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";

export const getCSAT = async (res, req) => {
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
export const getTotal = async (req, res) => {
  try {
    const { id } = req.query;
    console.log("here");
    let queryFind = req.url.includes("getByUser")
      ? { group_id: id }
      : { agent_id: id };
    console.log(queryFind);
    let MainIntentTotal = await Transcripts.findAll({
      where: queryFind,
      include: [
        {
          require: false,
          model: IntentResult,
          attributes: [],
          include: [
            {
              require: false,
              model: IntentDetails,
              attributes: [],
              as: "main_intent",
            },
          ],
        },
      ],
      attributes: [
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.col("IntentResults.main_intent.intent_name")
          ),
          "main_intent_count",
        ],

        [Sequelize.col("IntentResults.main_intent.intent_name"), "Intent_Name"],
      ],
      group: ["IntentResults.main_intent.intent_name"],
    });

    let SubIntentTotal = await Transcripts.findAll({
      where: queryFind,
      include: [
        {
          require: false,
          model: IntentResult,
          attributes: [],
          where: { sub_intent_id: { [Op.not]: null } },
          include: [
            {
              require: false,
              model: IntentDetails,
              attributes: [],
              as: "sub_intent",
            },
          ],
        },
      ],

      attributes: [
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.col("IntentResults.sub_intent.intent_name")
          ),
          "sub_intent_count",
        ],
        [Sequelize.col("IntentResults.sub_intent.intent_name"), "Intent_Name"],
      ],
      group: ["IntentResults.sub_intent.intent_name"],
      // raw: true,
    });
    let getTotalForSentimetal = await Transcripts.findAll({
      where: queryFind,
      include: [
        {
          require: false,
          model: SentimentAnylsis,
          attributes: [],
        },
      ],
      attributes: [
        [
          Sequelize.fn("COUNT", Sequelize.col("SentiAnylses.sentiment_name")),
          "sentiment_count",
        ],
        [Sequelize.col("SentiAnylses.sentiment_name"), "sentiment_name"],
      ],
      group: ["SentiAnylses.sentiment_name"],
      // raw: true,
    });
    res.send(
      changeSend({ SubIntentTotal, MainIntentTotal, getTotalForSentimetal })
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const seperateTranscript = async (req, res) => {};
