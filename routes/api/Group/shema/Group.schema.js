import { getArray, getObject, getString } from "../../Type/type.js";
import {
  getGroups,
  getUsersByGroupId,
} from "../controller/Group.controller.js";

export const getUsersByGroupIdSchema = {
  handler: getUsersByGroupId,
  schema: {
    body: {
      type: "object",
      properties: {
        groudId: getString,
      },
    },
  },
};
export const getGroupsSchema = {
  handler: getGroups,
  schema: {
    body: {
      type: "object",
      properties: {
        companyId: getString,
      },
    },
    response: {
      200: {
        type: "object",
        properties: { result: getString, data: getArray },
      },
    },
  },
};
