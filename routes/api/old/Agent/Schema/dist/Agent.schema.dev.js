"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateNewAgentListSchema = exports.getNewAgentListSchema = exports.getAgentSchema = exports.getAgentsListSchema = exports.updateNewAgentSchema = exports.addNewAgentSchema = exports.totalAgentSchema = exports.autoCompleteSchema = exports.getUserIdSchema = exports.getAllAgentSchema = exports.updateAgentSchema = exports.createAgentSchema = exports.getAgentsWithNoGroupSchema = exports.getAgentsSchema = void 0;

var _type = require("../../Type/type.js");

var _AgentController = require("../Controller/Agent.controller.js");

var getAgentsSchema = {
  handler: _AgentController.getAgents,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getAgentsSchema = getAgentsSchema;
var getAgentsWithNoGroupSchema = {
  handler: _AgentController.getAgentsWithNoGroup,
  schema: {
    queryString: {
      id: _type.getInt,
      group_id: _type.getInt
    }
  }
};
exports.getAgentsWithNoGroupSchema = getAgentsWithNoGroupSchema;
var createAgentSchema = {
  handler: _AgentController.createAgent,
  schema: {
    body: {
      type: "object",
      properties: {
        fullname: _type.getString,
        contact_details: _type.getString,
        agent_group_id: _type.getInt
      }
    }
  }
};
exports.createAgentSchema = createAgentSchema;
var updateAgentSchema = {
  handler: _AgentController.updateAgent,
  schema: {
    body: {
      type: "object",
      properties: {
        fullname: _type.getString,
        contact_details: _type.getString,
        agent_group_id: _type.getInt
      }
    }
  }
};
exports.updateAgentSchema = updateAgentSchema;
var getAllAgentSchema = {
  handler: _AgentController.getAllAgent,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getAllAgentSchema = getAllAgentSchema;
var getUserIdSchema = {
  handler: _AgentController.getUserId
};
exports.getUserIdSchema = getUserIdSchema;
var autoCompleteSchema = {
  handler: _AgentController.autoComplete,
  schema: {
    body: {
      type: "object",
      properties: {
        user_id: _type.getInt
      }
    }
  }
};
exports.autoCompleteSchema = autoCompleteSchema;
var totalAgentSchema = {
  handler: _AgentController.totalAgent,
  schema: {
    body: {
      type: "object",
      properties: {
        user_id: _type.getInt
      }
    }
  }
};
exports.totalAgentSchema = totalAgentSchema;
var addNewAgentSchema = {
  handler: _AgentController.addNewAgent,
  schema: {
    body: {
      type: "object",
      properties: {
        user_id: _type.getInt,
        contact_details: _type.getString,
        organization_id: _type.getInt
      }
    }
  }
};
exports.addNewAgentSchema = addNewAgentSchema;
var updateNewAgentSchema = {
  handler: _AgentController.updateNewAgent,
  schema: {
    body: {
      type: "object",
      properties: {
        user_id: _type.getInt,
        contact_details: _type.getString,
        organization_id: _type.getInt,
        fullname: _type.getString
      }
    }
  }
};
exports.updateNewAgentSchema = updateNewAgentSchema;
var getAgentsListSchema = {
  handler: _AgentController.getAgentsList,
  schema: {
    body: {
      type: "object",
      properties: {
        client_id: _type.getInt
      }
    }
  }
};
exports.getAgentsListSchema = getAgentsListSchema;
var getAgentSchema = {
  handler: _AgentController.getAgent,
  schema: {
    body: {
      type: "object",
      properties: {
        user_id: _type.getInt
      }
    }
  }
};
exports.getAgentSchema = getAgentSchema;
var getNewAgentListSchema = {
  handler: _AgentController.getNewAgentList,
  schema: {
    body: {
      type: "object",
      properties: {
        account_code: _type.getString,
        organization_id: _type.getInt
      }
    }
  }
};
exports.getNewAgentListSchema = getNewAgentListSchema;
var updateNewAgentListSchema = {
  handler: _AgentController.updateNewAgentList,
  schema: {
    body: {
      type: "object",
      properties: {
        account_code: _type.getString,
        organization_id: _type.getInt,
        fullname: _type.getString,
        contact_details: _type.getString,
        user_id: _type.getString
      }
    }
  }
};
exports.updateNewAgentListSchema = updateNewAgentListSchema;