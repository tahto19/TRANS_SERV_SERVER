import { Sequelize } from "sequelize";
import { changeSend } from "../../../../helper/toSend.js";
import Agents from "../../../../models/Agents.model.js";
import Groups from "../../../../models/Groups.model.js";
import Queue from "../../../../models/Queue.model.js";
import { generateUserTranscript } from "../processAI/process.js";
import AgentLists from "../../../../models/AgentLists.model.js";
import axios from "axios";
import { changeFormat, changeToJson } from "../../../../helper/helpersHere.js";
import { Agent } from "../Agent.js";
// old
// export const getAgents = async (req, res) => {
//   try {
//     const { id, active } = req.query;
//     let a = active === "true" ? true : false;
//     if (id === undefined) throw new Error("No id");
//     let query =
//       id === undefined || id === "" ? {} : { organization_id: parseInt(id) };

//     let r = await AgentLists.findAll({
//       where: query,
//       include: [{ model: Agents, where: { active: a }, required: true }],
//     });
//     let toSend = [];
//     if (!a)
//       for (let i = 0; i < r.length; i++) {
//         let v = changeToJson(r[i]);
//         // console.log(v);
//         let findActive = await Agents.findOne({
//           where: { active: !a, user_conn: v.id },
//         });
//         console.log(findActive);
//         if (!findActive) toSend.push(v);
//       }
//     else {
//       toSend = r;
//     }
//     res.send(changeSend(id === undefined ? "No organization found" : toSend));
//   } catch (err) {
//     throw err;
//   }
// };
// new
export const getAgents = async (req, res) => {
  try {
    const { id, active } = req.query;
    let a = active === "true" ? true : false;
    if (id === undefined) throw new Error("No id");
    let query =
      id === undefined || id === "" ? {} : { organization_id: parseInt(id) };

    let r = await AgentLists.findAll({
      where: query,
      include: [
        {
          model: Agents,
          where: { active: a },
          include: { model: Groups, required: false },
          required: false,
        },
      ],
    });
    let toSend = [];

    for (let i = 0; i < r.length; i++) {
      let v = changeToJson(r[i]);
      console.log(v);
      let temp = {
        user_details: { Agent: v.Agent, Groups: [] },
        fullname: v.fullname,
        contact_details: v.contact_details,
        user_id: v.user_id,
        id: v.id,
      };
      v.Agents.forEach((vv) => {
        temp.user_details.Groups.push(vv.Group);
      });
      toSend.push(temp);
    }

    res.send(changeSend(id === undefined ? "No organization found" : toSend));
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
      if (findgroup === -1) groupList.push(val.user_group_id);

      if (findAgentInList === -1) {
        let getuser_id_info = await AgentLists.findOne({
          where: { user_id },
          include: [{ model: Agents, where: { active: true } }],
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
      // console.log(a);
      if (a === null) {
        let a2 = await Groups.findOne({
          where: { id: v },
        });
        if (a2 === null) {
          console.log(a2);
          Groups.create({ id: v, name: "", organization_id });
        }
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
      id,
    } = req.body;

    let getID = await Queue.findAll({
      where: { account_code, user_id },
      group: ["user_id", "user_group_id"],
      // attributes: ["user_id"],
    });
    let findAgentInList;
    let checkIfUserIDExistsAlready = await Agents.findOne({
      where: { user_id },
    });
    if (id === undefined || id === null) {
      findAgentInList = await AgentLists.create({
        user_id,
        fullname,
        contact_details,
        organization_id,
      });

      if (checkIfUserIDExistsAlready === null) {
        let re = await axios({
          method: "POST",
          url: `${process.env.OUTER_IP_ADDRESS}/report/client/create/logs`,
          data: { counts: 1, organization_id },
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    } else {
      findAgentInList = await AgentLists.findOne({ where: { id: id } });
      await AgentLists.update(
        {
          fullname,
          contact_details,
          organization_id,
        },
        { where: { id: id } }
      );
    }

    for (let i = 0; i < getID.length; i++) {
      const val = getID[i];
      let findGroup = await Groups.findAll({
        where: { organization_id, id: val.user_group_id },
      });

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
            user_conn: findAgentInList.id,
          });
        } else if (id === undefined && getuser_id_info !== null) {
          await Agents.create({
            user_id,
            fullname,
            contact_details,
            agent_group_id: val.user_group_id,
            user_conn: findAgentInList.id,
          });
        } else {
          // let getAgentInfo = changeToJson(getuser_id_info);
          Agents.update(
            { fullname, contact_details, organization_id, active: true },
            {
              where: {
                user_id,
                agent_group_id: val.user_group_id,
                user_conn: id,
              },
            }
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
export const changeUserInUserID = async (req, res) => {
  try {
    const {
      user_id,
      fullname,
      contact_details,
      main_user_id,
      organization_id,
    } = req.body;
    //  deactivate old user_id

    if (!main_user_id) {
      let agentInfo = await AgentLists.create({
        fullname,
        contact_details,
        user_id,
        organization_id,
      });
      let id = agentInfo.id;
      const r = await Agents.findAll({ where: { user_id, active: true } });
      r.forEach(async (val) => {
        let v = changeToJson(val);

        await Agents.update({ active: false }, { where: { id: v.id } });
        let findExists = await Agents.create({
          user_id,
          fullname,
          contact_details,
          user_conn: id,
          organization_id,
          agent_group_id: v.agent_group_id,
        });
      });
      await AgentLists.update(
        {
          user_id: "",
        },
        { where: { id: r.id } }
      );
    } else {
      const r = await Agents.findAll({
        where: { user_id: user_id, active: true },
      });
      await AgentLists.update(
        {
          user_id: "",
        },
        { where: { id: r[0].user_conn } }
      );
      await AgentLists.update(
        {
          user_id,
        },
        { where: { id: main_user_id } }
      );
      r.forEach(async (val) => {
        let v = changeToJson(val);

        await Agents.update({ active: false }, { where: { id: v.id } });
        let getIfExists = await Agents.findOne({
          where: {
            user_id: v.user_id,
            agent_group_id: v.agent_group_id,
            user_conn: main_user_id,
          },
        });
        if (!getIfExists) {
          await Agents.create({
            user_id,
            fullname,
            contact_details,
            user_conn: main_user_id,
            organization_id,
            agent_group_id: v.agent_group_id,
          });
        } else {
          await Agents.update(
            {
              active: true,
              fullname,
              contact_details,
            },
            { where: { id: getIfExists.id } }
          );
        }
      });
      // await Agents.update(
      //   { active: false },
      //   { where: { user_id, active: true } }
      // );
      // await Agents.update(
      //   { active: true },
      //   {
      //     where: { user_conn: main_user_id, user_id, active: false },
      //   }
      // );
    }
    res.send(changeSend({ message: "Successfully" }));
    // await Agents.update({ where: { user_id } },{active:false});
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const switchUserID = async (req, res) => {
  try {
    const { id1, id2, organization_id } = req.body;
    const getFirst = await AgentLists.findOne({
      where: { id: id1 },
      include: [{ model: Agents, where: { active: true } }],
    });
    const getSeconds = await AgentLists.findOne({
      where: { id: id2 },
      include: [{ model: Agents, where: { active: true } }],
    });

    if (!getFirst || !getSeconds) throw new Error("Not Found users");
    const s_details = changeToJson(getSeconds);
    const f_details = changeToJson(getFirst);
    const f = f_details.Agents;
    const s = s_details.Agents;
    var user_id1 = s_details.user_id;
    var user_id2 = f_details.user_id;
    f.forEach(async (v, i) => {
      if (v.active) {
        let getSecond = await Agents.findOne({
          where: {
            user_id: v.user_id,
            agent_group_id: v.agent_group_id,
            user_conn: s_details.id,
          },
        });

        if (getSecond !== null) {
          let id = changeToJson(getSecond).id;
          await Agents.update(
            {
              active: true,
            },
            { where: { id: id } }
          );
        } else {
          await Agents.create({
            user_id: v.user_id,
            agent_group_id: v.agent_group_id,
            user_conn: s_details.id,
            fullname: s_details.fullname,
            contact_details: s_details.contact_details,
          });
        }
      }

      await Agents.update({ active: false }, { where: { id: v.id } });
    });
    s.forEach(async (v, i) => {
      if (v.active) {
        let getFirst = await Agents.findOne({
          where: {
            user_id: v.user_id,
            agent_group_id: v.agent_group_id,
            user_conn: f_details.id,
          },
        });

        if (getFirst !== null) {
          let id = changeToJson(getFirst).id;
          await Agents.update(
            {
              active: true,
            },
            { where: { id } }
          );
          // console.log(r, id, "second", v.user_id, changeToJson(getFirst));
        } else {
          await Agents.create({
            user_id: v.user_id,
            agent_group_id: v.agent_group_id,
            user_conn: f_details.id,
            fullname: f_details.fullname,
            contact_details: f_details.contact_details,
          });
        }

        let r = await Agents.update({ active: false }, { where: { id: v.id } });
      }
    });

    let r = await AgentLists.update(
      { user_id: user_id2 },
      {
        where: { id: id2 },
      }
    );
    let r3 = await AgentLists.update(
      { user_id: user_id1 },
      {
        where: { id: id1 },
      }
    );
    res.send(changeSend({ getSeconds, getFirst, data: { r, r3 } }));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getAgentDetails = async (req, res) => {
  try {
    const { id, organization_id } = req.query;
    let a = await AgentLists.findOne({
      where: { id },
      include: [
        {
          model: Agents,
          attributes: [
            "agent_group_id",
            "active",
            "user_id",
            [Sequelize.literal("`Agents->Group`.`name`"), "group_name"],
          ],
          include: {
            model: Groups,
            attributes: [],
            where: { organization_id },
          },
        },
      ],
      attributes: [
        [Sequelize.col("AgentLists.user_id"), "active_user_id"],
        "fullname",
        "organization_id",
        "contact_details",
        "id",
      ],
    });
    res.send(changeSend(a));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const dropAgent = async (req, res) => {
  try {
    const { organization_id, id, user_id } = req.body;
    if (id === undefined || user_id === undefined)
      throw new Error("user id or id not found");
    let r = await AgentLists.findOne({
      where: { id },
      include: [{ model: Agents, where: { user_id, active: true } }],
    });
    if (r === null) throw new Error("No Agent Found");

    await Agents.update(
      { active: false },
      { where: { user_id, user_conn: id, active: true } }
    );
    await AgentLists.update({ user_id: null }, { where: { id } });
    res.send(changeSend("success"));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
