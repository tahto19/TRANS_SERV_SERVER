import { getString, getArray } from "../../Type/type.js";
import { getOrganization } from "../Controller/Organization.controller.js";

export const getOrganizationShema = {
  handler: getOrganization,
  schema: {
    response: {
      200: {
        type: "object",
        properties: { result: getString, data: getArray },
      },
    },
  },
};
