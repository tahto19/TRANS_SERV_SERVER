import { getInt, getString } from "../../Type/type.js";
import {
  getSeperation,
  textSearch,
} from "../Controller/Transcript.Controller.js";

export const getSeperationSchema = {
  handler: getSeperation,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};

export const textSearchSchema = {
  handler: textSearch,
  required: ["limit", "offset"],
  schema: {
    body: {
      text: getString,
      organization_id: getInt,
      limit: getInt,
      offset: getInt,
    },
  },
};
