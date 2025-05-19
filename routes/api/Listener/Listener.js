import { getProcess } from "./Controller/Listener.Controller.js";
import {
  TestSchema,
  getListenerSchema,
  reprocessErrorStatusSchema,
} from "./Schema/Listener.Schema.js";

const Listener = (app, opts, done) => {
  app.get("/process", getProcess);
  app.post("/checkUser", TestSchema);
  app.post("/reprocess", reprocessErrorStatusSchema);
  app.get("/", getListenerSchema);
  app.post("/", TestSchema);

  done();
};

export default Listener;
