import { getInt, getString } from "../../Type/type.js";
import {
  getSeperation,
  textSearch,
  deleteTranscript,
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
export const deleteTranscriptSchema = {
  handler: deleteTranscript,

  schema: {
    body: {
      start: getString,
      end: getString,
      organization_id: getString,
    },
  },
};
