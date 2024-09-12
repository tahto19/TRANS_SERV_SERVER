import {
  averageCompliance,
  getAllIntentByOrg,
  getAudio,
  getCSAT,
  getCSATTotal,
  getCSATversion2,
  getCompliancePerPeriod,
  getDashboard,
  getMetricsPerIntent,
  getMetricsofKpi,
  getPerAgentCompliance,
  getPertIntentInCompliance,
  getSentiment,
  getSentimentTable,
  getSeperateCall,
  getTotal,
  getTranscriptOfUsersInGroup,
  seperateTranscript,
} from "../Controller/Result.controller.js";
import { getString, getInt } from "../../Type/type.js";
export const getTotalSchema = {
  handler: getTotal,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
export const getCSAtSchema = {
  handler: getCSAT,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
export const getScriptSeperationSchema = {
  handler: seperateTranscript,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};

export const getTranscriptOfUsersInGroupSchema = {
  handler: getTranscriptOfUsersInGroup,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
export const getAudioSchema = {
  handler: getAudio,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
export const getSeperateCallSchema = {
  handler: getSeperateCall,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
export const getMetricsofKpiSchema = {
  handler: getMetricsofKpi,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
export const getMetricsPerIntentSchema = {
  handler: getMetricsPerIntent,
  schema: {
    body: {
      type: "object",
      properties: {
        id: getInt,
        intent: getString,
      },
    },
  },
};
export const getDashboardSchema = {
  handler: getDashboard,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
export const getSentimentSchema = {
  handler: getSentiment,
  schema: {
    queryString: {
      id: getInt,
      start: getString,
      end: getString,
    },
  },
};
export const getSentimentTableSchema = {
  handler: getSentimentTable,
  schema: {
    queryString: {
      id: getInt,
      start: getString,
      end: getString,
    },
  },
};
export const getAverageComplianceSchema = {
  handler: averageCompliance,
  schema: {
    queryString: {
      id: getInt,
      start: getString,
      end: getString,
    },
  },
};
export const getPertIntentInComplianceSchema = {
  handler: getPertIntentInCompliance,
  schema: {
    queryString: {
      id: getInt,
      start: getString,
      end: getString,
    },
  },
};
export const getPerAgentComplianceSchema = {
  handler: getPerAgentCompliance,
  schema: {
    queryString: {
      id: getInt,
      start: getString,
      end: getString,
    },
  },
};
export const getCompliancePerPeriodSchema = {
  handler: getCompliancePerPeriod,
  schema: {
    queryString: {
      id: getInt,
      start: getString,
      end: getString,
    },
  },
};
export const getCSATTotalSchema = {
  handler: getCSATTotal,
  schema: {
    queryString: {
      id: getInt,
      start: getString,
      end: getString,
    },
  },
};
export const getAllIntentByOrgSchema = {
  handler: getAllIntentByOrg,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
export const getCSATversion2Schema = {
  handler: getCSATversion2,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};