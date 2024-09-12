"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configOfSystemFunction = void 0;

var _configOfSystemController = require("./controller/configOfSystem.controller.js");

var _configOfSystemSchema = require("./schema/configOfSystem.schema.js");

var configOfSystemFunction = function configOfSystemFunction(app, opts, done) {
  app.get("/getByOrg", _configOfSystemSchema.getDataSchema);
  app.post("/addIntent", _configOfSystemSchema.createDataSchema);
  app.post("/deleteIntent", _configOfSystemSchema.deleteDataSchema);
  app.post("/updateIntent", _configOfSystemSchema.updateDataSchema);
  app.get("/getAutoComplete", _configOfSystemController.autoCompleteData);
  app.post("/metricsOnChange", _configOfSystemSchema.metricsOnChangeSchema);
  app.post("/saveConfigv2", _configOfSystemSchema.createDataV2Schema);
  app.post("/updateIntentv2", _configOfSystemSchema.updateDataV2Schema);
  app.post("/addIntentV2", _configOfSystemSchema.addIntentV2Schema);
  app.get("/defaultConfig", _configOfSystemSchema.defaultConfigSchema);
  app.get("/", _configOfSystemSchema.getDataSchema);
  app.get("/getconfig", _configOfSystemSchema.getOrgConfigSchema);
  app.post("/setDefaultIntent", _configOfSystemSchema.defaultIntentConfigSchema);
  app.get("/defaultPiiFilter", _configOfSystemSchema.getDefaultPiiSchema);
  app.post("/updatePiiFilter", _configOfSystemSchema.updatePiiFilterSchema);
  app.get("/getDefaultNotesFilter", _configOfSystemSchema.getDefaultNotesFilterSchema);
  app.post("/saveNotesConfig", _configOfSystemSchema.saveNotesConfigSchema);
  done();
};

exports.configOfSystemFunction = configOfSystemFunction;