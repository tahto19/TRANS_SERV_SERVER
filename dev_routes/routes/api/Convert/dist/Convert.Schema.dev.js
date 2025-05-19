"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertSchema = void 0;

var _type = require("../Type/type.js");

var _ConvertController = require("./Convert.Controller.js");

var convertSchema = {
  handler: _ConvertController.convert,
  schema: {
    queryString: {
      id: _type.getInt,
      start: _type.getString,
      end: _type.getString
    }
  }
};
exports.convertSchema = convertSchema;