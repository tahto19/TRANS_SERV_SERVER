import { getOrganizationShema } from "./Schema/Organization.schema.js";

export const Organization = (app, opts, done) => {
  try {
    app.get("/", getOrganizationShema);
    done();
  } catch (err) {
    console.log(err);
  }
};
