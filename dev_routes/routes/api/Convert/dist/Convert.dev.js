"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ConvertSchema = require("./Convert.Schema.js");

var Convert = function Convert(app, opts, done) {
  app.get("/", _ConvertSchema.convertSchema);
  done();
};

var _default = Convert;
exports["default"] = _default;