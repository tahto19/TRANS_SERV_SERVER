import { Op, Sequelize } from "sequelize";
import { changeSend, tojson } from "../../../../helper/toSend.js";
import IntentDetails from "../../../../models/IntentDetails.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import KpiAnylsis from "../../../../models/KpiAnylsis.model.js";
import SentimentAnylsis from "../../../../models/SentimentAnylsis.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import TranscriptSeperation from "../../../../models/TranscriptSeperation.js";
import { transcript_seperator_config } from "../../CallAI/proccess/assets/chatgptconfig.js";
import { proccess } from "../process/process.js";
import { computeForKpi, computePerKpi } from "../../../../helper/Compute.js";
import Agents from "../../../../models/Agents.model.js";
import Groups from "../../../../models/Groups.model.js";
import StoredSpeech from "../../../../models/StoredSpeech.model.js";

import fs from "fs";
import { changeFormat, changeToJson } from "../../../../helper/helpersHere.js";
import Compliance from "../../../../models/Compliance.model.js";
import moment from "moment/moment.js";

export const getCSAT = async (req, res) => {
  try {
    const { id, start, end } = req.query;

    let queryFind = req.url.includes("getByUser")
      ? { agent_id: id }
      : req.url.includes("getByGroup")
      ? { group_id: id }
      : { id };

    var changeStart = new Date(moment(start).startOf("day"));
    var changeEnd = new Date(moment(end).endOf("day"));
    if (
      start !== "" &&
      end !== "" &&
      start !== undefined &&
      end !== undefined
    ) {
      queryFind["createdAt"] = { [Op.between]: [changeStart, changeEnd] };
    }
    const r = await Transcripts.findAll({
      where: queryFind,
      attributes: ["id", "createdAt", "updatedAt", "content"],
      include: [
        {
          required: false,
          model: Agents,
          // attributes: ["anaylsis", "kpi", "rating", "getWeight"],
        },
        {
          required: false,
          model: Groups,
          // attributes: [],
        },
        {
          required: false,
          model: IntentResult,
          // attributes: ["main_intent_id", "sub_intent_id", "id"],
          include: [
            {
              required: false,
              model: IntentDetails,
              // attributes: ["intent_name", "desc", "score"],
              as: "main_intent",
            },
          ],
        },
        {
          required: false,
          model: KpiAnylsis,
          // attributes: ["anaylsis", "kpi", "rating", "getWeight"],
        },
        {
          required: false,
          model: SentimentAnylsis,
          // attributes: ["sentiment_score", "explanation", "sentiment_name"],
        },
      ],
    });
    let getAllPercent = 0;
    let total = 0;
    let totalEach = 0;
    let dataToReturn = [];
    r.forEach((x) => {
      let data = tojson(x);
      // let data = [];
      let ckpi = new computeForKpi();
      ckpi.start(data.KpiAnylses);
      let computeInfo = ckpi.details();

      data["ComputeKpiAnylsis"] = computeInfo;
      let getTotalRating = ckpi.totalRating();

      computeInfo.forEach((xx) => {
        if (!isNaN(xx.weightConverted)) {
          getAllPercent += xx.percent;
        }
      });
      let csatTotal = ckpi.totalOfKPI();
      data["csatTotal"] = csatTotal;
      data["count"] = totalEach;
      // data["createdAt"] = data;
      totalEach += 1;
      total += csatTotal === null ? 0 : csatTotal;
      data["csatPercentageTotal"] = `${getTotalRating}%`;
      dataToReturn.push(data);
    });

    res.send(
      changeSend({
        data: dataToReturn,
        kpiTotal: total,
        average: total / totalEach,
        count: totalEach,
      })
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getTotal = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    var changeStart = moment(start).startOf("day");
    var changeEnd = moment(end).endOf("day");
    let queryFind = req.url.includes("getByUser")
      ? { agent_id: id }
      : { group_id: id };
    if (
      start !== "" &&
      end !== "" &&
      start !== undefined &&
      end !== undefined
    ) {
      queryFind["createdAt"] = { [Op.between]: [changeStart, changeEnd] };
    }
    console.log(queryFind, "here");
    let MainIntentTotal = await Transcripts.findAll({
      where: queryFind,

      include: [
        {
          required: true,
          model: IntentResult,
          attributes: [],
          where: { main_intent_id: { [Op.not]: null } },
          include: [
            {
              required: true,
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
          required: true,
          model: IntentResult,
          attributes: [],
          where: { sub_intent_id: { [Op.not]: null } },
          include: [
            {
              required: true,
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
          required: false,
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
    let getTotalCompliance = await Transcripts.findAll({
      where: queryFind,
      include: [
        {
          required: false,
          model: Compliance,
          attributes: [],
        },
      ],
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("Compliance.id")), "count"],
        [Sequelize.fn("SUM", Sequelize.col("Compliance.score")), "score"],
        // [Sequelize.col("SentiAnylses.sentiment_name"), "sentiment_name"],
      ],
      // group: ["Compliance"],
    });
    // let getCSATtotal = await ;

    // getTotalCompliance[0].score / getTotalCompliance[0].count;
    let CompliancetoJson =
      getTotalCompliance[0] === undefined
        ? []
        : changeToJson(getTotalCompliance[0]);

    CompliancetoJson["average"] =
      getTotalCompliance[0] === undefined
        ? 0
        : CompliancetoJson.score / CompliancetoJson.count;
    res.send(
      changeSend({
        SubIntentTotal,
        MainIntentTotal,
        getTotalForSentimetal,
        getTotalCompliance,
        complianceAverage: [CompliancetoJson],
      })
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const seperateTranscript = async (req, res) => {
  try {
    const { id } = req.query;
    let find = await TranscriptSeperation.findOne({
      where: { transcript_id: id },
    });
    if (find === null) {
      var p = new proccess();
      await p.start(id);
      find = await p.create();
    }
    res.send(changeSend(find));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getTranscriptOfUsersInGroup = async (req, res) => {
  try {
    const { id } = req.query;

    // let queryFind = req.url.includes("getByUser")
    //   ? { group_id: id }
    //   : { agent_id: id };
    const r = await Transcripts.findAll({
      where: { group_id: id },
      include: [
        {
          required: false,
          model: IntentResult,
          attributes: ["main_intent_id", "sub_intent_id", "id"],
          include: [
            // {
            //   required: true,
            //   model: IntentDetails,
            //   attributes: ["intent_name", "desc", "score"],
            //   as: "main_intent",
            // },
            {
              required: true,
              model: IntentDetails,
              attributes: ["intent_name", "desc", "score"],
              as: "sub_intent",
            },
          ],
        },
        {
          required: true,
          model: KpiAnylsis,
          attributes: ["anaylsis", "kpi", "rating", "getWeight"],
        },
        {
          required: true,
          model: SentimentAnylsis,
          attributes: ["sentiment_score", "explanation", "sentiment_name"],
        },
      ],
    });
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAudio = async (req, res) => {
  try {
    const { id } = req.query;

    let r = await StoredSpeech.findAll({
      // where: { transcript_id: id },
      raw: true,
      nest: true,
    });
    var audios = [];
    let changeFormatOfData = new changeFormat();
    for (let i = 0; i < r.length; i++) {
      let v = r[i];
      await changeFormatOfData.start(v.path);
      let base64Data = await changeFormatOfData.tobase64();
      audios.push(base64Data);
    }

    res.send(changeSend(audios));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getMetricsofKpi = async (req, res) => {
  try {
    const { id } = req.query;

    let queryFind = req.url.includes("getMetricsofKpiByGroup")
      ? { group_id: id }
      : { agent_id: id };

    const r = await Agents.findAll({
      queryFind,

      nest: true,
      include: [
        {
          required: false,
          model: Transcripts,
          attributes: ["id"],
          queryFind,
          include: {
            required: false,
            model: KpiAnylsis,
            attributes: [
              "anaylsis",
              "kpi",
              "rating",
              "getWeight",
              "metricsRange",
            ],
          },
        },
      ],
    });
    let users = [];
    r.forEach((v, i) => {
      let val = changeToJson(v);
      let temp = { name: v.fullname, kpi: [] };
      val.Transcripts.forEach((vv, ii) => {
        if (vv.KpiAnylses !== undefined)
          vv.KpiAnylses.forEach((vvv) => {
            if (
              !isNaN(parseInt(vvv.getWeight)) &&
              !isNaN(parseInt(vvv.rating))
            ) {
              let getKPIResult = computePerKpi(vvv);
              let findIndex = temp["kpi"].findIndex(
                (xx) => xx.kpi === getKPIResult.kpi
              );
              if (findIndex === -1) temp.kpi.push(getKPIResult);
              else {
                temp.kpi[findIndex]["weightConverted"] =
                  (getKPIResult.weightConverted +
                    temp.kpi[findIndex]["weightConverted"]) /
                  2;
                temp.kpi[findIndex]["count"] += 1;
              }
              // getKPIResult.forEach((x) => {
              //   let a = temp["kpi"][0].findIndex((xx) => xx.kpi === x.kpi);
              // });
            }
          });
      });
      users.push(temp);
    });
    res.send(changeSend(users));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getMetricsPerIntent = async (req, res) => {
  try {
    const { id, intent, start, end } = req.body;

    let queryFind = req.url.includes("getMetricsPerIntentByGroup")
      ? { group_id: id }
      : { agent_id: id };
    var changeStart = moment(start).startOf("day");
    var changeEnd = moment(end).endOf("day");
    if (
      start !== "" &&
      end !== "" &&
      start !== undefined &&
      end !== undefined
    ) {
      queryFind["createdAt"] = { [Op.between]: [changeStart, changeEnd] };
    }
    const r = await Agents.findAll({
      // nest: true,
      include: [
        {
          required: false,
          model: Transcripts,
          attributes: ["id"],
          where: queryFind,
          include: [
            {
              required: false,
              model: KpiAnylsis,
              attributes: [
                "anaylsis",
                "kpi",
                "rating",
                "getWeight",
                "metricsRange",
              ],
            },
            {
              required: true,
              model: IntentResult,
              where: { main_intent_id: { [Op.not]: null } },
              attributes: [
                // "anaylsis",
                // "kpi",
                // "rating",
                // "getWeight",
                // "metricsRange",
              ],
              include: [
                {
                  required: true,
                  model: IntentDetails,
                  as: "main_intent",
                  where: { intent_name: intent },
                  attributes: [
                    // "anaylsis",
                    // "kpi",
                    // "rating",
                    // "getWeight",
                    // "metricsRange",
                  ],
                },
              ],
              // attributes: [
              //   "anaylsis",
              //   "kpi",
              //   "rating",
              //   "getWeight",
              //   "metricsRange",
              // ],
            },
          ],
        },
      ],
    });
    let users = [];
    r.forEach((v, i) => {
      let val = changeToJson(v);
      let temp = { name: v.fullname, kpi: [] };
      val.Transcripts.forEach((vv, ii) => {
        if (vv.KpiAnylses !== undefined)
          vv.KpiAnylses.forEach((vvv) => {
            if (
              !isNaN(parseInt(vvv.getWeight)) &&
              !isNaN(parseInt(vvv.rating))
            ) {
              let getKPIResult = computePerKpi(vvv);
              let findIndex = temp["kpi"].findIndex(
                (xx) => xx.kpi === getKPIResult.kpi
              );
              if (findIndex === -1) temp.kpi.push(getKPIResult);
              else {
                temp.kpi[findIndex]["weightConverted"] =
                  (getKPIResult.weightConverted +
                    temp.kpi[findIndex]["weightConverted"]) /
                  2;
                temp.kpi[findIndex]["count"] += 1;
              }
              // getKPIResult.forEach((x) => {
              //   let a = temp["kpi"][0].findIndex((xx) => xx.kpi === x.kpi);
              // });
            }
          });
      });
      users.push(temp);
    });
    res.send(changeSend(users));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getDashboard = async (req, res) => {
  try {
    // where: { KpiAnylses: { [Op.not]: null } },
    const { id, start, end } = req.query;
    var changeStart = moment(start).startOf("day");
    var changeEnd = moment(end).endOf("day");
    let queryFind = {
      where: { organization_id: id },
      include: [
        {
          required: false,
          model: Transcripts,
          attributes: ["id"],
          // where: queryFind,
          include: [
            {
              required: true,
              model: KpiAnylsis,
              attributes: [
                "anaylsis",
                "kpi",
                "rating",
                "getWeight",
                "metricsRange",
              ],
            },
            {
              required: true,
              model: IntentResult,
              // attributes: ["main_intent_id", "sub_intent_id", "id"],
              include: [
                {
                  required: false,
                  model: IntentDetails,
                  // attributes: ["intent_name", "desc", "score"],
                  as: "main_intent",
                },
                {
                  required: false,
                  model: IntentDetails,
                  // attributes: ["intent_name", "desc", "score"],
                  as: "sub_intent",
                },
              ],
            },
            {
              required: false,
              model: SentimentAnylsis,
              // attributes: [],
            },
            {
              required: false,
              model: Compliance,
              // attributes: ["sentiment_score", "explanation", "sentiment_name"],
            },
          ],
        },
      ],
    };
    if (
      start !== "" &&
      end !== "" &&
      start !== undefined &&
      end !== undefined
    ) {
      queryFind["include"][0]["where"] = {
        createdAt: {
          [Op.between]: [changeStart, changeEnd],
        },
      };
    }

    const getCSAT = await Groups.findAll(queryFind);
    let CSAToverAll = [];
    getCSAT.forEach((v, i) => {
      const temp = {
        group: {
          id: v.id,
          name: v.name,
          perkpi: [],
          csat: 0,
          count: 0,
          main_intent: [],
          sub_intent: [],
          sentiment: [],
          compliance: { total: 0, average: 0 },
        },
      };
      v.Transcripts.forEach((vv, ii) => {
        temp.group.count += 1;
        vv.KpiAnylses.forEach((vvv, iii) => {
          if (!isNaN(parseInt(vvv.getWeight)) && !isNaN(parseInt(vvv.rating))) {
            let getKPIResult = computePerKpi(vvv);
            let findIndex = temp.group["perkpi"].findIndex(
              (xx) => xx.kpi === getKPIResult.kpi
            );
            if (findIndex === -1) temp.group.perkpi.push(getKPIResult);
            else {
              temp.group.perkpi[findIndex]["weightConverted"] =
                (getKPIResult.weightConverted +
                  temp.group.perkpi[findIndex]["weightConverted"]) /
                2;
              temp.group.perkpi[findIndex]["count"] += 1;
            }
            temp.group.csat += getKPIResult.getOnlyWeight;

            // getKPIResult.forEach((x) => {
            //   let a = temp["kpi"][0].findIndex((xx) => xx.kpi === x.kpi);
            // });
          }
        });
        let intent = vv.IntentResults[0];
        console.log;
        //  find main intent if found
        let findIntent = temp.group.main_intent.findIndex(
          (x) => x.name === intent.main_intent.intent_name
        );
        if (findIntent === -1) {
          temp.group.main_intent.push({
            name: intent.main_intent.intent_name,
            count: 1,
          });
        } else {
          temp.group.main_intent[findIntent].count += 1;
        }
        if (intent.sub_intent !== null) {
          let findSubIntent = temp.group.sub_intent.findIndex(
            (x) => x.name === intent.sub_intent.intent_name
          );
          if (findSubIntent === -1) {
            temp.group.sub_intent.push({
              name: intent.sub_intent.intent_name,
              count: 1,
            });
          } else {
            temp.group.sub_intent[findIntent].count += 1;
          }
        }
        if (vv.SentiAnylses[0] !== undefined) {
          let senti = changeToJson(vv.SentiAnylses[0]);

          let findSentiment = temp.group.sentiment.findIndex(
            (x) => x.name.toLowerCase() === senti.sentiment_name.toLowerCase()
          );

          if (findSentiment === -1) {
            temp.group.sentiment.push({
              name: senti.sentiment_name,
              count: 0,
            });
          } else {
            temp.group.sentiment[findSentiment].count += 1;
          }
        }
        if (vv.Compliance.score !== undefined) {
          temp.group.compliance.total += parseFloat(vv.Compliance.score);
        }
        //  for compliance
      });
      temp.group.compliance.average +=
        temp.group.compliance.total / temp.group.count;
      temp.group.csat = temp.group.csat / temp.group.count;
      CSAToverAll.push(temp);
    });

    res.send(changeSend(CSAToverAll));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getSentiment = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    let queryFind = req.url.includes("getByGroup")
      ? { group_id: id }
      : { agent_id: id };
    if (
      start !== "" &&
      end !== "" &&
      start !== undefined &&
      end !== undefined
    ) {
      queryFind["createdAt"] = {
        [Op.between]: [moment(start).startOf("day"), moment(end).endOf("day")],
      };
    }
    let r = await Transcripts.findAll({
      // raw: true,
      where: queryFind,

      include: {
        required: false,
        model: SentimentAnylsis,
        attributes: [],
      },
      attributes: [
        [
          Sequelize.fn(
            "date_format",
            Sequelize.col("Transcripts.createdAt"),
            "%Y-%m-%d"
          ),
          "formattedCreatedAt",
        ],

        [
          Sequelize.fn("COUNT", Sequelize.col("SentiAnylses.sentiment_name")),
          "count",
        ],
        [Sequelize.col("SentiAnylses.sentiment_name"), "sentiment_name"],
      ],
      group: ["SentiAnylses.sentiment_name", "formattedCreatedAt"],
    });
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getSentimentTable = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    let queryFind = req.url.includes("getByGroup")
      ? { group_id: id }
      : { agent_id: id };
    let r = await Transcripts.findAll({
      // raw: true,
      // where: queryFind,

      include: [
        {
          require: true,
          model: SentimentAnylsis,
        },
        {
          require: true,
          model: Agents,
        },
      ],
      attributes: [
        [
          Sequelize.fn("COUNT", Sequelize.col("SentiAnylses.sentiment_name")),
          "count",
        ],
      ],
      group: ["Agent.fullname", "SentiAnylses.sentiment_name"],
      // attributes: ["SentiAnylses", "id", "agent_id"],
    });
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const averageCompliance = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    let queryFind = req.url.includes("averagebyGroup")
      ? { group_id: id }
      : { agent_id: id };
    let r = await Transcripts.findAll({
      where: queryFind,
      include: [
        {
          require: true,
          model: Compliance,
          // attributes: [],
        },
        {
          required: true,
          model: IntentResult,
          attributes: [],
          where: { main_intent_id: { [Op.not]: null } },
          include: [
            {
              require: true,
              model: IntentDetails,
              attributes: [],
              as: "main_intent",
            },
          ],
        },
      ],
      attributes: [
        [Sequelize.col("IntentResults.main_intent.intent_name"), "Intent_Name"],
        [Sequelize.fn("COUNT", Sequelize.col("Compliance.id")), "count"],
        [Sequelize.fn("SUM", Sequelize.col("Compliance.score")), "score"],
      ],
      group: ["IntentResults.main_intent.intent_name"],
    });
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
export const getPertIntentInCompliance = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    let queryFind = req.url.includes("perIntentByGroup")
      ? { group_id: id }
      : { agent_id: id };
    let r = await Transcripts.findAll({
      where: queryFind,
      include: [
        {
          require: true,
          model: Compliance,
          attributes: [],
        },
        {
          required: true,
          model: IntentResult,
          attributes: [],
          where: { main_intent_id: { [Op.not]: null } },
          include: [
            {
              require: true,
              model: IntentDetails,
              attributes: [],
              as: "main_intent",
            },
          ],
        },
      ],
      attributes: [
        [Sequelize.col("IntentResults.main_intent.intent_name"), "Intent_Name"],
        [Sequelize.fn("COUNT", Sequelize.col("Compliance.id")), "count"],
        [Sequelize.fn("SUM", Sequelize.col("Compliance.score")), "score"],
      ],
      group: ["IntentResults.main_intent.intent_name"],
    });
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
