import axios from "axios";
import Groups from "../../../../models/Groups.model.js";
import { Op } from "sequelize";
import { changeSend } from "../../../../helper/toSend.js";
import Agents from "../../../../models/Agents.model.js";
export const createGroup = async (req, res) => {
  try {
    const { name, code, organization_id } = req.body;
    let r = await Groups.findAll({
      where: { [Op.or]: [{ code: "1231" }, { name }] },
    });
    if (r.length !== 0) {
      let error = new Error("Already in the System");
      error.statusCode = 400;
      throw error;
    }
    let create = await Groups.create({ name, code, organization_id });
    res.send(changeSend(create));
  } catch (err) {
    throw err;
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
export const getGroups = async (req, res) => {
  try {
    const { organization_id } = req.query;
    let query = organization_id === "" ? {} : { where: { organization_id } };
    let r = await Groups.findAll(query);
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
export const updateGroup = async (req, res) => {
  try {
    const { name, id } = req.body;
    let r = await Groups.update({ name }, { where: { id } });
    res.send(changeSend(r));
  } catch (err) {
    throw err;
  }
};
