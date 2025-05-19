import { Op } from "sequelize";
import { changeToJson } from "../../../../helper/helpersHere.js";
import GroupServiceConfig from "../../../../models/GroupServiceConfig.model.js";
import Groups from "../../../../models/Groups.model.js";
import IntentMetrics from "../../../../models/IntentMetrics.model.js";
import Intents from "../../../../models/Intents.model.js";

export const createConfig = async (
  groupId,
  organization_id,
  metricRange,
  IntentsL
) => {
  try {
    var IntentsLists = [];
    var saveConfigService = null;
    if (metricRange === null) {
      let findConfig = await GroupServiceConfig.findOne({
        where: { organization_id },
        include: [
          {
            required: false,
            model: Intents,
            attributes: ["id", "intent", "desc", "script", "data"],
            where: { active: true },
          },
        ],
      });

      if (findConfig.length === 0) return;
      let config = changeToJson(findConfig);
      saveConfigService = await GroupServiceConfig.create({
        metricRange: config.metricRange,
        organization_id,
        groupId,
      });
      IntentsLists = config.Intents;
    } else {
      saveConfigService = await GroupServiceConfig.create({
        metricRange,
        organization_id,
        groupId,
      });
      IntentsLists = IntentsL;
    }
    for (let i = 0; i < IntentsLists.length; i++) {
      // console.log(IntentsLists[i]);
      let v = IntentsLists[i];

      let intent = await Intents.create({
        GroupServicePKey: saveConfigService.id,
        intent: v.intent,
        desc: v.desc,
        script: v.script,
        data: v.data,
      });
      v.data.forEach((vv) => {
        IntentMetrics.create({
          intent_id: intent.id,
          call_quality: vv.call_quality,
          metric_desc: vv.metric_desc,
          cust_sat_weight: vv.cust_sat_weight,
        });
      });
    }
    return "done";
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const addIntent = async (organization_id, intentsData) => {
  try {
    const getGroups = await Groups.findAll({
      where: {
        organization_id,
      },
    });
    const { data, desc, intent, script } = intentsData;
    getGroups.forEach(async (v) => {
      let val = changeToJson(v);
      let getConfig = await GroupServiceConfig.findOne({
        where: { groupId: val.id },
        include: [{ model: Intents }],
      });
      let config = changeToJson(getConfig);
      console.log(config);
      let intentSave = await Intents.create({
        data: data,
        desc,
        intent,
        script,
        GroupServicePKey: config.id,
        organization_id,
      });
      for (let iii = 0; iii < data.length; iii++) {
        let vvv = data[iii];
        await IntentMetrics.create({
          intent_id: intentSave.id,
          call_quality: vvv.call_quality,
          metric_desc: vvv.metric_desc,
          cust_sat_weight: vvv.cust_sat_weight,
        });
      }
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
export const updateIntent = async (
  org_details,
  data,
  desc,
  intentName,
  script
) => {
  try {
    const getGroupConfig = await GroupServiceConfig.findAll({
      where: {
        organization_id: org_details.GroupServiceConfig.organization_id,
      },
      include: [
        { model: Groups },
        {
          model: Intents,
          where: { intent: org_details.intent, active: true },
          include: [{ model: IntentMetrics, required: false }],
        },
      ],
    });

    for (let i = 0; i < getGroupConfig.length; i++) {
      let v = changeToJson(getGroupConfig[i]);
      for (let ii = 0; ii < v.Intents.length; ii++) {
        let intent = v.Intents[ii];

        for (let iii = 0; iii < data.length; iii++) {
          let vvv = data[iii];
          console.log(intent.IntentsMetrics[iii]);
          if (
            intent.IntentsMetric === null ||
            intent.IntentsMetrics[iii] === undefined
          ) {
            await IntentMetrics.create({
              intent_id: intent.id,
              call_quality: vvv.call_quality,
              metric_desc: vvv.metric_desc,
              cust_sat_weight: vvv.cust_sat_weight,
            });
          } else {
            console.log(vvv);
            let r = await IntentMetrics.update(
              {
                call_quality: vvv.call_quality,
                metric_desc: vvv.metric_desc,
                cust_sat_weight: vvv.cust_sat_weight,
              },
              {
                where: {
                  id: intent.IntentsMetrics[iii].id,
                },
              }
            );
            console.log(r);
          }
        }
        let r = await Intents.update(
          {
            desc,
            script,
            intent: intentName,
          },
          {
            where: {
              id: intent.id,
              [Op.not]: {
                desc,
                script,
                intent: intentName,
              },
            },
          }
        );
        console.log(r);
      }
    }
    // await GroupServiceConfig.update(
    //   // { metricRange: config.metricRange },
    //   { where: { organization_id: org_details.organization_id } }
    // );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
