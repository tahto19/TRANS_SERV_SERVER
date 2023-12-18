import { getCSAtSchema, getTotalSchema } from "./Schema/Result.Schema.js";

const Result = (app, opts, done) => {
  app.get("/seperateTranscript");
  app.get("/getByUser", getTotalSchema);
  app.get("/getByGroup", getTotalSchema);
  app.get("/getCSAt/getByGroup", getCSAtSchema);
  app.get("/getCSAt/getByUser", getCSAtSchema);
  done();
};

export default Result;
