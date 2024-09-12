import { QueryTypes, Sequelize } from "sequelize";
import { changeSend } from "../../../helper/toSend.js";
import Agents from "../../../models/Agents.model.js";
import { changeToJson } from "../../../helper/helpersHere.js";
import { random, saveTable } from "./functions.js";
import Transcripts from "../../../models/Transcripts.model.js";
import IntentResult from "../../../models/IntentResult.model.js";
import IntentDetails from "../../../models/IntentDetails.model.js";
import SentimentAnylsis from "../../../models/SentimentAnylsis.model.js";
import KpiAnylsis from "../../../models/KpiAnylsis.model.js";
import Compliance from "../../../models/Compliance.model.js";
import Notes from "../../../models/Notes.model.js";

var sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  { dialect: process.env.SEQUELIZE_DIALECT }
);
export const convert = async (req, res) => {
  try {
    console.warn(
      `######################### Starting to convert #################`
    );
    let getAgents = await Agents.findAll({});
    let getTranscript = await sequelize.query(
      `SELECT A.content,B.*FROM 
      etpbx_ca_transcripts AS A INNER JOIN etpbx_ca_queue_agents AS B 
      ON B.queue_id = A.queue_id`,
      { type: QueryTypes.SELECT }
    );
    let agentloop = 0;

    getTranscript.forEach(async (v, i) => {
      if (agentloop >= getAgents.length) {
        agentloop = 0;
      }

      let agent = changeToJson(getAgents[random(getAgents.length)]);

      if (true) {
        let transcript_id = await saveTable(
          {
            content: v.content,
            group_id: agent.agent_group_id,
            agent_id: agent.id,
            createdAt: v.createdAt,
          },
          Transcripts
        );
        let getCompliance = await sequelize.query(
          `SELECT * FROM
          etpbx_ca_queue_result_compliances
          WHERE queue_id = ${v.queue_id}`,
          { type: QueryTypes.SELECT }
        );

        if (getCompliance.length !== 0) {
          console.log(getCompliance);
          await saveTable(
            {
              createdAt: getCompliance[0].createdAt,
              explaination: getCompliance[0].description,
              score: getCompliance[0].rating,
              transcript_id,
            },
            Compliance
          );
        }
        let Intents = await sequelize.query(
          `SELECT * FROM
        etpbx_ca_queue_result_intents
          WHERE queue_id = ${v.queue_id}`,
          { type: QueryTypes.SELECT }
        );
        if (Intents.length !== 0) {
          let Intent_id = await IntentDetails.create({
            intent_name: Intents[0].main_intent,
            createdAt: Intents[0].createdAt,
            desc: Intents[0].description,
            score: 1,
          });
          await IntentResult.create({
            transcript_id,
            main_intent_id: Intent_id.id,
            setup_id: v.queue_id,
            createdAt: Intents[0].createdAt,
          });
          // console.log(Intents);
        }

        let Sentiments = await sequelize.query(
          `SELECT * FROM
        etpbx_ca_queue_result_sentiments
          WHERE queue_id = ${v.queue_id}`,
          { type: QueryTypes.SELECT }
        );
        if (Sentiments.length !== 0) {
          let s = Sentiments[0];
          await SentimentAnylsis.create({
            sentiment_name: s.sentiment,
            explanation: s.description,
            setup_id: s.queue_id,
            transcript_id,
            sentiment_score: 90,
          });
        }

        let kpi = await sequelize.query(
          `SELECT * FROM
        etpbx_ca_queue_result_quality_metrics
          WHERE queue_id = ${v.queue_id}`,
          { type: QueryTypes.SELECT }
        );
        if (kpi.length !== 0) {
          kpi.forEach(async (v, i) => {
            // if (!v.rating_str.includes("%")) console.log(v);
            let kpiMetric = await sequelize.query(
              `SELECT * FROM
            etpbx_ca_chat_group_call_quality_metrics
              WHERE id = ${v.quality_metric_id}`,
              { type: QueryTypes.SELECT }
            );
            console.log(kpiMetric);
            KpiAnylsis.create({
              kpi: v.metrictype,
              rating: v.rating_str.includes("%")
                ? v.rating_str
                : `${v.rating_str}%`,
              transcript_id,
              metricsRange: "1-100%",
              setup_id: v.queue_id,
              anaylsis: v.description,
              getWeight: kpiMetric[0].satisfaction_weight,
            });
          });
        }
        let notes = await sequelize.query(
          `SELECT * FROM
          etpbx_ca_queue_result_summaries
          WHERE queue_id = ${v.queue_id}`,
          { type: QueryTypes.SELECT }
        );
        if (notes.length !== 0) {
          Notes.create({ transcript_id, notes: notes[0].content });
        }
      }

      agentloop++;
    });
    console.log("done");
    res.send(changeSend("done"));
  } catch (err) {
    console.warn(err);
    throw err;
  }
};
