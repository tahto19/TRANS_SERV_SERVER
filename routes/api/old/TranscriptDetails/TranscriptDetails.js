import {
  getSeperationSchema,
  textSearchSchema,
} from "./Schema/Transcript.Schema.js";

const TranscriptDetails = (app, opts, done) => {
  try {
    app.get("/getSeperation", getSeperationSchema);
    app.post("/TranscriptSearch", textSearchSchema);
    done();
  } catch (err) {
    throw err;
  }
};
export default TranscriptDetails;
