import { changeToJson } from "../../../../helper/helpersHere.js";
import { changeSend } from "../../../../helper/toSend.js";
import TranscriptSeperation from "../../../../models/TranscriptSeperation.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import Groups from "../../../../models/Groups.model.js";
import { Sequelize, Op } from "sequelize";
import IntentDetails from "../../../../models/IntentDetails.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import SentimentAnylsis from "../../../../models/SentimentAnylsis.model.js";
import Agents from "../../../../models/Agents.model.js";
import Notes from "../../../../models/Notes.model.js";
import AgentLists from "../../../../models/AgentLists.model.js";
import Intents from "../../../../models/Intents.model.js";
import averageTotal from "../../../../models/averageTotal.model.js";
export const getSeperation = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(id);
    let a = await TranscriptSeperation.findOne({
      where: { transcript_id: id },
    });
    if (a === null) throw new Error("Not found");
    let changeA = changeToJson(a);
    let modifyAgent = null;
    if (changeA.combineSegment === null) {
      modifyAgent = null;
    } else {
      modifyAgent = changeA.combineSegment.map((v) => ({
        agent_message: v.text,
        start: v.start,
        end: v.end,
        id: v.id,
      }));
    }

    let mergetArray = modifyAgent;
    // let modifyCostumer = changeA.costumerSegment.map((v) => ({
    //   customer_message: v.text,
    //   start: v.start,
    //   end: v.end,
    //   id: v.id,
    // }));
    // let mergetArray = [...modifyAgent, ...modifyCostumer];
    // mergetArray.sort((a, b) => a.id - b.id);
    res.send(changeSend(mergetArray));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const textSearch = async (req, res) => {
  try {
    const { text, organization_id, limit, offset } = req.body;
    let concat = [];
    console.log(text.split(" "));
    // if (text.trim().split(" ").length > 1)
    if (text.trim().split(" ").length > 1) {
      concat.push(
        Sequelize.fn(
          "CONCAT",
          " - ",
          Sequelize.literal(
            `SUBSTRING(content,LOCATE('${text}',content)-25,70)`
          ),
          " - "
        )
      );
    }
    text
      .trim()
      .split(" ")
      .forEach((v, i) => {
        if (v !== "")
          concat.push(
            Sequelize.fn(
              "CONCAT",
              " - ",
              Sequelize.literal(
                `SUBSTRING(content,LOCATE('${v}',content)-25,70)`
              ),
              " - "
            )
          );
      });

    let a = await Transcripts.findAll({
      subQuery: false,
      where: {
        [Op.and]: [
          Sequelize.literal(
            `MATCH (content) AGAINST("${text}"  IN BOOLEAN MODE)`
          ),
          { "$Group.organization_id$": organization_id },
        ],
      },

      include: [
        { model: Groups, required: true, attributes: [] },
        { model: Notes, required: true, attributes: [] },
        { model: averageTotal, required: true, attributes: [] },
        { model: SentimentAnylsis, required: true, attributes: [] },
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
              attributes: [],
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
        [Sequelize.col("SentiAnylses.sentiment_name"), "sentiment_name"],
        [Sequelize.col("SentiAnylses.sentiment_name"), "sentiment_name"],
        [Sequelize.col("Agent.AgentList.fullname"), "agent"],
        [Sequelize.col("IntentResults.main_intent.intent_name"), "intent"],
        "queue_date",
        "call_id",
        "callerid",
        "call_id",
        "call_type",
        "id",
        [Sequelize.col("average_total.csatScore"), "csat"],
        [Sequelize.col("average_total.complianceScore"), "compliance"],
        [
          Sequelize.fn(
            "CONCAT",
            "....",
            // Sequelize.literal(
            //   `REGEXP_SUBSTR(content, '.{25}[Japanese|knotweed].{25}')`
            // ),
            ...concat,
            "...."
          ),

          "content",
        ],
      ],
      limit,
      offset: limit * offset,
    });
    let count = await Transcripts.count({
      subQuery: false,
      where: {
        [Op.and]: [
          Sequelize.literal(
            `MATCH (content) AGAINST('"${text}"'  IN BOOLEAN MODE)`
          ),
          { "$Group.organization_id$": organization_id },
        ],
      },

      include: [
        { model: Groups, required: true, attributes: [] },
        { model: Notes, required: true, attributes: [] },
        { model: averageTotal, required: true, attributes: [] },
        { model: SentimentAnylsis, required: true, attributes: [] },
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
              attributes: [],
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
    });
    // Sequelize.literal(`MATCH (content) AGAINST("%${text}%") `),
    console.log(a.length);
    res.send(changeSend({ count, limit, offset, data: a }));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const deleteTranscript = async (req, res) => {
  try {
    const { start, end, organization_id } = req.body;
    console.log(start, end, organization_id);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
