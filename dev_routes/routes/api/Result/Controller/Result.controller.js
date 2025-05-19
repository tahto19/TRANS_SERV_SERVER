import { Op, Sequelize } from "sequelize";
import { changeSend, tojson } from "../../../../helper/toSend.js";
import IntentDetails from "../../../../models/IntentDetails.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import KpiAnylsis from "../../../../models/KpiAnylsis.model.js";
import SentimentAnylsis from "../../../../models/SentimentAnylsis.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import NotesDetails from "../../../../models/NotesDetails.model.js";
import TranscriptSeperation from "../../../../models/TranscriptSeperation.js";
import { transcript_seperator_config } from "../../CallAI/proccess/assets/chatgptconfig.js";
import { proccess } from "../process/process.js";
import { computeForKpi, computePerKpi } from "../../../../helper/Compute.js";
import Agents from "../../../../models/Agents.model.js";
import Groups from "../../../../models/Groups.model.js";
import StoredSpeech from "../../../../models/StoredSpeech.model.js";
import Notes from "../../../../models/Notes.model.js";
import AgentLists from "../../../../models/AgentLists.model.js";
import fs from "fs";
import { changeFormat, changeToJson } from "../../../../helper/helpersHere.js";

import Compliance from "../../../../models/Compliance.model.js";
import moment from "moment/moment.js";
import Intents from "../../../../models/Intents.model.js";
import GroupServiceConfig from "../../../../models/GroupServiceConfig.model.js";
import averageTotal from "../../../../models/averageTotal.model.js";
import Queue from "../../../../models/Queue.model.js";
import Query from "../../../../models/Query.model.js";
import OrgIntentsConf from "../../../../models/OrgIntentsConf.model.js";

