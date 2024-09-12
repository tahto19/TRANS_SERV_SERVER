import { Sequelize } from "sequelize";
import { changeSend } from "../../../../helper/toSend.js";
import Agents from "../../../../models/Agents.model.js";
import Groups from "../../../../models/Groups.model.js";
import Queue from "../../../../models/Queue.model.js";
import { generateUserTranscript } from "../processAI/process.js";
import AgentLists from "../../../../models/AgentLists.model.js";
import axios from "axios";
import { changeFormat, changeToJson } from "../../../../helper/helpersHere.js";

export const getAgents = async (req, res) => {
  try {
    const { id } = req.query;
    if (id === undefined) throw new Error("No id");
    let query =
      id === undefined || id === "" ? {} : { organization_id: parseInt(id) };
    let r = await AgentLists.findAll({ where: query });
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
export const getAgentsWithNoGroup = async (req, res) => {
  try {
    const { id, organization_id } = req.query;
    let query =
      organization_id === undefined || organization_id === ""
        ? {}
        : { organization_id };

    let r = await AgentLists.findAll({
      where: query,
      raw: true,
      include: [{ model: Agents, require: false }],
      attributes: [
        "contact_details",
        "createdAt",
        "fullname",
        "organization_id",
        "user_id",
        [Sequelize.col("Agents.active"), "active"],
        [Sequelize.col("Agents.agent_group_id"), "group_id"],
      ],
      group: ["id"],
    });
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};

export const createAgent = async (req, res) => {
  try {
    const { fullname, contact_details, agent_group_id, user_id } = req.body;

    let r = await Agents.create({
      fullname,
      contact_details,
      agent_group_id,
      user_id,
    });

    let getTotalAgent = await Agents.findAll({
      where: { agent_group_id },
      include: { model: Groups, attributes: [] },
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("Agents.id")), "counts"],
        // "orgnazation_id",

        [Sequelize.col("Group.organization_id"), "organization_id"],
      ],
      group: ["Group.organization_id"],
    });
    let sendToClientside = axios({
      method: "POST",
      url: `${process.env.OUTER_IP_ADDRESS}/report/client/create/logs`,
      body: getTotalAgent,
    });

    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const updateAgent = async (req, res) => {
  try {
    const { fullname, contact_details, agent_group_id, id, user_id } = req.body;
    let r = await Agents.update(
      { fullname, contact_details, agent_group_id, user_id },
      { where: { id } }
    );
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
export const getAllAgent = async (req, res) => {
  try {
    const { id } = req.query;
    let r = await Agents.findAll({
      include: [
        {
          attributes: [],
          model: Groups,
          require: false,
          where: { organization_id: id },
        },
      ],
      attributes: ["fullname", "user_id", "id"],
      group: ["fullname"],
    });
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const autoComplete = async (req, res) => {
  try {
    const { user_id } = req.body;
    let getID = await AgentLists.findOne({
      where: { user_id },
    });
    res.send(changeSend(getID));
  } catch (err) {
    throw err;
  }
};
export const getUserId = async (req, res) => {
  try {
    let getID = await Queue.findAll({
      group: ["user_id"],
      attributes: ["user_id"],
    });
    res.send(changeSend(getID));
  } catch (err) {
    throw err;
  }
};
export const totalAgent = async (req, res) => {
  try {
    let r = await Agents.findAll({
      include: { model: Groups, attributes: [] },
      attributes: [
        [Sequelize.col("Agents.agent_group_id"), "group_id"],
        [Sequelize.fn("COUNT", Sequelize.col("Agents.id")), "counts"],
        // "orgnazation_id",
        [Sequelize.col("Group.organization_id"), "organization_id"],
      ],
      group: ["agent_group_id", "organization_id"],
    });
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const addNewAgent = async (req, res) => {
  try {
    const { fullname, contact_details, user_id, organization_id } = req.body;
    const checkAgent = await AgentLists.findAll({ where: { user_id } });
    console.log(checkAgent);
    if (checkAgent.length !== 0)
      throw new Error("UserId is already in the System");

    let r = await AgentLists.create({
      fullname,
      contact_details,
      user_id,
      organization_id,
    });

    let getTotalAgent = await AgentLists.findAll({
      where: { organization_id },
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("user_id")), "counts"],
        // "orgnazation_id",
      ],
      group: ["organization_id"],
    });
    let re = await axios({
      method: "POST",
      url: `${process.env.OUTER_IP_ADDRESS}/report/client/create/logs`,
      data: { counts: 1, organization_id },
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(re.data);
    res.send(changeSend({ r, data: re.data }));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const updateNewAgent = async (req, res) => {
  try {
    const { fullname, contact_details, user_id, organization_id } = req.body;
    await AgentLists.update(
      {
        fullname,
        contact_details,

        organization_id,
      },
      { where: { user_id } }
    );
    await Agents.update(
      {
        fullname,
        contact_details,
      },
      { where: { user_id } }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAgentsList = async (req, res) => {
  try {
    const { client_id } = req.body;
    let r = await AgentLists.findAll({ where: { organization_id: client_id } });
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAgent = async (req, res) => {
  try {
    const { user_id } = req.body;
    console.log(user_id);
    let r = await AgentLists.findAll({ where: { user_id } });
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getNewAgentList = async (req, res) => {
  try {
    const { account_code, organization_id } = req.body;

    let getID = await Queue.findAll({
      where: { account_code },
      group: ["user_id", "user_group_id"],
      attributes: ["user_id", "user_group_id"],
    });
    let AgentList = [];
    let groupList = [];
    for (let i = 0; i < getID.length; i++) {
      let val = changeToJson(getID[i]);
      let user_id = val.user_id;
      let findAgentInList = -1;

      if (AgentList.length !== 0)
        findAgentInList = AgentList.findIndex(
          (x) => parseInt(x.user_id) === parseInt(val.user_id)
        );
      let findgroup = groupList.findIndex((x) => x === val.user_group_id);
      if (findgroup === -1) {
        console.log(val.user_group_id);
        groupList.push(val.user_group_id);
      }

      if (findAgentInList === -1) {
        let getuser_id_info = await AgentLists.findOne({
          where: { user_id },
        });

        let user = {};
        if (getuser_id_info !== null) user = changeToJson(getuser_id_info);

        user["Groups"] = [val.user_group_id];
        AgentList.push({
          user_id: user_id,
          user_details: user,
        });
      } else {
        AgentList[findAgentInList].user_details.Groups.push(val.user_group_id);
      }
      // let temp = { user_id };
    }

    groupList.forEach(async (v) => {
      let a = await Groups.findOne({
        where: { id: v, organization_id: organization_id },
      });
      let checkIfExists = await Groups.findOne({
        where: { id: v },
      });
      if (a === null && checkIfExists === null) {
        let toInsert = parseInt(v) === 0 ? 1 : v;
        Groups.create({ id: toInsert, name: "", organization_id });
      }
    });
    res.send(changeSend(AgentList));
    // let getAgent = Agents.findAll({ organization_id });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const updateNewAgentList = async (req, res) => {
  try {
    const {
      fullname,
      contact_details,
      user_id,
      organization_id,
      account_code,
    } = req.body;

    let getID = await Queue.findAll({
      where: { account_code, user_id },
      group: ["user_id", "user_group_id"],
      // attributes: ["user_id"],
    });
    let findAgentInList = await AgentLists.findOne({ where: { user_id } });

    if (findAgentInList === null) {
      AgentLists.create({
        user_id,
        fullname,
        contact_details,
        organization_id,
      });
      let re = await axios({
        method: "POST",
        url: `${process.env.OUTER_IP_ADDRESS}/report/client/create/logs`,
        data: { counts: 1, organization_id },
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      let a = await AgentLists.update(
        { fullname, contact_details, organization_id },
        { where: { user_id } }
      );
    }
    for (let i = 0; i < getID.length; i++) {
      let val = changeToJson(getID[i]);
      let user_id = val.user_id;
      let findGroup = await Groups.findAll({
        where: { organization_id, id: val.user_group_id },
      });
      console.log("findGroup");
      console.log(findGroup);
      console.log("findGroup");
      if (findGroup.length !== 0) {
        let getuser_id_info = await Agents.findOne({
          where: { user_id, agent_group_id: val.user_group_id },
        });

        if (getuser_id_info === null) {
          await Agents.create({
            user_id,
            fullname,
            contact_details,
            agent_group_id: val.user_group_id,
          });
        } else {
          // let getAgentInfo = changeToJson(getuser_id_info);
          console.log("here");
          Agents.update(
            { active: true, fullname, contact_details, organization_id },
            { where: { user_id, agent_group_id: val.user_group_id } }
          );
        }
      }
    }
    res.send({ result: "success" });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
