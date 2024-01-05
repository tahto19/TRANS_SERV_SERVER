import {
  getAudioSchema,
  getAverageComplianceSchema,
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
  getTotalSchema,
  getTranscriptOfUsersInGroupSchema,
} from "./Schema/Result.Schema.js";

const Result = (app, opts, done) => {
  app.get("/seperateTranscript", getScriptSeperationSchema);
  app.get("/getByUser", getTotalSchema);
  app.get("/getByGroup", getTotalSchema);
  app.get("/getCSAt/getByGroup", getCSAtSchema);
  app.get("/getCSAt/getByUser", getCSAtSchema);
  app.get("/getCSAt/getByTranscript", getCSAtSchema);
  app.get("/getTranscriptOfUsersInGroup", getTranscriptOfUsersInGroupSchema);
  app.get("/getMetricsofKpiByGroup", getMetricsofKpiSchema);
  app.post("/getMetricsPerIntentByGroup", getMetricsPerIntentSchema);
  app.post("/getMetricsPerIntentByUser", getMetricsPerIntentSchema);
  app.get("/dashboardPerOrg", getDashboardSchema);
  app.get("/sentiment/getByGroup", getSentimentSchema);
  app.get("/sentimentTable/getByGroup", getSentimentTableSchema);
  app.get("/compliance/averagebyGroup", getAverageComplianceSchema);
  app.get("/compliance/averagebyAgent", getAverageComplianceSchema);
  app.get("/compliance/perIntentByGroup", getPertIntentInComplianceSchema);
  app.get("/compliance/perAgentByGroup", getPerAgentComplianceSchema);
  app.get("/compliance/perPeriodByGroup", getCompliancePerPeriodSchema);
  app.get("/getAudio", getAudioSchema);
  done();
};

export default Result;
