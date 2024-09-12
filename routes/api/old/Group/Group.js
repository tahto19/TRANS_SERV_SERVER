import {
  agentJoinGroupSchema,
  createGroupSchema,
  createGroupV2Schema,
  getGroupInfoSchema,
  getGroupsSchema,
  getListOfGroupsNotAddedSchema,
  getUsersByGroupIdSchema,
  updateGroupSchema,
} from "./shema/Group.schema.js";

export const Group = (app, opts, done) => {
  app.get("/", getGroupsSchema);
  app.post("/create", createGroupV2Schema);
  app.get("/GroupInfo", getGroupInfoSchema);
  app.post("/update", updateGroupSchema);
  app.post("/getUsersByGroupId", getUsersByGroupIdSchema);
  app.post("/agentJoinGroup", agentJoinGroupSchema);
  app.post("/getListOfGroupsNotAdded", getListOfGroupsNotAddedSchema);
  done();
};