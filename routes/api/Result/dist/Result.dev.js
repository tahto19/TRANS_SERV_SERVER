"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ResultSchema = require("./Schema/Result.Schema.js");

var Result = function Result(app, opts, done) {
  app.get("/seperateTranscript", _ResultSchema.getScriptSeperationSchema);
  app.post("/getTranscripts/getByGroup", _ResultSchema.ListOftranscriptSchema);
  app.post("/getTranscripts/getByOrganization", _ResultSchema.ListOftranscriptSchema);
  app.post("/getTranscripts/getByAgent", _ResultSchema.ListOftranscriptSchema);
  app.get("/getByUser", _ResultSchema.getTotalSchema);
  app.get("/getByGroup", _ResultSchema.getTotalSchema);
  app.get("/getByOrganization", _ResultSchema.getTotalSchema);
  app.get("/getCSAt/getByGroup", _ResultSchema.getCSAtSchema);
  app.get("/getCSAt/getByUser", _ResultSchema.getCSAtSchema);
  app.get("/getCSAt/getByOrganization", _ResultSchema.getCSAtSchema);
  app.get("/getCSAt/getByTranscript", _ResultSchema.getCSAtSchema);
  app.get("/getTranscriptOfUsersInGroup", _ResultSchema.getTranscriptOfUsersInGroupSchema);
  app.get("/getMetricsofKpiByGroup", _ResultSchema.getMetricsofKpiSchema);
  app.post("/getMetricsPerIntentByGroup", _ResultSchema.getMetricsPerIntentSchema);
  app.post("/getMetricsPerIntentByOrganization", _ResultSchema.getMetricsPerIntentSchema);
  app.post("/getMetricsPerIntentByUser", _ResultSchema.getMetricsPerIntentSchema);
  app.get("/dashboardPerOrg", _ResultSchema.getDashboardSchema);
  app.get("/sentiment/getByGroup", _ResultSchema.getSentimentSchema);
  app.get("/sentiment/getByOrganization", _ResultSchema.getSentimentSchema);
  app.get("/sentimentTable/getByGroup", _ResultSchema.getSentimentTableSchema);
  app.get("/sentimentTable/getByOrganization", _ResultSchema.getSentimentTableSchema);
  app.get("/compliance/averagebyGroup", _ResultSchema.getAverageComplianceSchema);
  app.get("/compliance/averagebyOrganization", _ResultSchema.getAverageComplianceSchema);
  app.get("/compliance/averagebyAgent", _ResultSchema.getAverageComplianceSchema);
  app.get("/compliance/perIntentByGroup", _ResultSchema.getPertIntentInComplianceSchema);
  app.get("/compliance/perIntentOrganization", _ResultSchema.getPertIntentInComplianceSchema);
  app.get("/compliance/perAgentByGroup", _ResultSchema.getPerAgentComplianceSchema);
  app.get("/compliance/perAgentByOrganization", _ResultSchema.getPerAgentComplianceSchema);
  app.get("/compliance/perPeriodByGroup", _ResultSchema.getCompliancePerPeriodSchema);
  app.get("/compliance/perPeriodByOrganization", _ResultSchema.getCompliancePerPeriodSchema);
  app.get("/compliance/getcsattotalbyGroup", _ResultSchema.getCSATTotalSchema);
  app.get("/getIntentsByOrg", _ResultSchema.getAllIntentByOrgSchema);
  app.get("/getIntentsByGroup", _ResultSchema.getAllIntentByOrgSchema);
  app.get("/getCSATversion2/getByGroup", _ResultSchema.getCSATversion2Schema);
  app.get("/getCSATversion2/getByOrganization", _ResultSchema.getCSATversion2Schema);
  app.get("/getCSATversion2/getByAgent", _ResultSchema.getCSATversion2Schema);
  app.get("/getCSATPerIntent/getByOrganization", _ResultSchema.getCSATperIntentSchema);
  app.get("/getCSATPerIntent/getByGroup", _ResultSchema.getCSATperIntentSchema);
  app.get("/getCSATPerIntent/getByAgent", _ResultSchema.getCSATperIntentSchema);
  app.get("/getCSATPerKPI/getByOrganization", _ResultSchema.getCSATPerKPISchema);
  app.get("/getCSATAgentScoreCard/getByOrganization", _ResultSchema.getCSATAgentScoreCardSchema);
  app.get("/getCSATPerKPI/getByGroup", _ResultSchema.getCSATPerKPISchema);
  app.get("/getCSATPerKPI/getByAgent", _ResultSchema.getCSATPerKPISchema);
  app.get("/getAudio", _ResultSchema.getAudioSchema);
  app.get("/getSeperation", _ResultSchema.getSeperateCallSchema);
  app.get("/getCSATPerPeriod/getByOrganization", _ResultSchema.getCSATPerPeriodSchema);
  app.get("/getCSATPerPeriod/getByGroup", _ResultSchema.getCSATPerPeriodSchema);
  app.get("/getCSATPerPeriod/getByAgent", _ResultSchema.getCSATPerPeriodSchema);
  done();
};

var _default = Result;
exports["default"] = _default;