import { getInt } from "../../Type/type.js";
import { getSeperation } from "../Controller/Transcript.Controller.js";

export const getSeperationSchema = {
  handler: getSeperation,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
