import { changeSend } from "../../../../helper/toSend.js";
import Agents from "../../../../models/Agents.model.js";

export const getAgents = async (req, res) => {
  try {
    const { id } = req.query;
    let query = id === undefined || id === "" ? {} : { id };
    let r = await Agents.findAll({ where: query });
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
export const createAgent = async (req, res) => {
  try {
    const { fullname, contact_details, agent_group_id } = req.body;
    let getIfActive = await Agents.findAll({ where: { fullname } });

    if (getIfActive.length !== 0) {
      const error = new Error("User is already created");
      error.statusCode = 400;
      throw error;
    }
    let r = await Agents.create({ fullname, contact_details, agent_group_id });
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
export const updateAgent = async (req, res) => {
  try {
    const { fullname, contact_details, agent_group_id, id } = req.body;
    let r = Agents.update(
      { fullname, contact_details, agent_group_id },
      { where: { id } }
    );
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
