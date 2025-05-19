import { getInt } from "../../Type/type.js";
import { getDurationController } from "../controller/durationCall.controller.js";

export const getDurationSchema = {
  handler: getDurationController,
  //   schema: {
  //     body: {
  //       organization_id: getInt,
  //       agent: getInt,
  //       id: getInt,
  //       type: getInt,
  //     },
  //   },
};
