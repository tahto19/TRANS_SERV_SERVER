import moment from "moment";
import { changeSend } from "../../../../helper/toSend.js";
import GroupServiceConfig from "../../../../models/GroupServiceConfig.model.js";
import Intents from "../../../../models/Intents.model.js";

export const getData = async (req, res) => {
  try {
    const { groupId } = req.query;

    let r = await GroupServiceConfig.findOne({
      where: { groupId },
      include: [
        {
          required: false,
          model: Intents,
          attributes: ["id", "intent", "desc", "script", "data"],
          where: { active: true },
        },
      ],
    });

    let toSend = r;

    if (r === null) {
      toSend = await GroupServiceConfig.create({ groupId });
    }
    console.log(toSend);
    res.send(changeSend(toSend));
  } catch (err) {
    throw err;
  }
};

export const createData = async (req, res) => {
  try {
    const { groupId, intent, desc, script, data } = req.body;

    let findIfExists = await GroupServiceConfig.findOne({ where: { groupId } });

    if (findIfExists === null) throw new Error("Something went wrong");
    let createIntent = await Intents.create({
      intent,
      desc,
      data,
      script,
      GroupServicePKey: findIfExists.id,
    });
    res.send(changeSend({ createIntent }));
  } catch (err) {
    console.log(err);
    res.code(406).send(err.message);
  }
};

export const deleteData = async (req, res) => {
  try {
    const { id, data, desc, intent, script } = req.body;
    let changeActive = await Intents.update(
      { active: false },
      { where: { id } }
    );
    console.log(changeActive);
    res.send(changeSend(changeActive));
  } catch (err) {
    console.log(err);
    res.code(err.code).send(err.message);
  }
};
export const updateData = async (req, res) => {
  try {
    const { id, data, desc, intent, script } = req.body;
    let changeActive = await Intents.update(
      { data, desc, intent, script },
      { where: { id } }
    );
    res.send(changeSend(changeActive));
  } catch (err) {
    res.code(err.code).send(err.message);
  }
};
export const autoCompleteData = async (req, res) => {
  try {
    const { groupId } = req.query;
    console.log(groupId);
    let r = await GroupServiceConfig.findOne({
      where: { groupId },
      include: [
        {
          required: false,
          model: Intents,
          attributes: ["id", "intent", "desc", "script", "data"],
          where: { active: true },
        },
      ],
    });
    let temp = [];

    r.Intents.forEach((x) => {
      x.data.forEach((xx) => {
        console.log(xx);
        let find = temp.find((xt) => {
          console.log(
            xt,
            xx,
            "toFind",
            xt.call_quality.toUpperCase() === xx.call_quality.toUpperCase() &&
              xt.metric_desc === xx.metric_desc
          );
          return (
            xt.call_quality.toUpperCase() === xx.call_quality.toUpperCase() &&
            xt.metric_desc.toUpperCase() === xx.metric_desc.toUpperCase() &&
            parseInt(xt.cust_sat_weight) === parseInt(xx.cust_sat_weight)
          );
        });

        if (find === undefined) temp.push(xx);
      });
    });
    res.send(changeSend(temp));
  } catch (err) {
    console.log(err.code);
    res.code(400).send(err.message);
  }
};
export const metricsOnchange = async (req, res) => {
  try {
    const { groupId, metricRange } = req.body;
    const r = await GroupServiceConfig.update(
      { metricRange },
      { where: { groupId } }
    );
    res.send(changeSend({ updated: r, groupId, metricRange }));
  } catch (err) {
    throw err;
  }
};
