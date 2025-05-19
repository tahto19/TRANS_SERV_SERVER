import moment from "moment";
import { changeSend } from "../../../../helper/toSend.js";
import GroupServiceConfig from "../../../../models/GroupServiceConfig.model.js";
import Intents from "../../../../models/Intents.model.js";
import Groups from "../../../../models/Groups.model.js";
import { changeToJson } from "../../../../helper/helpersHere.js";
import {
  addIntent,
  createConfig,
  updateIntent,
} from "../helper/createConfig..js";
import PiiFilterDefault from "../../../../models/PiiFilterDefault.model.js";
import PiiFilter from "../../../../models/PiiFilter.model.js";
import NotesConfig from "../../../../models/NotesConfig.model.js";
import NotesFilterD from "../../../../models/NotesFilterD.model.js";
import IntentMetrics from "../../../../models/IntentMetrics.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import HighlightConfig from "../../../../models/HighlightConfig.model.js";
import IntentDetails from "../../../../models/IntentDetails.model.js";
export const getData = async (req, res) => {
  try {
    const { groupId } = req.query;
    let queryFind = req.url.includes("getByOrg")
      ? { "$Group.organization_id$": groupId }
      : { groupId };

    let r = await GroupServiceConfig.findAll({
      where: queryFind,
      include: [
        { model: Groups, required: false },
        {
          required: false,
          model: Intents,
          attributes: ["id", "intent", "desc", "script", "data"],
          where: { active: true },
        },
      ],
    });

    let toSend = r;

    // if (r.length === 0) {
    //   let getGroup = await Groups.findOne({ where: { id: groupId } });
    //   let group = changeToJson(getGroup);
    //   let getDefault = await GroupServiceConfig.findOne({
    //     where: { forDefault: true },
    //     include: [
    //       { model: Groups, required: false },
    //       {
    //         required: false,
    //         model: Intents,
    //         attributes: ["id", "intent", "desc", "script", "data"],
    //         where: { active: true },
    //       },
    //     ],
    //   });
    //   let defaultSettings = changeToJson(getDefault);
    //   console.log(defaultSettings);
    //   let createConfig = await GroupServiceConfig.create({
    //     groupId,
    //     organization_id: group.organization_id,
    //   });
    //   for (let i = 0; i < defaultSettings.Intents.length; i++) {
    //     let v = defaultSettings.Intents[i];
    //     let temp = {
    //       intent: v.intent,
    //       desc: v.desc,
    //       script: v.script,
    //       data: JSON.stringify(v.data),
    //       GroupServicePKey: createConfig.id,
    //     };
    //     await Intents.create(temp);
    //   }
    //   toSend = await GroupServiceConfig.findAll({
    //     where: queryFind,
    //     include: [
    //       { model: Groups, required: false },
    //       {
    //         required: false,
    //         model: Intents,
    //         attributes: ["id", "intent", "desc", "script", "data"],
    //         where: { active: true },
    //       },
    //     ],
    //   });
    // }

    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
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
export const createDataVersion2 = async (req, res) => {
  try {
    const { organization_id, metricRange, Intents } = req.body;
    if (organization_id === undefined || organization_id === "")
      throw new Error("No org id");
    const getIfGroup = await Groups.findAll({
      where: { organization_id: organization_id },
    });

    if (getIfGroup.length !== 0) {
      getIfGroup.forEach(async (v) => {
        await createConfig(v.id, organization_id, metricRange, Intents);
      });
    } else {
      await createConfig(null, organization_id, metricRange, Intents);
    }

    res.send(changeSend(getIfGroup));
  } catch (err) {
    console.log(err);
    res.code(406).send(err.message);
  }
};
export const updateDataVersion2 = async (req, res) => {
  try {
    const { id, data, desc, intent, script } = req.body;

    let findIntent = await Intents.findOne({
      where: { id, active: true },
      include: [{ model: GroupServiceConfig, required: true }],
    });
    if (findIntent === null) {
      throw new Error("Cant find");
    }

    let intentDe = changeToJson(findIntent);
    const getIfGroup = await Groups.findAll({
      where: { organization_id: organization_id },
    });
    console.log(getIfGroup);
    await addIntent(intentDe.organization_id, { data, desc, intent, script });
    // await Intents.update({ active: false }, { where: { id } });
    // let changeActive = await Intents.create({
    //   data: data,
    //   desc,
    //   intent,
    //   script,
    //   GroupServicePKey: intentDe.GroupServicePKey,
    // });
    // res.send(changeSend(changeActive));
  } catch (err) {
    throw err;
  }
};
export const updateIntentWithOutArchive = async (req, res) => {
  try {
    const { id, data, desc, intent, script } = req.body;
    let findIntent = await Intents.findOne({
      where: { id, active: true },
      include: [{ model: GroupServiceConfig, required: true }],
    });

    let r = await updateIntent(
      changeToJson(findIntent),
      data,
      desc,
      intent,
      script
    );
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const addConfi = async (req, res) => {
  try {
    let getDefault = await GroupServiceConfig.findOne({
      where: { forDefault: true },
      include: [
        { model: Groups, required: false },
        {
          required: false,
          model: Intents,
          attributes: ["id", "intent", "desc", "script", "data"],
          where: { active: true },
        },
      ],
    });
    let defaultSettings = changeToJson(getDefault);

    let createConfig = await GroupServiceConfig.create({
      organization_id: group.organization_id,
    });
    for (let i = 0; i < defaultSettings.Intents.length; i++) {
      let v = defaultSettings.Intents[i];
      let temp = {
        intent: v.intent,
        desc: v.desc,
        script: v.script,
        data: JSON.stringify(v.data),
        GroupServicePKey: createConfig.id,
      };
      await Intents.create(temp);
    }
    let getNewCreated = await createConfig.findOne({
      where: { organization_id: group.organization_id },
    });
    res.send({ getNewCreated });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const defaultConfig = async (req, res) => {
  try {
    let getDefault = await GroupServiceConfig.findOne({
      where: { forDefault: true },
      include: [
        {
          required: false,
          model: Intents,
          attributes: ["id", "intent", "desc", "script", "data"],
          where: { active: true },
        },
      ],
    });
    res.send(changeSend(getDefault));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getOrgConfig = async (req, res) => {
  try {
    const { organization_id } = req.query;

    let r = await GroupServiceConfig.findOne({
      where: { organization_id },
      include: [
        {
          required: false,
          model: Intents,
          // attributes: ["id", "intent", "desc", "script", "data", "default"],
          where: { active: true },
          include: [
            { model: PiiFilter, required: false },
            { required: false, model: NotesConfig },
            { required: false, model: IntentMetrics },
            { required: false, model: HighlightConfig },
          ],
        },
      ],
    });
    res.send(changeSend(r));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const addIntentV2 = async (req, res) => {
  try {
    const { config_id, data, desc, intent, script, organization_id } = req.body;
    // Intents.forEach(async (v) => {
    //   if (v.action.toLowerCase() === "add") await addIntent(organization_id, v);
    //   else {
    //   }
    // });

    let changeActive = await Intents.create({
      data: data,
      desc,
      intent,
      script,
      GroupServicePKey: config_id,
    });
    res.send(changeSend(changeActive));
  } catch (err) {
    throw err;
  }
};
export const defaultIntentConfig = async (req, res) => {
  try {
    const { id, intent } = req.body;
    const getListOfGroups = await GroupServiceConfig.findAll({
      where: { organization_id: id },
      include: [{ model: Intents, where: { active: true } }],
    });
    const getIntentname = await Intents.findOne({
      where: { id: intent, active: true },
    });
    if (getIntentname === null) throw new Error("Error not found intent");
    let c_intentName = changeToJson(getIntentname).intent;
    console.log(c_intentName);
    for (let i = 0; i < getListOfGroups.length; i++) {
      let v = changeToJson(getListOfGroups[i]);

      for (let i = 0; i < v.Intents.length; i++) {
        let v_i = v.Intents[i];
        if (v_i.intent === c_intentName) {
          await Intents.update({ default: true }, { where: { id: v_i.id } });
        }
        if (v_i.default) {
          // console.log(v_i);
          await Intents.update({ default: false }, { where: { id: v_i.id } });
        }
      }
    }
    res.send(changeSend({ message: "successfully change default" }));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getPiiFilter = async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getDefaultPii = async (req, res) => {
  try {
    let a = await PiiFilterDefault.findOne({});
    res.send(changeSend(a));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const updatePiiFilter = async (req, res) => {
  try {
    const { intent_id, data, organization_id } = req.body;
    if (intent_id === null) throw new Error(`intent id is ${intent_id}`);
    let FindIntent = await Intents.findOne({ where: { id: intent_id } });

    if (FindIntent === null) throw new Error("No Intent found");
    let toJSonIntent = changeToJson(FindIntent);

    let a = await GroupServiceConfig.findAll({
      where: { organization_id },
      include: [
        {
          model: Intents,
          required: true,
          include: [{ model: PiiFilter, required: false }],
          where: {
            intent: toJSonIntent.intent,
            active: true,
          },
        },
      ],
    });

    let action = "";

    for (let i = 0; i < a.length; i++) {
      let v = changeToJson(a[i]);

      if (v.Intents[0].piifilter === null) {
        await PiiFilter.create({ intent_id: v.Intents[0].id, data });
        action = "Created";
      } else {
        await PiiFilter.update(
          { data },
          { where: { intent_id: v.Intents[0].id } }
        );
        action = "Updated";
      }
    }
    // a.forEach((v,i)=>{})

    // if (a === null) {
    //   let a = await PiiFilter.create({ intent_id, data });
    //   action = "Created";
    // } else {
    //   await PiiFilter.update({ data }, { where: { intent_id } });
    //   action = "Updated";
    // }
    res.send(changeSend({ message: action }));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const getDefaultNotesFilter = async (req, res) => {
  try {
    let a = await NotesFilterD.findOne({});
    res.send(changeSend(a));
  } catch (err) {
    throw err;
  }
};
export const saveNotesConfig = async (req, res) => {
  try {
    const { organization_id, initial_prompt, filters, intent_id } = req.body;
    let action = "";
    let getIntentDetails = await Intents.findOne({
      where: { id: intent_id, active: true },
    });

    if (intent_id === null) throw new Error("No Intent Found");
    let getname = changeToJson(getIntentDetails).intent;
    let getAllGroups = await GroupServiceConfig.findAll({
      where: { organization_id },
      include: [
        {
          model: Intents,
          required: true,
          where: { active: true, intent: getname },
          include: [{ model: NotesConfig, required: false }],
        },
      ],
    });
    // action = !checkIfAlreadyCreate ? "Added" : "Updated";
    // let kind = !checkIfAlreadyCreate ? updateDataBase : saveToDatabase;
    for (let i = 0; i < getAllGroups.length; i++) {
      let v = changeToJson(getAllGroups[i]);
      console.log(v.Intents[0].id);

      action = !v.Intents[0].notesConfig ? "Added" : "Updated";
      // action += !v.notesConfig
      //   ? "Added" + `${i !== getAllGroups.length - 1 ? "," : ""}`
      //   : "Updated" + `${i !== getAllGroups.length - 1 ? "," : ""}`;
      if (!v.Intents[0].notesConfig) {
        await NotesConfig.create({
          intent_id: v.Intents[0].id,
          initial_prompt,
          filters,
        });
      } else {
        await NotesConfig.update(
          {
            initial_prompt,
            filters,
          },
          { where: { intent_id: v.Intents[0].id } }
        );
      }
    }

    res.send(changeSend({ message: "Successfully " + action }));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const piiFilterToggle = async (req, res) => {
  try {
    const { intent_id, organization_id, active } = req.body;
    if (intent_id === null) throw new Error(`intent id is ${intent_id}`);
    let FindIntent = await Intents.findOne({ where: { id: intent_id } });

    if (FindIntent === null) throw new Error("No Intent found");
    let toJSonIntent = changeToJson(FindIntent);

    let a = await GroupServiceConfig.findAll({
      where: { organization_id },
      include: [
        {
          model: Intents,
          required: true,
          include: [{ model: PiiFilter, required: false }],
          where: {
            intent: toJSonIntent.intent,
            active: true,
          },
        },
      ],
    });

    let action = "";

    for (let i = 0; i < a.length; i++) {
      let v = changeToJson(a[i]);

      if (v.Intents[0].piifilter === null) {
        await PiiFilter.create({ intent_id: v.Intents[0].id, data });
        action = "Created";
      } else {
        await PiiFilter.update(
          { active },
          { where: { intent_id: v.Intents[0].id } }
        );
        action = "Updated";
      }
    }
    res.send(changeSend(action));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const HighlightTranscript = async (req, res) => {
  try {
    const { id } = req.body;
    let r = await Transcripts.findOne({
      where: { id },

      include: [
        {
          required: true,
          model: IntentResult,
          attributes: ["main_intent_id"],
          // attributes: ["main_intent_id", "sub_intent_id", "id"],
          include: [
            {
              model: IntentDetails,
              // attributes: ["intent_name", "desc", "score"],
              as: "main_intent",
              include: {
                model: Intents,
                include: [{ model: HighlightConfig }],
              },
            },
          ],
        },
      ],
      // attributes: [[Sequelize.col("IntentResults.main_intent"), "test"]],
    });
    // {
    //   model: Groups,
    //   include: {
    //     model: GroupServiceConfig,
    //     include: { model: Intents, include: { model: HighlightConfig } },
    //   },
    // },
    let toReturn =
      r === null
        ? []
        : changeToJson(r).IntentResults[0].main_intent.Intent.highlightConfig
            .data;
    res.send(changeSend(toReturn));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const updateHighlightConfig = async (req, res) => {
  try {
    const { intent_id, data, organization_id } = req.body;
    if (intent_id === null) throw new Error(`intent id is ${intent_id}`);
    let FindIntent = await Intents.findOne({ where: { id: intent_id } });

    if (FindIntent === null) throw new Error("No Intent found");
    let toJSonIntent = changeToJson(FindIntent);

    let a = await GroupServiceConfig.findAll({
      where: { organization_id },
      include: [
        {
          model: Intents,
          required: true,
          include: [{ model: HighlightConfig, required: false }],
          where: {
            intent: toJSonIntent.intent,
            active: true,
          },
        },
      ],
    });

    let action = "";

    for (let i = 0; i < a.length; i++) {
      let v = changeToJson(a[i]);

      if (v.Intents[0].highlightConfig === null) {
        await HighlightConfig.create({ intent_id: v.Intents[0].id, data });
        action = "Created";
      } else {
        await HighlightConfig.update(
          { data },
          { where: { intent_id: v.Intents[0].id } }
        );
        action = "Updated";
      }
    }
    // a.forEach((v,i)=>{})

    // if (a === null) {
    //   let a = await PiiFilter.create({ intent_id, data });
    //   action = "Created";
    // } else {
    //   await PiiFilter.update({ data }, { where: { intent_id } });
    //   action = "Updated";
    // }
    res.send(changeSend({ message: action }));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
