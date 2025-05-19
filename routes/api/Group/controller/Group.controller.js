import axios from "axios";
import Groups from "../../../../models/Groups.model.js";
import { Op } from "sequelize";
import { changeSend } from "../../../../helper/toSend.js";
import Agents from "../../../../models/Agents.model.js";
import AgentLists from "../../../../models/AgentLists.model.js";
import { changeToJson } from "../../../../helper/helpersHere.js";
import { generateUserTranscript } from "../../Agent/processAI/process.js";
import { createConfig } from "../../Config/helper/createConfig..js";
import Queue from "../../../../models/Queue.model.js";

// old

// export const createGroup = async (req, res) => {
//   try {
//     const { name, organization_id, id } = req.body;
//     let r = await Groups.findAll({
//       where: { [Op.or]: [{ id }] },
//     });
//     if (r.length !== 0) {
//       let error = new Error("Already in the System");
//       error.statusCode = 400;
//       throw error;
//     }
//     let create = await Groups.create({ id, name, organization_id });
//     res.send(changeSend(create));
//   } catch (err) {
//     console.log(err);
//     res.status(200).send({ result: "error", message: err.message });
//   }
// };

// new
export const createGroup = async (req, res) => {
  const { name, organization_id, id, agents } = req.body;
  try {
    let r = await Groups.findAll({
      where: { [Op.or]: [{ id }] },
    });
    if (r.length !== 0) {
      let r = await Groups.update({ name }, { where: { id } });
    } else {
      let create = await Groups.create({
        id,
        name,
        organization_id,
        group_id: id,
      });
    }
    let agentThatDidntadd = [];
    let agentadded = [];
    for (let i = 0; i < agents.length; i++) {
      let v = agents[i];
      let a = await AgentLists.findOne({ where: { id: v } });

      if (a === null) {
        agentThatDidntadd.push(v);
      } else {
        let a_info = changeToJson(a);

        let r = await Agents.create({
          user_conn: v,
          user_id: a_info.user_id,
          fullname: a_info.fullname,
          agent_group_id: id,
          contact_details: a_info.contact_details,
        });
        agentadded.push(r);
      }
    }

    res.send(changeSend({ agentThatDidntadd, agents, agentadded }));
  } catch (err) {
    console.log(err);
    res.status(200).send({ result: "error", message: err.message });
  }
};
export const getGroupInfo = async (req, res) => {
  try {
    const { id } = req.body;
    let r = await Groups.findByPk(id);
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
export const getUsersByGroupId = async (req, res) => {
  try {
    const { agent_group_id } = req.body;
    let r = await Groups.findAll({
      where: { id: agent_group_id },
      include: [
        {
          model: Agents,
          require: false,
          attributes: ["fullname", "contact_details", "id"],
        },
      ],
    });
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
// old
// export const getGroups = async (req, res) => {
//   try {
//     const { organization_id } = req.query;
//     // name: { [Op.not]: "" }
//     let query = organization_id === "" ? {} : { where: { organization_id } };
//     let r = await Groups.findAll(query);
//     res.send(changeSend(r));
//   } catch (err) {
//     throw err;
//   }
// };
// new
export const getGroups = async (req, res) => {
  try {
    const { organization_id } = req.query;
    let query =
      organization_id === "" ? {} : { organization_id, name: { [Op.not]: "" } };
    let r = await Groups.findAll({
      where: query,
      include: [
        { model: Agents, require: false, include: { model: AgentLists } },
      ],
    });
    let toSend = r.map((v) => {
      let temp = {
        name: v.name,
        organization_id: v.organization_id,
        id: v.id,
        Agents: [],
      };
      v.Agents.forEach((vv) => {
        // let temp = vv.AgentList;

        if (vv.active) temp.Agents.push(vv.AgentList);
      });
      return temp;
    });
    res.send(changeSend(toSend));
  } catch (err) {
    throw err;
  }
};
export const updateGroup = async (req, res) => {
  try {
    const { name, id, organization_id } = req.body;
    let r = await Groups.update({ name }, { where: { id } });
    await createConfig(id, organization_id, null, null);
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
export const getUsersByGroupIdWithTranscripts = async (req, res) => {
  try {
    const { agent_group_id } = req.body;
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
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
export const agentJoinGroup = async (req, res) => {
  try {
    const { id, organization_id, agents, action, name } = req.body;

    let group_id = id;
    if (action === "Edit") {
      let getGroup = await Groups.findAll({ where: { id } });
      if (getGroup.length === 0) {
        throw new Error("No Group Found");
      }

      if (agents !== undefined) {
        let notIn = [];
        for (let i = 0; i < agents.length; i++) {
          let v = agents[i];
          notIn.push(v.user_id);
        }
        let queryOfDeActive =
          notIn.length === 0
            ? {
                agent_group_id: id,
                active: true,
              }
            : {
                user_id: { [Op.notIn]: notIn },
                agent_group_id: id,
                active: true,
              };
        // de activate users
        let a = await Agents.update(
          { active: false },
          {
            where: queryOfDeActive,
          }
        );
      }

      let changeDone = await Groups.findAll({ where: { name, id } });
      if (changeDone === 0) {
        await Groups.update({ name }, { where: { id } });
      }
    } else if (action === "Add") {
      let createGroup = await Groups.create({
        organization_id,
        name,
        id: id === "" ? null : id,
      });
      group_id = createGroup.id;
      await createConfig(createGroup.id, organization_id, null, null);
    }
    // create user
    if (agents !== undefined) {
      for (let i = 0; i < agents.length; i++) {
        let v = agents[i];
        let findAgent = await Agents.findOne({
          where: { user_id: v.user_id, agent_group_id: group_id },
        });
        console.log(findAgent);
        if (findAgent) {
          let agent = changeToJson(findAgent);
          if (!agent.active) {
            await Agents.update(
              { active: true },
              { where: { user_id: v.user_id, agent_group_id: group_id } }
            );
            await generateUserTranscript(v.user_id, group_id);
          }
        } else {
          await Agents.create({
            user_id: v.user_id,
            fullname: v.fullname,
            agent_group_id: group_id,
            contact_details: v.contact_details,
          });
          // this is where generate ai works if user has already in queue

          await generateUserTranscript(v.user_id, group_id);
        }
      }
    }

    res.send(changeSend("a"));
  } catch (err) {
    console.log(err);
    throw err.message;
  }
};

export const createGroupV2 = async (req, res) => {
  try {
    const { name, organization_id } = req.body;
    // let r = await Groups.findAll({
    //   where: { [Op.or]: [{ name }] },
    // });
    // if (r.length !== 0) {
    //   let error = new Error("Already in the System");
    //   error.statusCode = 400;
    //   throw error;
    // }
    let create = await Groups.create({ name, organization_id });
    await createConfig(create.id, organization_id, null, null);
    res.send(changeSend(create));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getListOfGroupsNotAdded = async (req, res) => {
  try {
    const { account_code, organization_id } = req.body;
    let getID = await Queue.findAll({
      where: { account_code },
      group: ["user_group_id"],
      attributes: ["user_group_id"],
    });
    let groups = [];
    getID.forEach((v) => {
      let val = changeToJson(v);
      groups.push(val);
    });
    let a = Groups.findAll({ id: { [Op.not]: groups } });
    res.send(changeSend(a));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const update2 = async (req, res) => {
  const { name, organization_id, id, agents } = req.body;
  try {
    let r = await Groups.findAll({
      where: { id, organization_id },
    });
    if (r.length === 0) {
      let error = new Error("Not Found");
      error.statusCode = 400;
      throw error;
    }
    // find user that is not in the list
    let agentThatDidntadd = [];
    for (let i = 0; i < agents.length; i++) {
      let v = agents[i];
      let a = await AgentLists.findOne({ where: { id: v } });

      if (a === null) {
        agentThatDidntadd.push(v);
      } else {
        let a_info = changeToJson(a);
        let findAgentWithExistingGroup = await Agents.findOne({
          where: {
            user_conn: v,
            user_id: a_info.user_id,
            agent_group_id: id,
          },
        });
        if (findAgentWithExistingGroup === null) {
          await Agents.create({
            user_conn: v,
            user_id: a_info.user_id,
            fullname: a_info.fullname,
            agent_group_id: id,
            contact_details: a_info.contact_details,
          });
        } else {
          let findAgentWithExistingGroupInfo_info = changeToJson(
            findAgentWithExistingGroup
          );
          if (!findAgentWithExistingGroupInfo_info.active) {
            await Agents.update(
              { active: true },
              { where: { user_id: v.user_id, agent_group_id: id } }
            );
          }
        }
      }
    }

    let c = await Groups.update(
      { name: name },
      {
        where: { id, organization_id },
      }
    );
    console.log("deactivating all agents that is not in the list");
    let a = await Agents.update(
      { active: false },
      {
        where: {
          user_conn: { [Op.notIn]: agents },
          agent_group_id: id,
        },
      }
    );
    res.send(changeSend({ agentThatDidntadd, c, a }));
  } catch (err) {
    console.log(err);
    res.status(200).send({ result: "error", message: err.message });
  }
};
