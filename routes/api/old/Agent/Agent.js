import {
  addNewAgentSchema,
  autoCompleteSchema,
  changeUserInUserIDSchema,
  createAgentSchema,
  getAgentDetailsSchema,
  getAgentSchema,
  getAgentsListSchema,
  getAgentsSchema,
  getAgentsWithNoGroupSchema,
  getAllAgentSchema,
  getNewAgentListSchema,
  getUserIdSchema,
  switchUserIDSchema,
  totalAgentSchema,
  updateAgentSchema,
  updateNewAgentListSchema,
  updateNewAgentSchema,
} from "./Schema/Agent.schema.js";

export const Agent = (app, opts, done) => {
  try {
    app.post("/update", updateAgentSchema);
    app.get("/getAll", getAllAgentSchema);
    app.get("/getUserID", getUserIdSchema);
    app.post("/autoComplete", autoCompleteSchema);
    app.post("/totalAgent", totalAgentSchema);
    app.post("/addNewAgent", addNewAgentSchema);
    app.post("/updateNewAgent", updateNewAgentSchema);
    app.post("/getNewAgentList", getNewAgentListSchema);
    app.get("/agentWithNoGroup", getAgentsWithNoGroupSchema);
    app.post("/updateNewAgentList", updateNewAgentListSchema);
    app.post("/changeUserInUserID", changeUserInUserIDSchema);
    app.post("/getAgentsList", getAgentsListSchema);
    app.post("/switchUserID", switchUserIDSchema);
    app.post("/getAgent", getAgentSchema);
    app.get("/", getAgentsSchema);
    app.get("/getAgentDetails", getAgentDetailsSchema);
    app.post("/", createAgentSchema);
    done();
  } catch (err) {
    console.log(err);
    throw err;
  }
};
