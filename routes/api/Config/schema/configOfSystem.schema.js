import { getArray, getObject, getString } from "../../Type/type.js";
import {
  autoCompleteData,
  createData,
  deleteData,
  // deleteData,
  getData,
  metricsOnchange,
  updateData,
  // updateData,
} from "../controller/configOfSystem.controller.js";
export const createDataSchema = {
  method: "POST",
  url: "/addIntent",
  handler: createData,
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          result: { type: "string", default: "success" },
        },
      },
    },
    body: {
      type: "object",
      properties: {
        groupId: getString,
        intents: getString,
        desc: getString,
        script: getString,
        data: getArray,
      },
    },
  },
};
export const getDataSchema = {
  method: "GET",
  url: "/",
  handler: getData,
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          result: { type: "string", default: "success" },
          data: {
            type: "object",
            properties: {
              groupId: getString,
              // createdAt: { type: "date" },
              metricRange: getString,
              Intents: {
                type: "array",
                properties: {
                  intent: getString,
                  desc: getString,
                  script: getString,
                  data: getArray,
                },
              },
            },
          },
        },
      },
    },
    querystring: {
      type: "object",
      properties: {
        groupId: getString,
      },
      required: ["groupId"],
    },
  },
};

// for creating intent

export const deleteDataSchema = {
  handler: deleteData,
  schema: {
    body: {
      properties: { id: getString },
    },
  },
};
export const updateDataSchema = {
  handler: updateData,
  schema: {
    body: {
      properties: {
        data: getArray,
        desc: getString,
        intent: getString,
        script: getString,
      },
    },
  },
};
export const autoCompleteSchema = {
  handler: autoCompleteData,
  schema: {
    querystring: {
      type: "object",
      properties: {
        groupId: getString,
      },
      // required: ["groupId"],
    },
    response: {
      default: {
        type: "object",
        properties: {
          data: getObject,
          result: getString,
        },
      },
    },
  },
};
export const metricsOnChangeSchema = {
  handler: metricsOnchange,
  schema: {
    body: {
      type: "object",
      properties: {
        groupId: getString,
        metricRange: getString,
      },
      required: ["groupId", "metricRange"],
    },
    response: {
      default: {
        type: "object",
        properties: {
          data: getObject,
          result: getString,
          message: getString,
        },
      },
    },
  },
};
