export const intent_prompt =
  "classify the document using the categories: [callintent]. provide a confidence score of 0-1 for each category. explain your answer in 20 words or less.";
export const kpi_prompt = `Rate the text based on the following KPI.
KPIs to rate:[kpi_array]
Evaluate the  KPI against [transcript] and GRADE as [metricrange]. EXPLAIN your evaluation of KPI in one sentence. Return your result as JSON with the following fields: KPI, GRADE, EXPLAIN.`;
export const compliance_prompt = `Compliance: evaluate [transcript] compliance to [script]. rate using [callmetrics] as the range. Explain your answer in one sentence as description
Suggestion: Provide an evaluation of [transcript]. Suggest what can be done to improve the conversation.

Do not include personal identifiable information in your response. `;
export const notes_prompt = `Evaluate the transcript below and provide suggestions to improve the conversation. Answer in a list of at least 3 suggestions:

transcript="[transcript]"
`;
