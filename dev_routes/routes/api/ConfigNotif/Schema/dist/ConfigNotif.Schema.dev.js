"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateConfigSchema = exports.postConfigSchema = exports.getConfigSchema = void 0;

var _ConfigNotifController = require("../Controller/ConfigNotif.Controller.js");

var _type = require("../../Type/type.js");

var getConfigSchema = {
  handler: _ConfigNotifController.getConfig,
  schema: {
    queryString: {
      organization_id: _type.getString
    }
  }
};
exports.getConfigSchema = getConfigSchema;
var postConfigSchema = {
  handler: _ConfigNotifController.postConfig,
  schema: {
    body: {
      type: "object",
      properties: {
        organization_id: _type.getInt,
        high: _type.getInt,
        low: _type.getInt
      }
    }
  }
};
exports.postConfigSchema = postConfigSchema;
var updateConfigSchema = {
  handler: _ConfigNotifController.updateConfig,
  schema: {
    body: {
      type: "object",
      properties: {
        organization_id: _type.getInt,
        high: _type.getInt,
        low: _type.getInt
      }
    }
  }
};
exports.updateConfigSchema = updateConfigSchema;