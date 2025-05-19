import { convertSchema } from "./Convert.Schema.js";

const Convert = (app, opts, done) => {
  app.get("/", convertSchema);
  done();
};
export default Convert;
