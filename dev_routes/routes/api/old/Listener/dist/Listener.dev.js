"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ListenerController = require("./Controller/Listener.Controller.js");

var _ListenerSchema = require("./Schema/Listener.Schema.js");

var Listener = function Listener(app, opts, done) {
  app.get("/process", _ListenerController.getProcess);
  app.get("/", _ListenerSchema.getListenerSchema);
  app.post("/", _ListenerSchema.TestSchema);
  done();
};

var _default = Listener;
exports["default"] = _default;