import { getInt, getString } from "../../Type/type.js";
import { intentAnylsis } from "../controller/CallAI.controller.js";

export const intentAnylsisSchema = {
  handler: intentAnylsis,
  schema: {
    body: { type: "object", properties: { transcript: getString, id: getInt } },
  },
};
