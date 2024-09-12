"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Group = void 0;

var _GroupSchema = require("./shema/Group.schema.js");

var Group = function Group(app, opts, done) {
  app.get("/", _GroupSchema.getGroupsSchema);
  app.post("/create", _GroupSchema.createGroupSchema);
  app.get("/GroupInfo", _GroupSchema.getGroupInfoSchema);
  app.post("/update", _GroupSchema.updateGroupSchema);
  app.post("/getUsersByGroupId", _GroupSchema.getUsersByGroupIdSchema);
  app.post("/agentJoinGroup", _GroupSchema.agentJoinGroupSchema);
  app.post("/getListOfGroupsNotAdded", _GroupSchema.getListOfGroupsNotAddedSchema);
  done();
};

exports.Group = Group;