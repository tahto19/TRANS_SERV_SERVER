import { getString, getInt } from "../Type/type.js";
import { convert } from "./Convert.Controller.js";

export const convertSchema = {
  handler: convert,
  schema: {
    queryString: {
      id: getInt,
      start: getString,
      end: getString,
    },
  },
};
