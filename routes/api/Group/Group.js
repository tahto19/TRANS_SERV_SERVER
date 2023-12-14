import {
  createGroupSchema,
  getGroupInfoSchema,
  getGroupsSchema,
  getUsersByGroupIdSchema,
  updateGroupSchema,
} from "./shema/Group.schema.js";

export const Group = (app, opts, done) => {
  app.get("/", getGroupsSchema);
  app.post("/", createGroupSchema);
  app.get("/GroupInfo", getGroupInfoSchema);
  app.post("/update", updateGroupSchema);
  app.post("/getUsersByGroupId", getUsersByGroupIdSchema);

  done();
};
