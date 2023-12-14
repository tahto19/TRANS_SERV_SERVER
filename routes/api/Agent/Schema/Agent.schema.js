import { getInt, getString } from "../../Type/type.js";
import {
  createAgent,
  getAgents,
  updateAgent,
} from "../Controller/Agent.controller.js";
export const getAgentsSchema = {
  handler: getAgents,
  schema: { queryString: { id: getInt } },
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
