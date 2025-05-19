"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Agent = void 0;

var _AgentSchema = require("./Schema/Agent.schema.js");

var Agent = function Agent(app, opts, done) {
  try {
    app.post("/update", _AgentSchema.updateAgentSchema);
    app.get("/getAll", _AgentSchema.getAllAgentSchema);
    app.get("/getUserID", _AgentSchema.getUserIdSchema);
    app.post("/autoComplete", _AgentSchema.autoCompleteSchema);
    app.post("/totalAgent", _AgentSchema.totalAgentSchema);
    app.post("/addNewAgent", _AgentSchema.addNewAgentSchema);
    app.post("/updateNewAgent", _AgentSchema.updateNewAgentSchema);
    app.post("/getNewAgentList", _AgentSchema.getNewAgentListSchema);
    app.get("/agentWithNoGroup", _AgentSchema.getAgentsWithNoGroupSchema);
    app.post("/updateNewAgentList", _AgentSchema.updateNewAgentListSchema);
    app.post("/getAgentsList", _AgentSchema.getAgentsListSchema);
    app.post("/getAgent", _AgentSchema.getAgentSchema);
    app.get("/", _AgentSchema.getAgentsSchema);
    app.post("/", _AgentSchema.createAgentSchema);
    done();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.Agent = Agent;