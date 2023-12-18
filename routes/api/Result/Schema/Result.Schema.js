import { getCSAT, getTotal } from "../Controller/Result.controller.js";
import { getString } from "../../Type/type.js";
export const getTotalSchema = {
  handler: getTotal,
  schema: {
    queryString: {
      id: { getString },
    },
  },
};
export const getCSAtSchema = {
  handler: getCSAT,
  schema: {
    queryString: {
      id: { getString },
    },
  },
};
