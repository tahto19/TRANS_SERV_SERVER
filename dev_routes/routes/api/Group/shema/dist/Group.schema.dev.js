"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListOfGroupsNotAddedSchema = exports.createGroupV2Schema = exports.agentJoinGroupSchema = exports.getUserByGroupIdWithTranscriptSchema = exports.updateGroupSchema = exports.getGroupsSchema = exports.getGroupInfoSchema = exports.getUsersByGroupIdSchema = exports.createGroupSchema = void 0;

var _type = require("../../Type/type.js");

var _GroupController = require("../controller/Group.controller.js");

var createGroupSchema = {
  handler: _GroupController.createGroup,
  schema: {
    body: {
      type: "object",
      properties: {
        name: _type.getString,
        code: _type.getString,
        organization_id: _type.getInt
      }
    }
  }
};
exports.createGroupSchema = createGroupSchema;
var getUsersByGroupIdSchema = {
  handler: _GroupController.getUsersByGroupId,
  schema: {
    body: {
      type: "object",
      properties: {
        agent_group_id: _type.getInt
      }
    }
  }
};
exports.getUsersByGroupIdSchema = getUsersByGroupIdSchema;
var getGroupInfoSchema = {
  handler: _GroupController.getGroupInfo,
  schema: {
    queryString: {
      id: _type.getString
    }
  }
};
exports.getGroupInfoSchema = getGroupInfoSchema;
var getGroupsSchema = {
  handler: _GroupController.getGroups,
  schema: {
    queryString: {
      organization_id: _type.getString
    }
  }
};
exports.getGroupsSchema = getGroupsSchema;
var updateGroupSchema = {
  handler: _GroupController.updateGroup,
  schema: {
    body: {
      type: "object",
      properties: {
        name: _type.getString,
        id: _type.getInt
      }
    }
  }
};
exports.updateGroupSchema = updateGroupSchema;
var getUserByGroupIdWithTranscriptSchema = {
  handler: _GroupController.getUsersByGroupIdWithTranscripts,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getUserByGroupIdWithTranscriptSchema = getUserByGroupIdWithTranscriptSchema;
var agentJoinGroupSchema = {
  handler: _GroupController.agentJoinGroup,
  schema: {
    body: {
      type: "object",
      properties: {
        user_id: _type.getInt,
        agent_group_id: _type.getInt
      }
    }
  }
};
exports.agentJoinGroupSchema = agentJoinGroupSchema;
var createGroupV2Schema = {
  handler: _GroupController.createGroupV2,
  schema: {
    body: {
      type: "object",
      properties: {
        organization_id: _type.getInt,
        name: _type.getString
      }
    }
  }
};
exports.createGroupV2Schema = createGroupV2Schema;
var getListOfGroupsNotAddedSchema = {
  handler: _GroupController.getListOfGroupsNotAdded,
  schema: {
    body: {
      type: "object",
      properties: {
        organization_id: _type.getInt,
        account_code: _type.getString
      }
    }
  }
};
exports.getListOfGroupsNotAddedSchema = getListOfGroupsNotAddedSchema;