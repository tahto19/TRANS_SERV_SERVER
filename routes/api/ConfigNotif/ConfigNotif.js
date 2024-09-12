import {
  getConfigSchema,
  postConfigSchema,
  updateConfigSchema,
} from "./Schema/ConfigNotif.Schema.js";

export const configNotif = (app, opts, done) => {
  app.get("/", getConfigSchema);
  app.post("/", postConfigSchema);
  app.patch("/", updateConfigSchema);
  done();
};
