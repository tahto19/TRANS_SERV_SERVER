import { getSeperationSchema } from "./Schema/Transcript.Schema.js";

const TranscriptDetails = (app, opts, done) => {
  try {
    app.get("/getSeperation", getSeperationSchema);
    done();
  } catch (err) {
    throw err;
  }
};
export default TranscriptDetails;
