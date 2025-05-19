"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveNotesConfigSchema = exports.updatePiiFilterSchema = exports.getDefaultNotesFilterSchema = exports.getDefaultPiiSchema = exports.defaultIntentConfigSchema = exports.addIntentV2Schema = exports.getOrgConfigSchema = exports.defaultConfigSchema = exports.addConfigSchema = exports.metricsOnChangeSchema = exports.autoCompleteSchema = exports.updateDataV2Schema = exports.updateDataSchema = exports.deleteDataSchema = exports.getDataSchema = exports.createDataV2Schema = exports.createDataSchema = void 0;

var _type = require("../../Type/type.js");

var _configOfSystemController = require("../controller/configOfSystem.controller.js");

var createDataSchema = {
  handler: _configOfSystemController.createData,
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          result: {
            type: "string",
            "default": "success"
          }
        }
      }
    },
    body: {
      type: "object",
      properties: {
        groupId: _type.getString,
        intents: _type.getString,
        desc: _type.getString,
        script: _type.getString,
        data: _type.getArray
      }
    }
  }
};
exports.createDataSchema = createDataSchema;
var createDataV2Schema = {
  handler: _configOfSystemController.createDataVersion2,
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          result: {
            type: "string",
            "default": "success"
          },
          data: {
            type: "object"
          }
        }
      }
    },
    body: {
      type: "object",
      properties: {
        organization_id: _type.getInt,
        metricRange: _type.getString,
        Intents: _type.getArray
      }
    }
  }
};
exports.createDataV2Schema = createDataV2Schema;
var getDataSchema = {
  method: "GET",
  url: "/",
  handler: _configOfSystemController.getData,
  schema: {
    querystring: {
      type: "object",
      properties: {
        groupId: _type.getString
      },
      required: ["groupId"]
    }
  }
}; // for creating intent

exports.getDataSchema = getDataSchema;
var deleteDataSchema = {
  handler: _configOfSystemController.deleteData,
  schema: {
    body: {
      properties: {
        id: _type.getString
      }
    }
  }
};
exports.deleteDataSchema = deleteDataSchema;
var updateDataSchema = {
  handler: _configOfSystemController.updateData,
  schema: {
    body: {
      properties: {
        data: _type.getArray,
        desc: _type.getString,
        intent: _type.getString,
        script: _type.getString
      }
    }
  }
};
exports.updateDataSchema = updateDataSchema;
var updateDataV2Schema = {
  handler: _configOfSystemController.updateDataVersion2,
  schema: {
    body: {
      properties: {
        data: _type.getArray,
        desc: _type.getString,
        intent: _type.getString,
        script: _type.getString,
        id: _type.getInt
      }
    }
  }
};
exports.updateDataV2Schema = updateDataV2Schema;
var autoCompleteSchema = {
  handler: _configOfSystemController.autoCompleteData,
  schema: {
    querystring: {
      type: "object",
      properties: {
        groupId: _type.getString
      } // required: ["groupId"],

    },
    response: {
      "default": {
        type: "object",
        properties: {
          data: _type.getObject,
          result: _type.getString
        }
      }
    }
  }
};
exports.autoCompleteSchema = autoCompleteSchema;
var metricsOnChangeSchema = {
  handler: _configOfSystemController.metricsOnchange,
  schema: {
    body: {
      type: "object",
      properties: {
        groupId: _type.getString,
        metricRange: _type.getString
      },
      required: ["groupId", "metricRange"]
    },
    response: {
      "default": {
        type: "object",
        properties: {
          data: _type.getObject,
          result: _type.getString,
          message: _type.getString
        }
      }
    }
  }
};
exports.metricsOnChangeSchema = metricsOnChangeSchema;
var addConfigSchema = {
  handler: _configOfSystemController.addConfi
};
exports.addConfigSchema = addConfigSchema;
var defaultConfigSchema = {
  handler: _configOfSystemController.defaultConfig
};
exports.defaultConfigSchema = defaultConfigSchema;
var getOrgConfigSchema = {
  handler: _configOfSystemController.getOrgConfig,
  schema: {
    querystring: {
      organization_id: _type.getInt
    }
  }
};
exports.getOrgConfigSchema = getOrgConfigSchema;
var addIntentV2Schema = {
  handler: _configOfSystemController.addIntentV2,
  schema: {
    body: {
      properties: {
        Intents: _type.getArray,
        organization_id: _type.getInt
      }
    }
  }
};
exports.addIntentV2Schema = addIntentV2Schema;
var defaultIntentConfigSchema = {
  handler: _configOfSystemController.defaultIntentConfig,
  schema: {
    body: {
      properties: {
        intent: _type.getInt,
        organization_id: _type.getInt
      }
    }
  }
};
exports.defaultIntentConfigSchema = defaultIntentConfigSchema;
var getDefaultPiiSchema = {
  handler: _configOfSystemController.getDefaultPii
};
exports.getDefaultPiiSchema = getDefaultPiiSchema;
var getDefaultNotesFilterSchema = {
  handler: _configOfSystemController.getDefaultNotesFilter
};
exports.getDefaultNotesFilterSchema = getDefaultNotesFilterSchema;
var updatePiiFilterSchema = {
  handler: _configOfSystemController.updatePiiFilter,
  schema: {
    body: {
      properties: {
        intent_id: _type.getInt,
        data: _type.getArray
      }
    }
  }
};
exports.updatePiiFilterSchema = updatePiiFilterSchema;
var saveNotesConfigSchema = {
  handler: _configOfSystemController.saveNotesConfig,
  schema: {
    body: {
      properties: {
        intent_id: _type.getInt,
        data: _type.getArray
      }
    }
  }
};
exports.saveNotesConfigSchema = saveNotesConfigSchema;