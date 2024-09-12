import { autoCompleteData } from "./controller/configOfSystem.controller.js";
import {
  addIntentV2Schema,
  createDataSchema,
  createDataV2Schema,
  defaultConfigSchema,
  deleteDataSchema,
  getDataSchema,
  getOrgConfigSchema,
  metricsOnChangeSchema,
  updateDataSchema,
  defaultIntentConfigSchema,
  updatePiiFilterSchema,
  getDefaultPiiSchema,
  updateDataV2Schema,
  getDefaultNotesFilterSchema,
  saveNotesConfigSchema,
  updateIntentWithOutArchiveSchema,
  HighlightTranscriptSchema,
  updateHighlightConfigSchema,
  piiFilterToggleSchema,
  getNewconfigSchema,
  createNewconfigSchema,
  saveConfigv3Schema,
  saveWithoutArchiveSchema,
  updatePiiFilterv2Schema,
  piiFilterTogglev2Schema,
  saveWithArchiveSchema,
  updatechatgptVersionSchema,
  getChatgptversionSchema,
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
  app.post("/updateIntentWithoutArchive", updateIntentWithOutArchiveSchema);
  app.post("/addIntentV2", addIntentV2Schema);
  app.get("/defaultConfig", defaultConfigSchema);
  app.get("/", getDataSchema);
  app.get("/getconfig", getOrgConfigSchema);
  app.post("/setDefaultIntent", defaultIntentConfigSchema);
  app.get("/defaultPiiFilter", getDefaultPiiSchema);
  app.post("/updatePiiFilter", updatePiiFilterSchema);
  app.post("/updatePiiFilterv2", updatePiiFilterv2Schema);
  app.get("/getDefaultNotesFilter", getDefaultNotesFilterSchema);
  app.post("/saveNotesConfig", saveNotesConfigSchema);
  app.post("/piiFilterToggle", piiFilterToggleSchema);
  app.post("/piiFilterTogglev2", piiFilterTogglev2Schema);
  app.post("/HighlightTranscript", HighlightTranscriptSchema);
  app.post("/updateHighlightConfig", updateHighlightConfigSchema);
  app.get("/getNewconfig", getNewconfigSchema);
  app.post("/createNewconfig", createNewconfigSchema);
  app.post("/saveConfigv3", saveConfigv3Schema);
  app.post("/saveWithoutArchive", saveWithoutArchiveSchema);
  app.post("/saveWithArchive", saveWithArchiveSchema);
  app.post("/updatechatgptversion", updatechatgptVersionSchema);
  app.get("/getchatgptversion", getChatgptversionSchema);
  done();
};
