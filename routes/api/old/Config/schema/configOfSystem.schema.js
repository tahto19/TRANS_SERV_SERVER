import { getArray, getInt, getObject, getString } from "../../Type/type.js";
import {
  addConfi,
  addIntentV2,
  autoCompleteData,
  createData,
  createDataVersion2,
  defaultConfig,
  deleteData,
  // deleteData,
  getData,
  getOrgConfig,
  metricsOnchange,
  updateData,
  updateDataVersion2,
  defaultIntentConfig,
  getDefaultPii,
  updatePiiFilter,
  getDefaultNotesFilter,
  saveNotesConfig,
  updateIntentWithOutArchive,
  updateHighlightConfig,
  HighlightTranscript,
  piiFilterToggle,
  // updateData,
} from "../controller/configOfSystem.controller.js";
export const HighlightTranscriptSchema = {
  handler: HighlightTranscript,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
export const updateHighlightConfigSchema = {
  handler: updateHighlightConfig,
  schema: {
    body: {
      properties: {
        intent_id: getInt,
        data: getArray,
      },
    },
  },
};
export const createDataSchema = {
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
export const createDataV2Schema = {
  handler: createDataVersion2,
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          result: { type: "string", default: "success" },
          data: { type: "object" },
        },
      },
    },
    body: {
      type: "object",
      properties: {
        organization_id: getInt,
        metricRange: getString,
        Intents: getArray,
      },
    },
  },
};
export const getDataSchema = {
  method: "GET",
  url: "/",
  handler: getData,
  schema: {
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
export const updateDataV2Schema = {
  handler: updateDataVersion2,
  schema: {
    body: {
      properties: {
        data: getArray,
        desc: getString,
        intent: getString,
        script: getString,
        id: getInt,
      },
    },
  },
};
export const updateIntentWithOutArchiveSchema = {
  handler: updateIntentWithOutArchive,
  schema: {
    body: {
      properties: {
        data: getArray,
        desc: getString,
        intent: getString,
        script: getString,
        id: getInt,
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

export const addConfigSchema = {
  handler: addConfi,
};
export const defaultConfigSchema = {
  handler: defaultConfig,
};
export const getOrgConfigSchema = {
  handler: getOrgConfig,
  schema: {
    querystring: {
      organization_id: getInt,
    },
  },
};
export const addIntentV2Schema = {
  handler: addIntentV2,
  schema: {
    body: {
      properties: {
        Intents: getArray,
        organization_id: getInt,
      },
    },
  },
};
export const defaultIntentConfigSchema = {
  handler: defaultIntentConfig,
  schema: {
    body: {
      properties: {
        Intents: getArray,
        organization_id: getInt,
      },
    },
  },
};
export const getDefaultPiiSchema = {
  handler: getDefaultPii,
};
export const updatePiiFilterSchema = {
  handler: updatePiiFilter,
  schema: {
    body: {
      properties: {
        intent_id: getInt,
        data: getArray,
      },
    },
  },
};
export const piiFilterToggleSchema = {
  handler: piiFilterToggle,
  schema: {
    body: {
      properties: {
        intent_id: getInt,
        active: { type: "boolean" },
        organization_id: getInt,
      },
    },
  },
};
export const getDefaultNotesFilterSchema = {
  handler: getDefaultNotesFilter,
};
export const saveNotesConfigSchema = {
  handler: saveNotesConfig,
  schema: {
    body: {
      properties: {
        intent_id: getInt,
        data: getArray,
      },
    },
  },
};
