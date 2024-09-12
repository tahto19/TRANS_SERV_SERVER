import {
  postCallBackSchema,
  postCallBackv2Schema,
  // getCallBackSchema,
} from "./Schema/Callback.schema.js";

const Callback = (app, opts, done) => {
  app.post("/", postCallBackSchema);
  app.post("/v2", postCallBackv2Schema);
  // app.get("/", getCallBackSchema);
  done();
};
export default Callback;
