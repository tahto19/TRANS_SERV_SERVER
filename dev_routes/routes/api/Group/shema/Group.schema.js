import { getArray, getInt, getObject, getString } from "../../Type/type.js";
import {
  agentJoinGroup,
  createGroup,
  createGroupV2,
  getGroupInfo,
  getGroups,
  getListOfGroupsNotAdded,
  getUsersByGroupId,
  getUsersByGroupIdWithTranscripts,
  updateGroup,
} from "../controller/Group.controller.js";
export const createGroupSchema = {
  handler: createGroup,
  schema: {
    body: {
      type: "object",
      properties: {
        name: getString,
        code: getString,
        organization_id: getInt,
      },
    },
  },
};
export const getUsersByGroupIdSchema = {
  handler: getUsersByGroupId,
  schema: {
    body: {
      type: "object",
      properties: {
        agent_group_id: getInt,
      },
    },
  },
};

export const getGroupInfoSchema = {
  handler: getGroupInfo,
  schema: {
    queryString: {
      id: getString,
    },
  },
};
export const getGroupsSchema = {
  handler: getGroups,
  schema: {
    queryString: {
      organization_id: getString,
    },
  },
};
export const updateGroupSchema = {
  handler: updateGroup,
  schema: {
    body: {
      type: "object",
      properties: {
        name: getString,
        id: getInt,
      },
    },
  },
};
export const getUserByGroupIdWithTranscriptSchema = {
  handler: getUsersByGroupIdWithTranscripts,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};

export const agentJoinGroupSchema = {
  handler: agentJoinGroup,
  schema: {
    body: {
      type: "object",
      properties: { user_id: getInt, agent_group_id: getInt },
    },
  },
};
export const createGroupV2Schema = {
  handler: createGroupV2,
  schema: {
    body: {
      type: "object",
      properties: { organization_id: getInt, name: getString },
    },
  },
};
export const getListOfGroupsNotAddedSchema = {
  handler: getListOfGroupsNotAdded,
  schema: {
    body: {
      type: "object",
      properties: { organization_id: getInt, account_code: getString },
    },
  },
};
