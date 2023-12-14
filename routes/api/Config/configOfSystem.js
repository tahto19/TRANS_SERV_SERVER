import { autoCompleteData } from "./controller/configOfSystem.controller.js";
import {
  createDataSchema,
  deleteDataSchema,
  getDataSchema,
  metricsOnChangeSchema,
  updateDataSchema,
} from "./schema/configOfSystem.schema.js";

export const configOfSystemFunction = (app, opts, done) => {
  app.get("/", getDataSchema);
  app.post("/addIntent", createDataSchema);
  app.post("/deleteIntent", deleteDataSchema);
  app.post("/updateIntent", updateDataSchema);
  app.get("/getAutoComplete", autoCompleteData);
  app.post("/metricsOnChange", metricsOnChangeSchema);
  done();
};
