import { changeSend } from "../../../../helper/toSend.js";
import ConfigNotif from "../../../../models/ConfigNotif.model.js";

export const getConfig = async (req, res) => {
  try {
    const { organization_id } = req.query;
    let r = await ConfigNotif.findAll({ where: { organization_id } });
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const postConfig = async (req, res) => {
  try {
    const { organization_id, high, low } = req.body;
    console.log(req.body);
    let ifExists = await ConfigNotif.findOne({ where: { organization_id } });
    if (ifExists) throw new Error("Already Exists");
    let r = await ConfigNotif.create({ organization_id, high, low });
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateConfig = async (req, res) => {
  try {
    const { organization_id, low, high } = req.body;
    let r = await ConfigNotif.update(
      { low, high },
      { where: { organization_id } }
    );
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
