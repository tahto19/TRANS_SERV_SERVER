import { getInt, getObject, getString } from "../../Type/type.js";
import {
  addNewAgent,
  autoComplete,
  changeUserInUserID,
  createAgent,
  getAgent,
  getAgentDetails,
  getAgents,
  getAgentsList,
  getAgentsWithNoGroup,
  getAllAgent,
  getNewAgentList,
  getUserId,
  switchUserID,
  totalAgent,
  updateAgent,
  updateNewAgent,
  updateNewAgentList,
} from "../Controller/Agent.controller.js";
export const getAgentsSchema = {
  handler: getAgents,
  schema: { queryString: { id: getInt } },
};
export const getAgentsWithNoGroupSchema = {
  handler: getAgentsWithNoGroup,
  schema: { queryString: { id: getInt, group_id: getInt } },
};
export const createAgentSchema = {
  handler: createAgent,
  schema: {
    body: {
      type: "object",
      properties: {
        fullname: getString,
        contact_details: getString,
        agent_group_id: getInt,
      },
    },
  },
};

export const updateAgentSchema = {
  handler: updateAgent,
  schema: {
    body: {
      type: "object",
      properties: {
        fullname: getString,
        contact_details: getString,
        agent_group_id: getInt,
      },
    },
  },
};
export const getAllAgentSchema = {
  handler: getAllAgent,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
export const getUserIdSchema = {
  handler: getUserId,
};
export const autoCompleteSchema = {
  handler: autoComplete,
  schema: { body: { type: "object", properties: { user_id: getInt } } },
};
export const totalAgentSchema = {
  handler: totalAgent,
  schema: { body: { type: "object", properties: { user_id: getInt } } },
};
export const addNewAgentSchema = {
  handler: addNewAgent,
  schema: {
    body: {
      type: "object",
      properties: {
        user_id: getInt,
        contact_details: getString,
        organization_id: getInt,
      },
    },
  },
};

export const updateNewAgentSchema = {
  handler: updateNewAgent,
  schema: {
    body: {
      type: "object",
      properties: {
        user_id: getInt,
        contact_details: getString,
        organization_id: getInt,
        fullname: getString,
      },
    },
  },
};
export const getAgentsListSchema = {
  handler: getAgentsList,
  schema: {
    body: {
      type: "object",
      properties: {
        client_id: getInt,
      },
    },
  },
};
export const getAgentSchema = {
  handler: getAgent,
  schema: {
    body: {
      type: "object",
      properties: {
        user_id: getInt,
      },
    },
  },
};
export const getNewAgentListSchema = {
  handler: getNewAgentList,
  schema: {
    body: {
      type: "object",
      properties: {
        account_code: getString,
        organization_id: getInt,
      },
    },
  },
};
export const updateNewAgentListSchema = {
  handler: updateNewAgentList,
  schema: {
    body: {
      type: "object",
      properties: {
        account_code: getString,
        organization_id: getInt,
        fullname: getString,
        contact_details: getString,
        user_id: getString,
      },
    },
  },
};
export const changeUserInUserIDSchema = {
  handler: changeUserInUserID,
  schema: {
    body: {
      type: "object",
      properties: {
        fullname: getString,
        contact_details: getString,
        user_id: getString,
      },
    },
  },
};
export const switchUserIDSchema = {
  handler: switchUserID,
  schema: {
    body: {
      type: "object",
      properties: {
        id1: getInt,
        id2: getInt,
        organization_id: getInt,
      },
    },
  },
};
export const getAgentDetailsSchema = {
  handler: getAgentDetails,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
