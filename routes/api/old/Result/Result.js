import {
  getAllIntentByOrgSchema,
  getAudioSchema,
  getAverageComplianceSchema,
  getCSATTotalSchema,
  getCSATversion2Schema,
  getCSAtSchema,
  getCompliancePerPeriodSchema,
  getDashboardSchema,
  getMetricsPerIntentSchema,
  getMetricsofKpiSchema,
  getPerAgentComplianceSchema,
  getPertIntentInComplianceSchema,
  getScriptSeperationSchema,
  getSentimentSchema,
  getSentimentTableSchema,
  getSeperateCallSchema,
  getTotalSchema,
  getTranscriptOfUsersInGroupSchema,
  getCSATperIntentSchema,
  getCSATPerKPISchema,
  getCSATAgentScoreCardSchema,
  getCSATPerPeriodSchema,
  ListOftranscriptSchema,
  getIntentV2Schema,
  getIntentDurationCallSchema,
} from "./Schema/Result.Schema.js";

const Result = (app, opts, done) => {
  app.get("/seperateTranscript", getScriptSeperationSchema);
  app.post("/getTranscripts/getByGroup", ListOftranscriptSchema);
  app.post("/getTranscripts/getByOrganization", ListOftranscriptSchema);
  app.post("/getTranscripts/getByAgent", ListOftranscriptSchema);
  app.get("/getByUser", getTotalSchema);
  app.get("/getByGroup", getTotalSchema);
  app.get("/getByOrganization", getTotalSchema);
  app.get("/getCSAt/getByGroup", getCSAtSchema);
  app.get("/getCSAt/getByUser", getCSAtSchema);
  app.get("/getCSAt/getByOrganization", getCSAtSchema);
  app.get("/getCSAt/getByTranscript", getCSAtSchema);
  app.get("/getTranscriptOfUsersInGroup", getTranscriptOfUsersInGroupSchema);
  app.get("/getMetricsofKpiByGroup", getMetricsofKpiSchema);
  app.post("/getMetricsPerIntentByGroup", getMetricsPerIntentSchema);
  app.post("/getMetricsPerIntentByOrganization", getMetricsPerIntentSchema);
  app.post("/getMetricsPerIntentByUser", getMetricsPerIntentSchema);
  app.get("/dashboardPerOrg", getDashboardSchema);
  app.get("/sentiment/getByGroup", getSentimentSchema);
  app.get("/sentiment/getByOrganization", getSentimentSchema);
  app.get("/sentimentTable/getByGroup", getSentimentTableSchema);
  app.get("/sentimentTable/getByOrganization", getSentimentTableSchema);
  app.get("/compliance/averagebyGroup", getAverageComplianceSchema);
  app.get("/compliance/averagebyOrganization", getAverageComplianceSchema);
  app.get("/compliance/averagebyAgent", getAverageComplianceSchema);
  app.get("/compliance/perIntentByGroup", getPertIntentInComplianceSchema);
  app.get("/compliance/perIntentOrganization", getPertIntentInComplianceSchema);
  app.get("/compliance/perIntentByAgent", getPertIntentInComplianceSchema);
  app.get("/compliance/perAgentByGroup", getPerAgentComplianceSchema);
  app.get("/compliance/perAgentByOrganization", getPerAgentComplianceSchema);
  app.get("/compliance/perPeriodByGroup", getCompliancePerPeriodSchema);
  app.get("/compliance/perPeriodByOrganization", getCompliancePerPeriodSchema);
  app.get("/compliance/perPeriodByAgent", getCompliancePerPeriodSchema);
  app.get("/compliance/getcsattotalbyGroup", getCSATTotalSchema);
  app.get("/compliance/getcsattotalAgent", getCSATTotalSchema);
  app.get("/getIntentsByOrg", getAllIntentByOrgSchema);
  app.get("/getIntentsByGroup", getAllIntentByOrgSchema);
  app.get("/getCSATversion2/getByGroup", getCSATversion2Schema);
  app.get("/getCSATversion2/getByOrganization", getCSATversion2Schema);
  app.get("/getCSATversion2/getByAgent", getCSATversion2Schema);
  app.get("/getCSATPerIntent/getByOrganization", getCSATperIntentSchema);
  app.get("/getCSATPerIntent/getByGroup", getCSATperIntentSchema);
  app.get("/getCSATPerIntent/getByAgent", getCSATperIntentSchema);
  app.get("/getCSATPerKPI/getByOrganization", getCSATPerKPISchema);
  app.get(
    "/getCSATAgentScoreCard/getByOrganization",
    getCSATAgentScoreCardSchema
  );
  app.get("/getCSATAgentScoreCard/getByAgent", getCSATAgentScoreCardSchema);
  app.get("/getCSATAgentScoreCard/getByGroup", getCSATAgentScoreCardSchema);
  app.get("/getCSATPerKPI/getByGroup", getCSATPerKPISchema);
  app.get("/getCSATPerKPI/getByAgent", getCSATPerKPISchema);
  app.get("/getAudio", getAudioSchema);
  app.get("/getSeperation", getSeperateCallSchema);
  app.get("/getCSATPerPeriod/getByOrganization", getCSATPerPeriodSchema);
  app.get("/getCSATPerPeriod/getByGroup", getCSATPerPeriodSchema);
  app.get("/getCSATPerPeriod/getByAgent", getCSATPerPeriodSchema);
  app.get("/getIntentV2/getByOrganization", getIntentV2Schema);
  app.get("/getIntentV2/getByGroup", getIntentV2Schema);
  app.get("/getIntentV2/getByAgent", getIntentV2Schema);
  app.get("/getIntentDurationCall/getByAgent", getIntentDurationCallSchema);
  done();
};

export default Result;
