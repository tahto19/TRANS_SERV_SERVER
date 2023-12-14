import {
  createAgentSchema,
  getAgentsSchema,
  updateAgentSchema,
} from "./Schema/Agent.schema.js";

export const Agent = (app, opts, done) => {
  app.get("/", getAgentsSchema);
  app.post("/", createAgentSchema);
  app.post("/update", updateAgentSchema);

  done();
};
