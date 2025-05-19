import {
  getSeperationSchema,
  textSearchSchema,
  deleteTranscriptSchema,
} from "./Schema/Transcript.Schema.js";

const TranscriptDetails = (app, opts, done) => {
  try {
    app.get("/getSeperation", getSeperationSchema);
    app.post("/TranscriptSearch", textSearchSchema);
    app.post("/DeleteTranscript", deleteTranscriptSchema);
    done();
  } catch (err) {
    throw err;
  }
};
export default TranscriptDetails;
