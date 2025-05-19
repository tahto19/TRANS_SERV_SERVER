"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCSATPerPeriodSchema = exports.getCSATAgentScoreCardSchema = exports.getCSATPerKPISchema = exports.getCSATperIntentSchema = exports.getCSATversion2Schema = exports.getAllIntentByOrgSchema = exports.getCSATTotalSchema = exports.getCompliancePerPeriodSchema = exports.getPerAgentComplianceSchema = exports.getPertIntentInComplianceSchema = exports.getAverageComplianceSchema = exports.getSentimentTableSchema = exports.getSentimentSchema = exports.getDashboardSchema = exports.getMetricsPerIntentSchema = exports.getMetricsofKpiSchema = exports.getSeperateCallSchema = exports.getAudioSchema = exports.getTranscriptOfUsersInGroupSchema = exports.getScriptSeperationSchema = exports.getCSAtSchema = exports.getTotalSchema = void 0;

var _ResultController = require("../Controller/Result.controller.js");

var _type = require("../../Type/type.js");

var getTotalSchema = {
  handler: _ResultController.getTotal,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getTotalSchema = getTotalSchema;
var getCSAtSchema = {
  handler: _ResultController.getCSAT,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getCSAtSchema = getCSAtSchema;
var getScriptSeperationSchema = {
  handler: _ResultController.seperateTranscript,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getScriptSeperationSchema = getScriptSeperationSchema;
var getTranscriptOfUsersInGroupSchema = {
  handler: _ResultController.getTranscriptOfUsersInGroup,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getTranscriptOfUsersInGroupSchema = getTranscriptOfUsersInGroupSchema;
var getAudioSchema = {
  handler: _ResultController.getAudio,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getAudioSchema = getAudioSchema;
var getSeperateCallSchema = {
  handler: _ResultController.getSeperateCall,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getSeperateCallSchema = getSeperateCallSchema;
var getMetricsofKpiSchema = {
  handler: _ResultController.getMetricsofKpi,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getMetricsofKpiSchema = getMetricsofKpiSchema;
var getMetricsPerIntentSchema = {
  handler: _ResultController.getMetricsPerIntent,
  schema: {
    body: {
      type: "object",
      properties: {
        id: _type.getInt,
        intent: _type.getString
      }
    }
  }
};
exports.getMetricsPerIntentSchema = getMetricsPerIntentSchema;
var getDashboardSchema = {
  handler: _ResultController.getDashboard,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getDashboardSchema = getDashboardSchema;
var getSentimentSchema = {
  handler: _ResultController.getSentiment,
  schema: {
    queryString: {
      id: _type.getInt,
      start: _type.getString,
      end: _type.getString
    }
  }
};
exports.getSentimentSchema = getSentimentSchema;
var getSentimentTableSchema = {
  handler: _ResultController.getSentimentTable,
  schema: {
    queryString: {
      id: _type.getInt,
      start: _type.getString,
      end: _type.getString
    }
  }
};
exports.getSentimentTableSchema = getSentimentTableSchema;
var getAverageComplianceSchema = {
  handler: _ResultController.averageCompliance,
  schema: {
    queryString: {
      id: _type.getInt,
      start: _type.getString,
      end: _type.getString
    }
  }
};
exports.getAverageComplianceSchema = getAverageComplianceSchema;
var getPertIntentInComplianceSchema = {
  handler: _ResultController.getPertIntentInCompliance,
  schema: {
    queryString: {
      id: _type.getInt,
      start: _type.getString,
      end: _type.getString
    }
  }
};
exports.getPertIntentInComplianceSchema = getPertIntentInComplianceSchema;
var getPerAgentComplianceSchema = {
  handler: _ResultController.getPerAgentCompliance,
  schema: {
    queryString: {
      id: _type.getInt,
      start: _type.getString,
      end: _type.getString
    }
  }
};
exports.getPerAgentComplianceSchema = getPerAgentComplianceSchema;
var getCompliancePerPeriodSchema = {
  handler: _ResultController.getCompliancePerPeriod,
  schema: {
    queryString: {
      id: _type.getInt,
      start: _type.getString,
      end: _type.getString
    }
  }
};
exports.getCompliancePerPeriodSchema = getCompliancePerPeriodSchema;
var getCSATTotalSchema = {
  handler: _ResultController.getCSATTotal,
  schema: {
    queryString: {
      id: _type.getInt,
      start: _type.getString,
      end: _type.getString
    }
  }
};
exports.getCSATTotalSchema = getCSATTotalSchema;
var getAllIntentByOrgSchema = {
  handler: _ResultController.getAllIntentByOrg,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getAllIntentByOrgSchema = getAllIntentByOrgSchema;
var getCSATversion2Schema = {
  handler: _ResultController.getCSATversion2,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getCSATversion2Schema = getCSATversion2Schema;
var getCSATperIntentSchema = {
  handler: _ResultController.getCSATperIntent,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getCSATperIntentSchema = getCSATperIntentSchema;
var getCSATPerKPISchema = {
  handler: _ResultController.getCSATPerKPI,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getCSATPerKPISchema = getCSATPerKPISchema;
var getCSATAgentScoreCardSchema = {
  handler: _ResultController.getCSATAgentScoreCard,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getCSATAgentScoreCardSchema = getCSATAgentScoreCardSchema;
var getCSATPerPeriodSchema = {
  handler: _ResultController.getCSATPerPeriod,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getCSATPerPeriodSchema = getCSATPerPeriodSchema;