import { getArray, getInt, getObject, getString } from "../../Type/type.js";
import {
  createGroup,
  getGroupInfo,
  getGroups,
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
