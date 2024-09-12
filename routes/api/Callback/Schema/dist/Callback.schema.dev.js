"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postCallBackv2Schema = exports.postCallBackSchema = void 0;

var _CallbackController = require("../Controller/Callback.controller.js");

var postCallBackSchema = {
  handler: _CallbackController.postCallBack
};
exports.postCallBackSchema = postCallBackSchema;
var postCallBackv2Schema = {
  handler: _CallbackController.callbackv2
}; // export const getCallBackSchema = { handler: getCallBack };

exports.postCallBackv2Schema = postCallBackv2Schema;