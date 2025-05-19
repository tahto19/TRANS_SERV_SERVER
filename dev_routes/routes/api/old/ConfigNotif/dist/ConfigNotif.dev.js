"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configNotif = void 0;

var _ConfigNotifSchema = require("./Schema/ConfigNotif.Schema.js");

var configNotif = function configNotif(app, opts, done) {
  app.get("/", _ConfigNotifSchema.getConfigSchema);
  app.post("/", _ConfigNotifSchema.postConfigSchema);
  app.patch("/", _ConfigNotifSchema.updateConfigSchema);
  done();
};

exports.configNotif = configNotif;