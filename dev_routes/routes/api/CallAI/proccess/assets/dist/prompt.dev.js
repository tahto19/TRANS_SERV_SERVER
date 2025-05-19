"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notes_prompt = exports.compliance_prompt = exports.kpi_prompt = exports.intent_prompt = void 0;
var intent_prompt = "classify the document using the categories: [callintent]. provide a confidence score of 0-1 for each category. explain your answer in 20 words or less.";
exports.intent_prompt = intent_prompt;
var kpi_prompt = "Rate the text based on the following KPI.\nKPIs to rate:[kpi_array]\nEvaluate the  KPI against [transcript] and GRADE as [metricrange]. EXPLAIN your evaluation of KPI in one sentence. Return your result as JSON with the following fields: KPI, GRADE, EXPLAIN.";
exports.kpi_prompt = kpi_prompt;
var compliance_prompt = "Compliance: evaluate [transcript] compliance to [script]. rate using [callmetrics] as the range. Explain your answer in one sentence as description\nSuggestion: Provide an evaluation of [transcript]. Suggest what can be done to improve the conversation.\n\nDo not include personal identifiable information in your response. ";
exports.compliance_prompt = compliance_prompt;
var notes_prompt = "Evaluate the transcript below and provide suggestions to improve the conversation. Answer in a list of at least 3 suggestions:\n\ntranscript=\"[transcript]\"\n";
exports.notes_prompt = notes_prompt;