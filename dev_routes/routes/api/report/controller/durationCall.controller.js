import moment from "moment";
import Transcripts from "../../../../models/Transcripts.model.js";
import TranscriptSeperation from "../../../../models/TranscriptSeperation.js";
import { Op, Sequelize } from "sequelize";
import Agents from "../../../../models/Agents.model.js";
import Groups from "../../../../models/Groups.model.js";
import { changeSend } from "../../../../helper/toSend.js";
import Notes from "../../Notes/Notes.js";
import AgentLists from "../../../../models/AgentLists.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import IntentDetails from "../../../../models/IntentDetails.model.js";
import Intents from "../../../../models/Intents.model.js";
import OrgIntentsConf from "../../../../models/OrgIntentsConf.model.js";
import StoredSpeech from "../../../../models/StoredSpeech.model.js";

export const getDurationController = async (req, res) => {
  try {
    const { organization_id, agent, type, date_start, date_end } = req.body;
    let query =
      organization_id !== undefined && organization_id !== null
        ? { "$Group.organization_id$": organization_id }
        : agent !== undefined && agent !== null
        ? { "$Agent.user_conn$": agent }
        : {};
    console.log(organization_id, agent, "here");
    if (date_start !== undefined && date_end !== undefined) {
      query["queue_date"] = {
        [Op.between]: [
          moment(start).startOf("day").format("YYYY-MM-DD HH:mm:ss"),
          moment(end).endOf("day").format("YYYY-MM-DD HH:mm:ss"),
        ],
      };
    }
    let groupby =
      type === "organization"
        ? ["organization_id"]
        : type === "agent"
        ? ["user_id"]
        : [];
    let attributes =
      type === "organization"
        ? [
            [
              Sequelize.col("Agent.AgentList.organization_id"),
              "organization_id",
            ],
            [
              Sequelize.fn(
                "COUNT",
                Sequelize.col("`StoredSpeeches`.`duration`")
              ),
              "count_duration",
            ],
          ]
        : type === "agent"
        ? [
            [Sequelize.col("Agent.AgentList.fullname"), "agent_name"],
            [Sequelize.col("Agent.AgentList.id"), "user_id"],
            [
              Sequelize.col("Agent.AgentList.organization_id"),
              "organization_id",
            ],
            [
              Sequelize.fn(
                "COUNT",
                Sequelize.col("`StoredSpeeches`.`duration`")
              ),
              "count_duration",
            ],
          ]
        : [
            [
              Sequelize.fn(
                "COUNT",
                Sequelize.col("`StoredSpeeches`.`duration`")
              ),
              "count_duration",
            ],
          ];
    let a = await Transcripts.findAll({
      where: query,
      include: [
        {
          model: StoredSpeech,
          required: true,
          where: { type: 1 },
          attributes: [],
        },
        { model: Groups, required: true, attributes: [] },

        {
          model: Agents,
          attributes: [],
          required: true,
          include: { model: AgentLists, attributes: [] },
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
            },
          ],
        },
      ],
      attributes: attributes,
      group: groupby,
    });
    res.send(changeSend(a));
  } catch (err) {
    throw err;
  }
};
