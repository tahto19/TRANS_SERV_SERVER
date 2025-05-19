import {
  agentJoinGroupSchema,
  createGroupSchema,
  getGroupInfoSchema,
  getGroupsSchema,
  getListOfGroupsNotAddedSchema,
  getUsersByGroupIdSchema,
  updateGroupSchema,
} from "./shema/Group.schema.js";

export const Group = (app, opts, done) => {
  app.get("/", getGroupsSchema);
  app.post("/create", createGroupSchema);
  app.get("/GroupInfo", getGroupInfoSchema);
  app.post("/update", updateGroupSchema);
  app.post("/getUsersByGroupId", getUsersByGroupIdSchema);
  app.post("/agentJoinGroup", agentJoinGroupSchema);
  app.post("/getListOfGroupsNotAdded", getListOfGroupsNotAddedSchema);
  done();
};
