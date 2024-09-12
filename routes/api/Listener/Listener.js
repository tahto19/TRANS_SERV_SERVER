import { getProcess } from "./Controller/Listener.Controller.js";
import { TestSchema, getListenerSchema } from "./Schema/Listener.Schema.js";

const Listener = (app, opts, done) => {
  app.get("/process", getProcess);
  app.get("/", getListenerSchema);
  app.post("/", TestSchema);

  done();
};

export default Listener;
