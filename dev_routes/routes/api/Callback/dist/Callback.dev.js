"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _CallbackSchema = require("./Schema/Callback.schema.js");

var Callback = function Callback(app, opts, done) {
  app.post("/", _CallbackSchema.postCallBackSchema);
  app.post("/v2", _CallbackSchema.postCallBackv2Schema); // app.get("/", getCallBackSchema);

  done();
};

var _default = Callback;
exports["default"] = _default;