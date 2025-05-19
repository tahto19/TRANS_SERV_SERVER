import { getIntentDurationCallSchema } from "../Result/Schema/Result.Schema.js";
import { getDurationSchema } from "./schema/durationCall.schema.js";

const Report = (app, opts, done) => {
  app.post("/call_duration", getDurationSchema);
  done();
};
export default Report;
