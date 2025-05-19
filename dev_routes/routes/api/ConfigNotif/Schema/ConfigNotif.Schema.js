import {
  getConfig,
  postConfig,
  updateConfig,
} from "../Controller/ConfigNotif.Controller.js";
import { getArray, getInt, getObject, getString } from "../../Type/type.js";

export const getConfigSchema = {
  handler: getConfig,
  schema: { queryString: { organization_id: getString } },
};
export const postConfigSchema = {
  handler: postConfig,
  schema: {
    body: {
      type: "object",
      properties: { organization_id: getInt, high: getInt, low: getInt },
    },
  },
};
export const updateConfigSchema = {
  handler: updateConfig,
  schema: {
    body: {
      type: "object",
      properties: { organization_id: getInt, high: getInt, low: getInt },
    },
  },
};
