import { changeToJson } from "../../../../helper/helpersHere.js";
import Agents from "../../../../models/Agents.model.js";
import GroupServiceConfig from "../../../../models/GroupServiceConfig.model.js";
import Groups from "../../../../models/Groups.model.js";
import Intents from "../../../../models/Intents.model.js";

export const findAgent = async (id, include) => {
  try {
    const agent = await Agents.findOne({
      where: { user_id: id },
      include: [include],
    });
    if (agent === null) return {};
    else return changeToJson(agent);
  } catch (err) {
    throw err;
  }
};
export const saveToDatabase = async (Table, data) => {
  try {
    console.log(Table, "here");
    let a = await Table.create(data);
    return a;
  } catch (err) {
    throw err;
  }
};
export const updateDataBase = async (Table, where, data) => {
  try {
    let a = await Table.update(data, where);
    return a;
  } catch (err) {
    throw err;
  }
};
export const findTable = async (Table, where, include) => {
  try {
    let query =
      include === undefined
        ? { where: where }
        : { where: where, include: [include] };
    console.log(Table, query);
    let a = await Table.findAll(query);

    return a;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
