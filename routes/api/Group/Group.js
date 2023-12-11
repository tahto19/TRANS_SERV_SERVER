import { getGroups } from "./controller/Group.controller.js";
import {
  //   getGroupsSchema,
  getUsersByGroupIdSchema,
} from "./shema/Group.schema.js";

export const Group = (app, opts, done) => {
  app.post("/getUsersByGroupId", getUsersByGroupIdSchema);
  app.post("/getGroups", getGroups);
  done();
};
