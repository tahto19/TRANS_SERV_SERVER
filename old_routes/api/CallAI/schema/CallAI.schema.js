import { getArray, getInt, getObject, getString } from "../../Type/type.js";
import {
  fromListener,
  getIntentAnylsis,
  getIntentByuserOrByGroup,
  intentAnylsis,
  newIntentAnylsis,
  speechTotext,
  speechTotextFromListener,
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
export const speechTotextFromListenerSchema = {
  bodyLimit: 50000000000,
  handler: speechTotextFromListener,
  schema: {
    body: {
      type: "object",
      properties: { file: getArray, user_id: getString, queue_id: getInt },
    },
  },
};

export const fromListenerSchema = {
  bodyLimit: 5000000000000000,
  handler: fromListener,
  schema: {
    body: {
      type: "object",
      properties: { file: getArray, user_id: getString, queue_id: getInt },
    },
  },
};
