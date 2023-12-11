import { getOrganizationShema } from "./Schema/Organization.schema.js";

export const Organization = (app, opts, done) => {
  app.get("/", getOrganizationShema);
  done();
};
