import { postCallBackSchema } from "./Schema/Callback.schema.js";

const Callback = (app, opts, done) => {
  app.post("/", postCallBackSchema);
  done();
};
export default Callback;
