import {
  postCallBackSchema,
  postCallBackv2Schema,
  callBackForPromptSchema,
  // getCallBackSchema,
} from "./Schema/Callback.schema.js";

const Callback = (app, opts, done) => {
  app.post("/", postCallBackSchema);
  app.post("/v2", postCallBackv2Schema);
  app.post("/prompt", callBackForPromptSchema);
  // app.get("/", getCallBackSchema);
  done();
};
export default Callback;
