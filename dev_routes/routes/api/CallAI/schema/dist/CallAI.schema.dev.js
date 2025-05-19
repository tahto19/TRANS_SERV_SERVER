"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromListenerSchema = exports.speechTotextFromListenerSchema = exports.newintentAnylsisSchema = exports.speechTotextSchema = exports.getIntentAlysisByUserOrByGroupSchema = exports.getIntentAlysisSchema = exports.intentAnylsisSchema = void 0;

var _type = require("../../Type/type.js");

var _CallAIController = require("../controller/CallAI.controller.js");

var intentAnylsisSchema = {
  handler: _CallAIController.intentAnylsis,
  schema: {
    body: {
      type: "object",
      properties: {
        transcript: _type.getString,
        id: _type.getInt
      }
    }
  }
};
exports.intentAnylsisSchema = intentAnylsisSchema;
var getIntentAlysisSchema = {
  handler: _CallAIController.getIntentAnylsis,
  schema: {
    queryString: {
      type: "object",
      properties: {
        id: _type.getObject
      }
    }
  }
};
exports.getIntentAlysisSchema = getIntentAlysisSchema;
var getIntentAlysisByUserOrByGroupSchema = {
  handler: _CallAIController.getIntentByuserOrByGroup,
  schema: {
    queryString: {
      type: "object",
      properties: {
        id: _type.getObject
      }
    }
  }
};
exports.getIntentAlysisByUserOrByGroupSchema = getIntentAlysisByUserOrByGroupSchema;
var speechTotextSchema = {
  handler: _CallAIController.speechTotext
};
exports.speechTotextSchema = speechTotextSchema;
var newintentAnylsisSchema = {
  handler: _CallAIController.newIntentAnylsis,
  schema: {
    body: {
      type: "object",
      properties: {
        transcript: _type.getString,
        id: _type.getInt
      }
    }
  }
};
exports.newintentAnylsisSchema = newintentAnylsisSchema;
var speechTotextFromListenerSchema = {
  bodyLimit: 50000000000,
  handler: _CallAIController.speechTotextFromListener,
  schema: {
    body: {
      type: "object",
      properties: {
        file: _type.getArray,
        user_id: _type.getString,
        queue_id: _type.getInt
      }
    }
  }
};
exports.speechTotextFromListenerSchema = speechTotextFromListenerSchema;
var fromListenerSchema = {
  bodyLimit: 50000000000,
  handler: _CallAIController.fromListener,
  schema: {
    body: {
      type: "object",
      properties: {
        file: _type.getArray,
        user_id: _type.getString,
        queue_id: _type.getInt
      }
    }
  }
};
exports.fromListenerSchema = fromListenerSchema;