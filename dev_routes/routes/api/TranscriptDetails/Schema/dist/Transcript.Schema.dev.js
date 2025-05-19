"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSeperationSchema = void 0;

var _type = require("../../Type/type.js");

var _TranscriptController = require("../Controller/Transcript.Controller.js");

var getSeperationSchema = {
  handler: _TranscriptController.getSeperation,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getSeperationSchema = getSeperationSchema;