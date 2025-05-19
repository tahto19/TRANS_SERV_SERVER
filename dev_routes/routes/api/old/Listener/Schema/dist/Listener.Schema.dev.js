"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestSchema = exports.getListenerSchema = void 0;

var _ListenerController = require("../Controller/Listener.Controller.js");

var getListenerSchema = {
  handler: _ListenerController.getListener
};
exports.getListenerSchema = getListenerSchema;
var TestSchema = {
  handler: _ListenerController.testListener
};
exports.TestSchema = TestSchema;