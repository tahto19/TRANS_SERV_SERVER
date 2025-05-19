import { autoCompleteData } from "./controller/configOfSystem.controller.js";
import {
  addIntentV2Schema,
  createDataSchema,
  createDataV2Schema,
  defaultConfigSchema,
  defaultIntentConfigSchema,
  deleteDataSchema,
  getDataSchema,
  getDefaultNotesFilterSchema,
  getDefaultPiiSchema,
  getOrgConfigSchema,
  metricsOnChangeSchema,
  saveNotesConfigSchema,
  updateDataSchema,
  updateDataV2Schema,
  updatePiiFilterSchema,
} from "./schema/configOfSystem.schema.js";

export const configOfSystemFunction = (app, opts, done) => {
  app.get("/getByOrg", getDataSchema);
  app.post("/addIntent", createDataSchema);
  app.post("/deleteIntent", deleteDataSchema);
  app.post("/updateIntent", updateDataSchema);
  app.get("/getAutoComplete", autoCompleteData);
  app.post("/metricsOnChange", metricsOnChangeSchema);
  app.post("/saveConfigv2", createDataV2Schema);
  app.post("/updateIntentv2", updateDataV2Schema);
  app.post("/addIntentV2", addIntentV2Schema);
  app.get("/defaultConfig", defaultConfigSchema);
  app.get("/", getDataSchema);
  app.get("/getconfig", getOrgConfigSchema);
  app.post("/setDefaultIntent", defaultIntentConfigSchema);
  app.get("/defaultPiiFilter", getDefaultPiiSchema);
  app.post("/updatePiiFilter", updatePiiFilterSchema);
  app.get("/getDefaultNotesFilter", getDefaultNotesFilterSchema);
  app.post("/saveNotesConfig", saveNotesConfigSchema);
  done();
};
