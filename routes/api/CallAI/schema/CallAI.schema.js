import { getInt, getObject, getString } from "../../Type/type.js";
import {
  getIntentAnylsis,
  getIntentByuserOrByGroup,
  intentAnylsis,
  newIntentAnylsis,
  speechTotext,
} from "../controller/CallAI.controller.js";

export const intentAnylsisSchema = {
  handler: intentAnylsis,
  schema: {
    body: { type: "object", properties: { transcript: getString, id: getInt } },
  },
};

export const getIntentAlysisSchema = {
  handler: getIntentAnylsis,
  schema: {
    queryString: {
      type: "object",
      properties: {
        id: getObject,
      },
    },
  },
};
export const getIntentAlysisByUserOrByGroupSchema = {
  handler: getIntentByuserOrByGroup,
  schema: {
    queryString: {
      type: "object",
      properties: {
        id: getObject,
      },
    },
  },
};
export const speechTotextSchema = { handler: speechTotext };
export const newintentAnylsisSchema = {
  handler: newIntentAnylsis,
  schema: {
    body: { type: "object", properties: { transcript: getString, id: getInt } },
  },
};