export const getCSAT = async (req, res) => {
  try {
    var { id, start, end } = req.query;

    let queryFind = req.url.includes("getByUser")
      ? { "$Agent.user_conn$": id }
      : req.url.includes("getByGroup")
      ? { group_id: id }
      : req.url.includes("getByOrganization")
      ? { "$Group.organization_id$": id }
      : { id };

    if (start !== undefined && end !== undefined) {
      queryFind["queue_date"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }

    let query = {
      where: queryFind,
      // attributes: [
      //   "id",

      //   "updatedAt",
      //   "content",
      //   [Sequelize.col("queue_date"), "createdAt"],
      // ],

      include: [
        {
          required: true,
          model: Agents,
          // attributes: ["anaylsis", "kpi", "rating", "getWeight"],
        },
        { required: true, model: Compliance },
        {
          model: Groups,
          // attributes: [],
        },
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
        {
          required: true,
          model: KpiAnylsis,
          // attributes: ["anaylsis", "kpi", "rating", "getWeight"],
        },
        {
          required: true,
          model: SentimentAnylsis,
          // attributes: ["sentiment_score", "explanation", "sentiment_name"],
        },
        {
          required: true,
          model: Notes,
          include: { model: NotesDetails, required: false },
          // attributes: ["sentiment_score", "explanation", "sentiment_name"],
        },
        {
          model: StoredSpeech,
          // attributes: ["sentiment_score", "explanation", "sentiment_name"],
        },
      ],

      order: [["createdAt", "DESC"]],
    };

    const r = await Transcripts.findAll(query);

    let getAllPercent = 0;
    let total = 0;
    let totalEach = 0;
    let dataToReturn = [];
    // r.forEach(async (x) => {
    for (let i = 0; i < r.length; i++) {
      let x = r[i];
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
      // let temp = { save: true };
      // temp["csatScore"] = csatTotal;
      // if (csatTotal <= 70 || csatTotal >= 90) {
      //   temp["csat"] = true;
      // }
      // temp["complianceScore"] = data.Compliance.score;
      // if (
      //   parseFloat(data.Compliance.score) <= 70 ||
      //   parseFloat(data.Compliance.score) >= 90
      // ) {
      //   temp["compliance"] = true;
      // }
      // if (temp.save) {
      // let find = await averageTotal.findAll({
      //   where: { transcript_id: data.id },
      // });

      // if (find.length === 0) {
      //   delete temp["save"];
      //   temp["transcript_id"] = data.id;

      //   let a = await averageTotal.create(temp);
      // }
      // }
      data["count"] = totalEach;
      // data["createdAt"] = data;
      totalEach += 1;
      total += csatTotal === null ? 0 : csatTotal;
      data["csatPercentageTotal"] = `${getTotalRating}%`;
      dataToReturn.push(data);
    }
    // });

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
    var changeStart = moment(start)
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    var changeEnd = moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss");
    let queryFind = req.url.includes("getByUser")
      ? { "$Agent.user_conn$": id }
      : req.url.includes("getByOrganization")
      ? { "$Group.organization_id$": parseInt(id) }
      : { group_id: parseInt(id) };

    if (start !== undefined && end !== undefined) {
      queryFind["queue_date"] = { [Op.between]: [changeStart, changeEnd] };
    }
    console.log("####################");
    console.log(queryFind);
    console.log("####################");
    let MainIntentTotal = await Transcripts.findAll({
      // where: queryFind,
      include: [
        { model: Groups },
        // {
        //   required: true,
        //   model: KpiAnylsis,
        //   attributes: [],
        //   // attributes: ["anaylsis", "kpi", "rating", "getWeight"],
        // },
        // {
        //   required: true,
        //   model: Compliance,
        //   attributes: [],
        // },
        {
          model: Agents,
          required: true,
          include: [{ model: AgentLists, required: true }],
        },
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
        {
          required: true,
          model: Notes,
          attributes: [],
        },
        {
          required: true,
          model: SentimentAnylsis,
          attributes: [],
        },
      ],
      attributes: [
        [
          Sequelize.fn("COUNT", Sequelize.col("Transcripts.id")),
          "main_intent_count",
        ],
        [Sequelize.col("IntentResults.main_intent.intent_name"), "Intent_Name"],
      ],
      group: ["IntentResults.main_intent.intent_name"],
      where: queryFind,
    });

    let SubIntentTotal = await Transcripts.findAll({
      //
      include: [
        { model: Groups },
        {
          required: true,
          model: SentimentAnylsis,
          attributes: [],
        },
        {
          model: Agents,
          required: true,
          include: [{ model: AgentLists, required: true }],
        },
        {
          required: true,
          model: Notes,
          attributes: [],
        },
        // {
        //   required: true,
        //   model: KpiAnylsis,
        //   attributes: [],
        //   // attributes: ["anaylsis", "kpi", "rating", "getWeight"],
        // },
        {
          required: true,
          model: Compliance,
          attributes: [],
        },
        {
          required: true,
          model: SentimentAnylsis,
          attributes: [],
        },
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
      where: queryFind,
    });

    let getTotalForSentimetal = await Transcripts.findAll({
      // where: queryFind,
      include: [
        { model: Groups },
        {
          required: true,
          model: Notes,
          attributes: [],
        },
        {
          model: Agents,
          required: true,
          include: [{ model: AgentLists, required: true }],
        },
        // {
        //   required: true,
        //   model: KpiAnylsis,
        //   // attributes: [],
        //   // attributes: ["anaylsis", "kpi", "rating", "getWeight"],
        // },
        {
          required: true,
          model: SentimentAnylsis,
          // attributes: [],
        },
        {
          required: true,
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
          Sequelize.fn("COUNT", Sequelize.col("Transcripts.id")),
          "sentiment_count",
        ],
        [Sequelize.col("SentiAnylses.sentiment_name"), "sentiment_name"],
      ],

      group: ["SentiAnylses.sentiment_name"],
      where: queryFind,
    });
    let getTotalCompliance = await Transcripts.findAll({
      // where: queryFind,
      include: [
        { model: Groups },
        {
          required: true,
          model: Notes,
          attributes: [],
        },
        // {
        //   required: true,
        //   model: KpiAnylsis,
        //   attributes: [],
        //   // attributes: ["anaylsis", "kpi", "rating", "getWeight"],
        // },
        {
          required: true,
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
              required: true,
              model: IntentDetails,
              attributes: [],
              as: "main_intent",
            },
          ],
        },
        {
          required: true,
          model: SentimentAnylsis,
          attributes: [],
        },
      ],
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("Compliance.id")), "count"],
        [Sequelize.fn("SUM", Sequelize.col("Compliance.score")), "score"],
        // [Sequelize.col("SentiAnylses.sentiment_name"), "sentiment_name"],
      ],
      // group: ["Compliance"],
      where: queryFind,
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
      where: { transcript_id: id },
      raw: true,
      nest: true,
    });
    var audios = [];
    let changeFormatOfData = new changeFormat();
    for (let i = 0; i < r.length; i++) {
      let v = r[i];

      let path_ = await new URL(
        "../../../../upload/" + v.path,
        import.meta.url
      );
      let converted = path_.href.replace("file:///", "");

      await changeFormatOfData.start("/" + converted);
      let base64Data = await changeFormatOfData.tobase64();
      audios.push(base64Data);
    }

    res.send(changeSend(audios));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getSeperateCall = async (req, res) => {
  try {
    const { id } = req.query;
    let a = await TranscriptSeperation.findAll({
      where: { transcript_id: id },
    });

    res.send(changeSend(a));
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
    if (intent === undefined) throw new Error("No Intent");
    var getActive = intent.includes("Old");
    var getRealIntent_name =
      intent.split(" ").length === 1 ? intent : intent.split(" ")[1];
    // app.post("/getMetricsPerIntentByOrganization", getMetricsPerIntentSchema);

    let queryFind = req.url.includes("getMetricsPerIntentByGroup")
      ? { groupId: id }
      : req.url.includes("getMetricsPerIntentByOrganization")
      ? { "$Group.organization_id$": id }
      : { agent_id: id };
    let searchForGroupServiceConfig = req.url.includes(
      "getMetricsPerIntentByGroup"
    )
      ? { groupId: id }
      : req.url.includes("getMetricsPerIntentByOrganization")
      ? { organization_id: id }
      : { agent_id: id };
    var changeStart = moment(start)
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    var changeEnd = moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss");
    if (
      start !== "" &&
      end !== "" &&
      start !== undefined &&
      end !== undefined
    ) {
      queryFind["createdAt"] = { [Op.between]: [changeStart, changeEnd] };
    }

    var getConfig = await GroupServiceConfig.findAll({
      raw: true,
      where: searchForGroupServiceConfig,
      // {}
      include: [
        { model: Groups },
        {
          // attributes: [],
          model: Intents,
          where: { active: !getActive, intent: getRealIntent_name },
        },
      ],
      // attributes: [[Sequelize.col("Intents.id"), "Intent_id"]],
    });
    if (getConfig.length === 0) throw new Error("No Config found");
    let connQuery = req.url.includes("getMetricsPerIntentByOrganization")
      ? { [Op.in]: [] }
      : getConfig[0]["Intents.id"];
    if (req.url.includes("getMetricsPerIntentByOrganization")) {
      for (let i = 0; i < getConfig.length; i++) {
        connQuery[Op.in].push(getConfig[i]["Intents.id"]);
      }
    }
    const r = await Agents.findAll({
      // nest: true,
      // where: searchForGroupServiceConfig,
      include: [
        {
          required: true,
          model: Transcripts,
          // attributes: ["id"],

          include: [
            { model: Groups },
            {
              required: true,
              model: KpiAnylsis,
              // attributes: [
              //   "anaylsis",
              //   "kpi",
              //   "rating",
              //   "getWeight",
              //   "metricsRange",
              // ],
            },
            { required: true, model: Compliance },
            {
              required: true,
              model: IntentResult,
              // where: { main_intent_id: { [Op.not]: null } },
              // attributes: [
              //   // "anaylsis",
              //   // "kpi",
              //   // "rating",
              //   // "getWeight",
              //   // "metricsRange",
              // ],
              include: [
                {
                  required: true,
                  model: IntentDetails,
                  as: "main_intent",
                  where: {
                    conn: connQuery,
                  },
                  // attributes: [
                  //   // "anaylsis",
                  //   // "kpi",
                  //   // "rating",
                  //   // "getWeight",
                  //   // "metricsRange",
                  // ],
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
      let temp;
      let a = users.find((x) => x.name === v.fullname);
      if (a) {
        let getIndex = users.findIndex((x) => x.name === v.fullname);
        users.splice(getIndex, 1);
        temp = {
          name: v.fullname,
          kpi: a.kpi,
          csat: a.csat,
          compliance: a.compliance,
          count: a.count,
        };
      } else {
        temp = {
          name: v.fullname,
          kpi: [],
          csat: 0,
          compliance: 0,
          count: 0,
        };
      }

      val.Transcripts.forEach((vv, ii) => {
        if (vv.Compliance !== undefined) {
          if (vv.Compliance.score) {
            if (temp.count === 0) {
              temp.count += 1;
              temp.compliance = vv.Compliance.score;
            } else {
              temp.count += 1;
              temp.compliance =
                (parseInt(vv.Compliance.score) + parseInt(temp.compliance)) / 2;
            }
          }
        }
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
              if (findIndex === -1) {
                temp.kpi.push(getKPIResult);

                temp.csat = getKPIResult.weightConverted;
              } else {
                temp.kpi[findIndex]["weightConverted"] =
                  (getKPIResult.weightConverted +
                    temp.kpi[findIndex]["weightConverted"]) /
                  2;

                temp.csat = (getKPIResult.weightConverted + temp.csat) / 2;

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
    var changeStart = moment(start)
      .startOf("day")
      .format("YYYY-MM-DD HH:mm:ss");
    var changeEnd = moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss");
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
      : req.url.includes("getByOrganization")
      ? { "$Group.organization_id$": id }
      : { "$Agent.user_conn$": id };
    if (
      start !== "" &&
      end !== "" &&
      start !== undefined &&
      end !== undefined
    ) {
      queryFind["createdAt"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }
    let formatDateDesign =
      moment(start).diff(moment(end), "day") !== 0 && end !== undefined
        ? [
            Sequelize.fn(
              "date_format",
              Sequelize.col("Transcripts.queue_date"),
              "%m/%d/%y"
            ),
            "formattedCreatedAt",
          ]
        : [Sequelize.col("Transcripts.queue_date"), "formattedCreatedAt"];

    let r = await Transcripts.findAll({
      // raw: true,
      where: queryFind,

      include: [
        { required: true, model: Notes },
        { required: true, model: Agents, include: [{ model: AgentLists }] },
        {
          required: true,
          model: KpiAnylsis,
          attributes: [],
        },
        {
          required: true,
          model: IntentResult,
        },
        {
          required: true,
          model: SentimentAnylsis,
          attributes: [],
        },
        {
          required: true,
          model: Groups,
          attributes: [],
        },
      ],
      attributes: [
        formatDateDesign,

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
      : req.url.includes("getByOrganization")
      ? { "$Group.organization_id$": id }
      : {};
    let queryAgent = req.url.includes("averagebyAgent")
      ? { user_conn: id }
      : {};
    if (
      start !== "" &&
      end !== "" &&
      start !== undefined &&
      end !== undefined
    ) {
      queryFind["createdAt"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }
    let r = await Transcripts.findAll({
      // raw: true,
      where: queryFind,

      include: [
        {
          required: true,
          model: SentimentAnylsis,
        },
        {
          required: true,
          model: Groups,
        },
        {
          model: Agents,
          where: queryAgent,
          required: true,
          include: [{ model: AgentLists }],
        },
        {
          required: true,
          model: Notes,
        },
        {
          required: true,
          model: Agents,
        },
        { required: true, model: Notes },
      ],
      attributes: [
        [
          Sequelize.fn("COUNT", Sequelize.col("SentiAnylses.sentiment_name")),
          "count",
        ],
      ],
      group: ["Agent.user_conn", "SentiAnylses.sentiment_name"],
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
    // getAverageCompliance

    var { id, start, end } = req.query;
    let queryFind = req.url.includes("averagebyGroup")
      ? { group_id: id }
      : req.url.includes("averagebyOrganization")
      ? { "$Group.organization_id$": id }
      : {};
    let queryAgent = req.url.includes("averagebyAgent")
      ? { user_conn: id }
      : {};
    if (start !== undefined && end !== undefined) {
      queryFind["queue_date"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }

    let r = await Transcripts.findAll({
      where: queryFind,
      include: [
        {
          required: true,
          model: Compliance,
          attributes: [],
        },
        {
          required: true,
          model: Notes,
          attributes: [],
        },
        // {
        //   required: true,
        //   model: KpiAnylsis,
        //   attributes: [],
        // },
        { model: Groups, required: true },
        {
          model: Agents,
          required: true,
          where: queryAgent,
          include: { model: AgentLists, required: true },
        },
        {
          required: true,
          model: IntentResult,

          where: { main_intent_id: { [Op.not]: null } },
          include: [
            {
              required: true,
              model: IntentDetails,

              as: "main_intent",
              include: {
                model: Intents,
                include: [{ model: OrgIntentsConf }],
                attributes: [],
                // where: { active: true },
              },
            },
          ],
        },
      ],
      attributes: [
        [
          Sequelize.fn(
            "CONCAT",
            Sequelize.literal(
              "CASE WHEN `IntentResults->main_intent->Intent->OrgIntentsConf`.`active` = 1 THEN '' ELSE 'old ' END"
            ),
            Sequelize.col(
              "IntentResults.main_intent.Intent.OrgIntentsConf.intent"
            )
          ),
          "Intent_Name",
        ],

        [Sequelize.fn("COUNT", Sequelize.col("Compliance.id")), "count"],
        [Sequelize.fn("SUM", Sequelize.col("Compliance.score")), "score"],
        [Sequelize.fn("AVG", Sequelize.col("Compliance.score")), "average"],
      ],
      group: ["IntentResults.main_intent.Intent.OrgIntentsConf.id"],
    });
    let toSend = [{ average: 0, count: 0, score: 0 }];
    r.forEach((v, i) => {
      let value = changeToJson(v);
      toSend[0].score += value.score;
      toSend[0].count = value.count;
      let average = value.score / value.count;
      if (i !== 0) toSend[0].average = (toSend[0].average + average) / 2;
      else toSend[0].average = average;
    });
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getPertIntentInCompliance = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    let queryFind = req.url.includes("perIntentByGroup")
      ? { group_id: id }
      : req.url.includes("perIntentOrganization")
      ? { "$Group.organization_id$": id }
      : {};
    let queryAgent = req.url.includes("perIntentByAgent")
      ? { user_conn: id }
      : {};
    if (start !== undefined && end !== undefined) {
      queryFind["createdAt"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }
    let r = await Transcripts.findAll({
      where: queryFind,
      include: [
        {
          required: true,
          model: Compliance,
          attributes: [],
        },
        {
          required: true,
          model: Groups,
          attributes: [],
        },
        {
          required: true,
          model: Agents,
          attributes: [],
          where: queryAgent,
        },
        {
          required: true,
          model: Notes,
          attributes: [],
        },
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
              include: {
                model: Intents,
                include: [{ model: OrgIntentsConf }],
                attributes: [],
                // where: { active: true },
              },
            },
          ],
        },
      ],
      attributes: [
        [
          Sequelize.fn(
            "CONCAT",
            Sequelize.literal(
              "CASE WHEN `IntentResults->main_intent->Intent->OrgIntentsConf`.`active` = 1 THEN '' ELSE 'old ' END"
            ),
            Sequelize.col(
              "IntentResults.main_intent.Intent.OrgIntentsConf.intent"
            )
          ),
          "Intent_Name",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("Compliance.id")), "count"],
        [Sequelize.fn("SUM", Sequelize.col("Compliance.score")), "score"],
      ],
      group: ["IntentResults.main_intent.Intent.OrgIntentsConf.id"],
    });
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
export const getPerAgentCompliance = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    let queryFind = req.url.includes("perAgentByGroup")
      ? { group_id: id }
      : req.url.includes("perAgentByOrganization")
      ? { "$Group.organization_id$": id }
      : {};
    let queryAgent = req.url.includes("perAgentByGroup")
      ? { user_conn: id }
      : {};
    if (start !== undefined && end !== undefined) {
      queryFind["queue_date"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }

    let r = await Transcripts.findAll({
      where: queryFind,
      include: [
        {
          required: true,
          model: Compliance,
          attributes: [],
        },
        {
          required: true,
          model: Notes,
          attributes: [],
        },
        {
          required: true,
          model: Groups,
          attributes: [],
        },
        {
          required: true,
          model: Agents,
          attributes: [],
          where: queryAgent,
          include: { model: AgentLists },
        },

        {
          required: true,
          model: IntentResult,
          attributes: [],
          where: { main_intent_id: { [Op.not]: null } },
          include: [
            {
              required: true,
              model: IntentDetails,
              include: [{ model: OrgIntentsConf }],
              attributes: [],
              as: "main_intent",
            },
          ],
        },
      ],
      attributes: [
        [Sequelize.col("Agent.AgentList.fullname"), "fullname"],
        [Sequelize.col("IntentResults.main_intent.intent_name"), "Intent_Name"],
        [Sequelize.fn("COUNT", Sequelize.col("Compliance.id")), "count"],
        [Sequelize.fn("SUM", Sequelize.col("Compliance.score")), "score"],
      ],
      group: ["IntentResults.main_intent.intent_name", "fullname"],
    });
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
export const getCompliancePerPeriod = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    let queryFind = req.url.includes("perPeriodByGroup")
      ? { group_id: id }
      : req.url.includes("perPeriodByOrganization")
      ? { "$Group.organization_id$": id }
      : {};
    let queryAgent = req.url.includes("perPeriodByAgent")
      ? { user_conn: id }
      : {};
    if (start !== undefined && end !== undefined) {
      queryFind["createdAt"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }

    let formatDateDesign =
      moment(start).diff(moment(end), "day") !== 0 || end === undefined
        ? [
            Sequelize.fn(
              "date_format",
              Sequelize.col("Transcripts.queue_date"),
              "%m/%d/%y"
            ),
            "formattedCreatedAt",
          ]
        : [Sequelize.col("Transcripts.queue_date"), "formattedCreatedAt"];

    // [
    //   Sequelize.col(

    //    "Transcripts.createdAt"

    //   ),
    //   "date_format",
    // ];

    let r = await Transcripts.findAll({
      where: queryFind,
      include: [
        {
          required: true,
          model: Compliance,
          attributes: [],
        },
        {
          required: true,
          model: Groups,
          attributes: [],
        },
        { required: true, model: Agents, attributes: [], where: queryAgent },
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
        formatDateDesign,
        [Sequelize.col("IntentResults.main_intent.intent_name"), "Intent_Name"],
        [Sequelize.fn("COUNT", Sequelize.col("Compliance.id")), "count"],
        [Sequelize.fn("SUM", Sequelize.col("Compliance.score")), "score"],
      ],
      group: ["IntentResults.main_intent.intent_name", "formattedCreatedAt"],
    });
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getCSATTotal = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    let queryFind = req.url.includes("perPeriodByGroup")
      ? { group_id: id }
      : req.url.includes("perPeriodByOrganization")
      ? { "$Group.organization_id$": id }
      : {};
    let queryAgent = req.url.includes("getcsattotalAgent")
      ? { user_conn: id }
      : {};
    if (start !== undefined && end !== undefined) {
      queryFind["createdAt"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }
    let r = await Transcripts.findAll({
      where: queryFind,
      include: [
        {
          required: true,
          model: Groups,
          // attributes: [],
        },
        {
          required: true,
          model: Agents,
          // attributes: [],
          where: queryAgent,
        },
        {
          required: true,
          model: KpiAnylsis,
          // attributes: [],
        },
      ],
      attributes: [
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("KpiAnylses.rating *.01 * KpiAnylses.getWeight")
          ),
          "NewPrice",
        ],
      ],
      group: ["id"],
      // attributes: [
      //   [
      //     Sequelize.fn(
      //       "date_format",
      //       Sequelize.col("Transcripts.createdAt"),
      //       "%Y-%m-%d"
      //     ),
      //     "formattedCreatedAt",
      //   ],
      //   [Sequelize.col("IntentResults.main_intent.intent_name"), "Intent_Name"],
      //   [Sequelize.fn("COUNT", Sequelize.col("IntentResults.id")), "count"],
      //   [Sequelize.fn("SUM", Sequelize.col("Compliance.score")), "score"],
      // ],
      // group: ["IntentResults.main_intent.intent_name", "formattedCreatedAt"],
    });
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
export const getAllIntentByOrg = async (req, res) => {
  try {
    const { id } = req.query;

    let queryFind = req.url.includes("getIntentsByOrg")
      ? { organization_id: id }
      : { groupId: id };

    // const getIntents = await Intents.findAll({
    //   order: [["active", "DESC"]],
    //   // where: { OrgIntentsConf: { [Op.not]: null } },
    //   include: [
    //     {
    //       model: OrgIntentsConf,
    //       required: true,
    //     },
    //     {
    //       require: true,
    //       model: GroupServiceConfig,
    //       where: queryFind,
    //       attributes: [],
    //     },
    //   ],
    //   // attributes: [
    //   //   "id",
    //   //   [
    //   //     Sequelize.fn(
    //   //       "CONCAT",
    //   //       Sequelize.literal(
    //   //         "CASE WHEN `OrgIntentsConf`.`active` = 1 THEN '' ELSE 'old ' END"
    //   //       ),
    //   //       Sequelize.col("OrgIntentsConf.intent")
    //   //     ),
    //   //     "intent_name",
    //   //   ],
    //   // ],
    //   // group: ["intent_name"],
    // });
    // let toSend = [];
    // getIntents.forEach((val) => {
    //   let v = changeToJson(val);

    //   toSend.push({ intent: v.intent_name, id: v.id });
    // });
    const getIntents = await OrgIntentsConf.findAll({
      where: queryFind,
      attributes: [
        "id",
        [
          Sequelize.fn(
            "CONCAT",
            Sequelize.literal("CASE WHEN `active` = 1 THEN '' ELSE 'old ' END"),
            Sequelize.col("intent")
          ),
          "intent",
        ],
      ],
    });
    res.send(changeSend(getIntents));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getCSATversion2 = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    let queryFind = req.url.includes("getByAgent")
      ? { "$Agent.user_conn$": id }
      : req.url.includes("getByGroup")
      ? { group_id: id }
      : req.url.includes("getByOrganization")
      ? { "$Group.organization_id$": id }
      : { id };
    let queryAgent = req.url.includes("getByAgent") ? { user_conn: id } : {};
    if (start !== undefined && end !== undefined) {
      queryFind["queue_date"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }

    const getIntents = await Transcripts.findAll({
      where: queryFind,

      include: [
        {
          required: true,
          attributes: [],
          model: averageTotal,
        },
        {
          required: true,
          attributes: [],
          model: Agents,
          include: { model: AgentLists, required: true },
        },
        {
          required: true,
          attributes: [],
          model: Notes,
        },
        { required: true, model: Groups, attributes: [] },
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
              include: {
                model: Intents,
                include: [{ model: OrgIntentsConf }],
                attributes: [],
                // where: { active: true },
              },
            },
          ],
        },
      ],

      attributes: [
        [
          Sequelize.fn("COUNT", Sequelize.col("IntentResults.main_intent.id")),
          "csat_count",
        ],
        [
          Sequelize.fn("AVG", Sequelize.col("average_total.csatScore")),
          "csatScore_avg",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("average_total.csatScore")),
          "csatScore_sum",
        ],
        [Sequelize.col("Group.id"), "Group_id"],
        [
          Sequelize.col(
            "IntentResults.main_intent.Intent.OrgIntentsConf.intent"
          ),
          "intent_name",
        ],
        "agent_id",
      ],
      group: ["IntentResults.main_intent.Intent.OrgIntentsConf.id"],
    });
    // let getConfig = await Groups.findAll({
    //   where: queryFind,
    //   include: [{ model: GroupServiceConfig }],
    // });
    let total = {
      total_sum: 0,
      total_average: 0,
      total_count: 0,
      total_per_average: 0,

      total_per_count: 0,
    };
    let totalAverage = 0;
    let totalCalls = 0;
    getIntents.forEach((x) => {
      let v = changeToJson(x);
      total["total_sum"] += v.csatScore_sum;
      total["count"] += v.csat_count;
      total["total_per_average"] += parseFloat(v.csatScore_avg);
      total["total_per_count"] += 1;
      totalAverage += v.csat_count * v.csatScore_avg;
      totalCalls += v.csat_count;
    });
    let average = total["total_per_average"] / total["total_per_count"];
    res.send(
      changeSend({
        total,
        getIntents,
        average: totalAverage / totalCalls,
      })
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getCSATperIntent = async (req, res) => {
  try {
    var { id, start, end } = req.query;
    let queryFind = req.url.includes("getByGroup")
      ? { group_id: id }
      : req.url.includes("getByOrganization")
      ? { "$Group.organization_id$": id }
      : {};
    let queryForAgent = req.url.includes("getByAgent")
      ? { user_conn: parseInt(id) }
      : 1;
    if (start !== undefined && end !== undefined) {
      queryFind["queue_date"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }

    let a = await Transcripts.findAll({
      include: [
        { model: Groups, attributes: [] },
        { model: averageTotal, required: true, attributes: [] },
        {
          model: Agents,
          required: true,
          where: queryForAgent,
          include: { model: AgentLists, required: true },
        },
        {
          required: true,
          model: IntentResult,
          // attributes: [],
          where: { main_intent_id: { [Op.not]: null } },
          include: [
            {
              required: true,
              model: IntentDetails,
              // attributes: [],
              as: "main_intent",
              include: {
                model: Intents,
                include: [{ model: OrgIntentsConf }],
                // attributes: [],
                // where: { active: true },
              },
            },
          ],
        },
      ],
      where: queryFind,
      attributes: [
        [
          Sequelize.fn("COUNT", Sequelize.col("IntentResults.main_intent.id")),
          "count",
        ],
        [
          Sequelize.fn(
            "CONCAT",
            Sequelize.literal(
              "CASE WHEN `IntentResults->main_intent->Intent->OrgIntentsConf`.`active` = 1 THEN '' ELSE 'old ' END"
            ),
            Sequelize.col(
              "IntentResults.main_intent.Intent.OrgIntentsConf.intent"
            )
          ),
          "intent_name",
        ],
        [
          Sequelize.fn("AVG", Sequelize.col("average_total.csatScore")),
          "average",
        ],
        [Sequelize.fn("SUM", Sequelize.col("average_total.csatScore")), "SUM"],
        [Sequelize.col("IntentResults.main_intent.Intent.id"), "idName"],
      ],
      group: ["IntentResults.main_intent.Intent.OrgIntentsConf.id"],
    });
    let toReturn = [];

    a.forEach((val, i) => {
      let v = changeToJson(val);
      let fIndex = toReturn.findIndex((x) => x.intent_name === v.intent_name);
      console.log(fIndex, v);
      if (fIndex === -1) {
        toReturn.push(v);
      } else {
        toReturn[fIndex].count += v.count;
        toReturn[fIndex].average = (toReturn[fIndex].average + v.average) / 2;
      }
    });
    res.send(changeSend(toReturn));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getCSATPerKPI = async (req, res) => {
  try {
    var { id, start, end } = req.query;
    let queryFind = req.url.includes("getByGroup")
      ? { group_id: id }
      : req.url.includes("getByOrganization")
      ? {}
      : {};
    if (start !== undefined && end !== undefined) {
      queryFind["queue_date"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }
    let Orgfind = req.url.includes("getByOrganization")
      ? { organization_id: id }
      : 1;
    let queryAgent = req.url.includes("getByAgent") ? { user_conn: id } : {};
    let a = await KpiAnylsis.findAll({
      include: [
        {
          model: Transcripts,
          required: true,
          where: queryFind,
          attributes: [],
          include: [
            {
              model: Agents,
              required: true,
              where: queryAgent,
              attributes: [],
            },
            {
              model: Notes,
              required: true,
              attributes: [],
            },
            {
              model: Groups,
              required: true,
              where: Orgfind,
              attributes: [],
            },
            { model: averageTotal, required: true, attributes: [] },
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
                  include: {
                    model: Intents,
                    attributes: [],
                    include: [{ model: OrgIntentsConf }],
                  },
                },
              ],
            },
          ],
        },
      ],
      attributes: [
        // [
        //   Sequelize.fn(
        //     "COUNT",
        //     Sequelize.col("Transcripts.IntentResults.main_intent.id")
        //   ),
        //   "count",
        // ],
        [
          Sequelize.fn(
            "CONCAT",
            Sequelize.literal(
              "CASE WHEN `Transcript->IntentResults->main_intent->Intent->OrgIntentsConf`.`active` = 1 THEN '' ELSE 'old ' END"
            ),
            Sequelize.col(
              "Transcript.IntentResults.main_intent.Intent.OrgIntentsConf.intent"
            )
          ),
          "intent_name",
        ],
        [Sequelize.col("kpi"), "kpi_name"],
        [Sequelize.fn("COUNT", Sequelize.col("rating")), "Count"],
        [Sequelize.fn("AVG", Sequelize.col("rating")), "average"],
        [Sequelize.fn("SUM", Sequelize.col("rating")), "SUM"],
      ],
      group: ["kpi_name", "intent_name"],
    });
    // let a = await Transcripts.findAll({
    //   include: [
    //     {
    //       required: true,
    //       model: KpiAnylsis,
    //       // attributes: [],
    //     },
    //     { model: Groups, attributes: [] },
    //     { model: averageTotal, required: true, attributes: [] },
    //     {
    //       required: true,
    //       model: IntentResult,
    //       attributes: [],
    //       where: { main_intent_id: { [Op.not]: null } },
    //       include: [
    //         {
    //           required: true,
    //           model: IntentDetails,
    //           attributes: [],
    //           as: "main_intent",
    //           include: { model: Intents, attributes: [] },
    //         },
    //       ],
    //     },
    //   ],
    //   where: queryFind,
    //   attributes: [
    //     [
    //       Sequelize.fn("COUNT", Sequelize.col("IntentResults.main_intent.id")),
    //       "count",
    //     ],
    //     [
    //       Sequelize.fn(
    //         "CONCAT",
    //         Sequelize.literal('CASE WHEN active THEN "" ELSE "Old " END'),
    //         Sequelize.col("IntentResults.main_intent.Intent.intent")
    //       ),
    //       "intent_name",
    //     ],
    //     [Sequelize.col("KpiAnylses.kpi"), "kpi_name"],
    //     [Sequelize.fn("AVG", Sequelize.col("KpiAnylses.rating")), "average"],
    //     [Sequelize.fn("SUM", Sequelize.col("KpiAnylses.rating")), "SUM"],
    //   ],
    //   group: ["KpiAnylses.kpi"],
    // });

    res.send(changeSend({ a }));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getCSATAgentScoreCard = async (req, res) => {
  try {
    var { id, start, end, intent } = req.query;
    let queryFind = req.url.includes("getByGroup")
      ? { group_id: id }
      : req.url.includes("getByOrganization")
      ? {}
      : {};

    if (start !== undefined && end !== undefined) {
      queryFind["queue_date"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }
    console.log(queryFind);
    let queryAgent = req.url.includes("getByAgent") ? { user_conn: id } : {};

    let Orgfind = req.url.includes("getByOrganization")
      ? { organization_id: parseInt(id) }
      : 1;

    let a = await KpiAnylsis.findAll({
      include: [
        {
          model: Transcripts,
          required: true,
          where: queryFind,
          // attributes: ["agent_id", "IntentResults"],
          attributes: [],
          include: [
            {
              model: Agents,
              required: true,
              attributes: [[Sequelize.col("user_conn"), "agent_id"]],
              where: queryAgent,
              include: { model: AgentLists, required: true },
            },
            {
              model: Groups,
              required: true,
              where: Orgfind,
              attributes: [],
            },

            { model: averageTotal, required: true, attributes: [] },
            { model: Notes, required: true, attributes: [] },
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
                  include: {
                    required: true,
                    model: Intents,

                    include: [
                      {
                        model: OrgIntentsConf,
                        where: {
                          id: intent,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      ],
      attributes: [
        // [
        //   Sequelize.fn(
        //     "COUNT",
        //     Sequelize.col("Transcripts.IntentResults.main_intent.id")
        //   ),
        //   "count",
        // ],

        [Sequelize.col("Transcript.id"), "transcript_id"],
        [Sequelize.col("Transcript.Agent.AgentList.fullname"), "agent_name"],
        [Sequelize.fn("AVG", Sequelize.col("csatScore")), "csatAverage"],
        [
          Sequelize.fn("AVG", Sequelize.col("complianceScore")),
          "complianceAverage",
        ],

        [Sequelize.col("kpi"), "kpi_name"],
        [Sequelize.fn("COUNT", Sequelize.col("Transcript.id")), "Count"],
        [Sequelize.fn("AVG", Sequelize.col("rating")), "average"],
        [Sequelize.fn("SUM", Sequelize.col("rating")), "SUM"],
        [Sequelize.fn("SUM", Sequelize.col("rating")), "SUM"],
        [Sequelize.col("Transcript.Agent.user_conn"), "Agent_id"],
        [
          Sequelize.fn(
            "CONCAT",
            Sequelize.literal(
              "CASE WHEN `Transcript->IntentResults->main_intent->Intent->OrgIntentsConf`.`active` = 1 THEN '' ELSE 'old ' END"
            ),
            Sequelize.col(
              "Transcript.IntentResults.main_intent.Intent.OrgIntentsConf.intent"
            )
          ),
          "intent_name",
        ],
      ],
      group: [
        "kpi_name",
        "Transcript.Agent.user_conn",
        "Transcript.IntentResults.main_intent.Intent.OrgIntentsConf.id",
      ],
    });
    let agentFindQuery = !req.url.includes("getByOrganization")
      ? { agent_group_id: id }
      : { "$AgentList.organization_id$": id };
    let toSend = [];
    let getAgents = await Agents.findAll({
      where: agentFindQuery,
      include: [{ model: AgentLists, required: true }],
      raw: true,
    });

    a.forEach((v, i) => {
      let temp = {};
      let val = changeToJson(v);

      let findUser = toSend.findIndex((x) => x.user_id === val.Agent_id);

      if (findUser === -1) {
        temp["csatAverage"] = val.csatAverage;
        temp["user_id"] = val.Agent_id;
        temp["agent_id"] = val.Agent_id;
        temp["agent_name"] = val.agent_name;
        temp["complianceAverage"] = val.complianceAverage;
        temp["calls"] = val.Count;
        temp["kpi"] = [val];
        temp["t_id"] = [val.transcript_id];
        temp["i"] = i;
        toSend.push(temp);
      } else {
        toSend[findUser]["csatAverage"] =
          (toSend[findUser]["csatAverage"] + val.csatAverage) / 2;
        toSend[findUser]["complianceAverage"] =
          (toSend[findUser]["complianceAverage"] + val.complianceAverage) / 2;

        toSend[findUser]["kpi"].push(val);
        if (!toSend[findUser]["t_id"].includes(val.transcript_id)) {
          toSend[findUser]["calls"] += val.Count;
          toSend[findUser]["t_id"].push(val.transcript_id);
        }
      }
    });

    res.send(changeSend(toSend));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getCSATPerPeriod = async (req, res) => {
  try {
    const { start, end, id } = req.query;
    let queryFind = req.url.includes("getByGroup")
      ? { group_id: id }
      : req.url.includes("getByOrganization")
      ? { "$Group.organization_id$": id }
      : {};
    if (start !== undefined && end !== undefined) {
      queryFind["createdAt"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }
    let queryAgent = req.url.includes("getByAgent") ? { user_conn: id } : {};

    let formatDateDesign =
      moment(start).diff(moment(end), "day") !== 0 && end === undefined
        ? [
            Sequelize.fn(
              "date_format",
              Sequelize.col("queue_date"),
              "%m/%d/%y"
            ),
            "formattedCreatedAt",
          ]
        : [
            Sequelize.fn(
              "date_format",
              Sequelize.col("queue_date"),
              "%m/%d/%y %l %p"
            ),

            "formattedCreatedAt",
          ];
    let a = await Transcripts.findAll({
      where: queryFind,
      include: [
        { model: Groups, required: true, attributes: [] },
        { model: averageTotal, required: true, attributes: [] },
        { model: Notes, required: true, attributes: [] },
        { model: Agents, required: true, attributes: [], where: queryAgent },
      ],
      attributes: [
        formatDateDesign,
        [Sequelize.fn("COUNT", Sequelize.col("Transcripts.id")), "count"],
        [
          Sequelize.fn("AVG", Sequelize.col("average_total.csatScore")),
          "average",
        ],
      ],
      group: ["formattedCreatedAt"],
    });
    res.send(changeSend(a));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const ListOftranscript = async (req, res) => {
  try {
    const { id, start, end } = req.body;
    let groupSearch = req.url.includes("getByGroup")
      ? { id: id }
      : req.url.includes("getByOrganization")
      ? { organization_id: id }
      : 1;
    let transcriptdate = {};
    if (start !== undefined && end !== undefined) {
      transcriptdate["queue_date"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }
    let agentSearch = req.url.includes("getByAgent") ? { user_conn: id } : 1;
    console.log(groupSearch, transcriptdate, agentSearch);
    let getQueue = await Queue.findAll({
      where: transcriptdate,

      order: [["id", "ASC"]],
      include: [
        {
          model: Query,
          // limit: 1,

          required: true,

          include: [
            {
              model: Transcripts,
              required: true,
              include: [
                {
                  model: Groups,
                  required: true,
                  where: groupSearch,
                },
                { model: StoredSpeech, required: true },
                { model: Notes, required: true, attributes: [] },
                { model: SentimentAnylsis, required: true },
                {
                  where: agentSearch,
                  model: Agents,
                  required: true,
                  include: { model: AgentLists, required: true },
                },
                { model: averageTotal, required: true },
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
            },
          ],
        },
      ],
      group: ["Queries.transcript_id"],
    });
    let toSend = [];
    getQueue.forEach(async (v) => {
      let temp = {
        name: "",
        queue_date: v.queue_date,
        callerid: v.callerid,
        call_type: v.call_type,
        number_dialled: v.number_dialled,
        id: null,
        agent: "",
      };
      v.Queries.forEach(async (vv, i) => {
        let getT = vv.Transcripts[0];
        if (temp["id"] === null) temp["id"] = getT.id;
        if (getT.average_total.complianceScore === null) {
          let a = await Compliance.findOne({
            where: { Transcript_id: getT.id },
          });
          let b = changeToJson(a);
          await averageTotal.update(
            { complianceScore: parseFloat(b.score) },
            { where: { transcript_id: getT.id } }
          );
        }
        temp["compliance"] = getT.average_total.complianceScore;
        temp["csat"] = getT.average_total.csatScore;
        temp["intent"] = getT.IntentResults[0].main_intent.intent_name;
        temp["sentiment"] = getT.SentiAnylses[0].sentiment_name;
        temp["call_duration"] = getT.StoredSpeeches[0].duration;
        temp["agent"] +=
          i === 0
            ? getT.Agent.AgentList.fullname
            : `,${getT.Agent.AgentList.fullname}`;
        temp["name"] +=
          i === 0
            ? getT.Agent.AgentList.fullname
            : `,${getT.Agent.AgentList.fullname}`;
      });
      toSend.push(temp);
    });

    res.send(changeSend(toSend));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getIntentV2 = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    let queryfind = req.url.includes("getByGroup")
      ? { group_id: id }
      : req.url.includes("getByOrganization")
      ? { "$Group.organization_id$": id }
      : { "$Agent.user_conn$": id };

    if (start !== undefined && end !== undefined) {
      queryfind["queue_date"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }

    let formatDateDesign =
      moment(start).diff(moment(end), "day") !== 0 || end === undefined
        ? [
            Sequelize.fn(
              "date_format",
              Sequelize.col("queue_date"),
              "%m/%d/%y"
            ),
            "formattedCreatedAt",
          ]
        : [
            Sequelize.fn(
              "date_format",
              Sequelize.col("queue_date"),
              "%m/%d/%y %l %p"
            ),

            "formattedCreatedAt",
          ];
    let a = await Transcripts.findAll({
      where: queryfind,
      include: [
        { model: Groups, required: true, attributes: [] },
        { model: Notes, required: true, attributes: [] },
        { model: Agents, required: true, attributes: [] },
        {
          model: Agents,
          required: true,
          attributes: [],
          include: { model: AgentLists },
        },
        {
          required: true,
          model: IntentResult,
          attributes: [],
          // attributes: ["main_intent_id", "sub_intent_id", "id"],
          include: [
            {
              model: IntentDetails,
              // attributes: [],
              as: "main_intent",
              include: {
                required: false,
                model: Intents,
                attributes: ["id", "intent", "desc", "script", "data"],
                where: { active: true },
              },
            },
          ],
        },
      ],
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("Transcripts.id")), "count"],
        [Sequelize.col("IntentResults.main_intent.intent_name"), "name"],
        [Sequelize.col("Agent.AgentList.fullname"), "agent_name"],
        [Sequelize.col("Agent.AgentList.id"), "user_id"],
        formatDateDesign,
      ],
      group: ["name", "user_id", "formattedCreatedAt"],
      // limit: 1,
    });
    let perAgent = [];
    let IntentPerPeriod = [];
    let totalPerIntent = [];
    a.forEach((val) => {
      let v = changeToJson(val);
      let fPP = IntentPerPeriod.findIndex(
        (x) =>
          x.formattedCreatedAt === v.formattedCreatedAt && v.name === x.name
      );
      if (fPP !== -1) {
        IntentPerPeriod[fPP].count += v.count;
      } else {
        IntentPerPeriod.push({
          formattedCreatedAt: v.formattedCreatedAt,
          name: v.name,
          count: v.count,
        });
      }
      let fPA = perAgent.findIndex((x) => v.user_id === x.user_id);
      if (fPA !== -1) {
        console.log(v.name, v.agent_name);
        perAgent[fPA]["intents"][v.name] += v.count;
        let a = perAgent[fPA]["intents"].findIndex((x) => x.name === v.name);
        if (a !== -1) perAgent[fPA]["intents"][a].count += v.count;
        else {
          perAgent[fPA]["intents"].push({ name: v.name, count: v.count });
        }
      } else {
        // console.log(v.name, v.agent_name, "else");
        let temp = {
          agent_name: v.agent_name,
          user_id: v.user_id,
          intents: [{ name: v.name, count: v.count }],
        };

        perAgent.push(temp);
      }
      let fPT = totalPerIntent.findIndex((x) => v.name === x.name);
      if (fPT !== -1) {
        totalPerIntent[fPT]["count"] += v.count;
      } else {
        let temp = {
          count: v.count,
          name: v.name,
        };

        totalPerIntent.push(temp);
      }
    });
    res.send(changeSend({ a, IntentPerPeriod, perAgent, totalPerIntent }));
  } catch (err) {
    throw err;
  }
};
export const getIntentDurationCall = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    let queryfind = req.url.includes("getByGroup")
      ? { group_id: id }
      : req.url.includes("getByOrganization")
      ? { "$Group.organization_id$": id }
      : { "$Agent.user_conn$": id };

    if (start !== undefined && end !== undefined) {
      queryfind["queue_date"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }

    let formatDateDesign =
      moment(start).diff(moment(end), "day") !== 0 || end === undefined
        ? [
            Sequelize.fn(
              "date_format",
              Sequelize.col("queue_date"),
              "%m/%d/%y"
            ),
            "formattedCreatedAt",
          ]
        : [
            Sequelize.fn(
              "date_format",
              Sequelize.col("queue_date"),
              "%m/%d/%y %l %p"
            ),

            "formattedCreatedAt",
          ];

    let a = await Transcripts.findAll({
      where: queryfind,
      include: [
        {
          model: StoredSpeech,
          required: true,
          where: { type: 1 },
          attributes: [],
        },
        { model: Groups, required: true, attributes: [] },
        { model: Notes, required: true, attributes: [] },

        {
          model: Agents,
          required: true,
          attributes: [],
          include: { model: AgentLists },
        },
        {
          required: true,
          model: IntentResult,
          attributes: [],
          // attributes: ["main_intent_id", "sub_intent_id", "id"],
          include: [
            {
              model: IntentDetails,
              // attributes: [],
              as: "main_intent",
              include: {
                required: false,
                model: Intents,
                attributes: ["id", "intent", "desc", "script", "data"],
                include: [{ model: OrgIntentsConf }],
              },
            },
          ],
        },
      ],
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("Transcripts.id")), "count"],

        [
          Sequelize.fn(
            "CONCAT",
            Sequelize.literal(
              "CASE WHEN `IntentResults->main_intent->Intent->OrgIntentsConf`.`active` = 1 THEN '' ELSE 'old ' END"
            ),
            Sequelize.col(
              "IntentResults.main_intent.Intent.OrgIntentsConf.intent"
            )
          ),
          "intent_name",
        ],
        [Sequelize.col("Agent.AgentList.fullname"), "agent_name"],
        [Sequelize.col("Agent.AgentList.id"), "user_id"],
        [
          Sequelize.fn("COUNT", Sequelize.col("`StoredSpeeches`.`duration`")),
          "count_duration",
        ],
        [
          Sequelize.fn("AVG", Sequelize.col("`StoredSpeeches`.`duration`")),
          "average_duration",
        ],
        [
          Sequelize.fn("SUM", Sequelize.col("`StoredSpeeches`.`duration`")),
          "Total_duration",
        ],
        // formatDateDesign,
      ],
      group: ["intent_name", "user_id"],
      // limit: 1,
    });
    res.send(changeSend({ a }));
  } catch (err) {
    throw err;
  }
};
export const checkIfContain = async (req, res) => {
  try {
    const { id, start, end } = req.query;
    let queryfind = req.url.includes("getByGroup")
      ? { group_id: id }
      : req.url.includes("getByOrganization")
      ? { "$Group.organization_id$": id }
      : { "$Agent.user_conn$": id };

    if (start !== undefined && end !== undefined) {
      queryfind["queue_date"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }
    let a = await Transcripts.findOne({
      where: queryFind,
      limit: 1,
      include: [
        { model: Groups, required: true },
        { model: Agents, required: true },
      ],
    });
    res.send(changeSend(a !== null));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
