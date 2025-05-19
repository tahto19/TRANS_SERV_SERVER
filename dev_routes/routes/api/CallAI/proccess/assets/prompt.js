export const intent_prompt = "###Class Description###";
export const kpi_prompt = `Rate the text based on the following KPI.
KPIs to rate:[kpi_array]
Evaluate the  KPI against [transcript] and GRADE as [metricrange]. EXPLAIN your evaluation of KPI in one sentence. Return your result as JSON with the following fields: KPI, GRADE, EXPLAIN.`;
export const compliance_prompt = `Compliance: evaluate [transcript] compliance to [script]. rate using [callmetrics] as the range. Explain your answer in one sentence as description
Suggestion: Provide an evaluation of [transcript]. Suggest what can be done to improve the conversation.

Do not include personal identifiable information in your response. `;
export const notes_prompt = `Evaluate the transcript below and provide suggestions to improve the conversation. Answer in a list of at least 3 suggestions:

transcript="[transcript]"
`;
export const pii_filter_prompt = `extract the following information From Transcript below 

`;
export const description_prompt =
  "Create an AI prompt in  a call center environment to evaluate whether a provided paragraph primarily focuses on the topic of '[intent]'add more detailed prompt.";
export const script_prompt =
  "Could you please craft a step-by-step(with numbers) script for handling '[intent]' calls in a call center setting, following these guidelines: Begin the call with a greeting including the company name and the agent's name. Respond to all inquiries clearly, politely, and succinctly. Offer thorough explanations with as much detail as needed. Suggest various options and alternatives when appropriate. Conclude the call on a cheerful and polite note.";
export const metrics_prompt = `Your an AI prompt engeneering in a Call Center Enviroment, create a prompt that will check if the Transcript contains Word [metricsType]\n Minimum of 30 words`;
export const summary_prompt = `Compose a Prompt For an AI in a Call Center Enviroment that will check if the Transcript and get the Summarization and add more details of the call( please make it in list)`;
export const Improve_prompt = `Improve and optimize the gpt3.5 prompt below to give better results: [intent]`;
export const improve_prompt_intent =
  "Improve the text provided below that describes the term [Intent] to allow you to classify transcripts as [intent]";
