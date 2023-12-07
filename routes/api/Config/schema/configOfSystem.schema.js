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
        groupId: { type: "string" },
        intents: { type: "string" },
        desc: { type: "string" },
        script: { type: "string" },
        data: { type: "array" },
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
              groupId: { type: "string" },
              // createdAt: { type: "date" },
              metricRange: { type: "string" },
              Intents: {
                type: "array",
                properties: {
                  intent: { type: "string" },
                  desc: { type: "string" },
                  script: { type: "string" },
                  data: { type: "array" },
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
        groupId: { type: "string" },
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
      properties: { id: { type: "string" } },
    },
  },
};
export const updateDataSchema = {
  handler: updateData,
  schema: {
    body: {
      properties: {
        data: { type: "array" },
        desc: { type: "string" },
        intent: { type: "string" },
        script: { type: "string" },
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
        groupId: { type: "string" },
      },
      // required: ["groupId"],
    },
    response: {
      default: {
        type: "object",
        properties: {
          data: { type: "object" },
          result: { type: "string" },
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
        groupId: { type: "string" },
        metricRange: { type: "string" },
      },
      required: ["groupId", "metricRange"],
    },
    response: {
      default: {
        type: "object",
        properties: {
          data: { type: "object" },
          result: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
};
