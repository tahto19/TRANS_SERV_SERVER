import "dotenv/config";
export const chatgptConfig = (transcript, explanation, intent_prompt) => {
  return {
    service_api_id: 2, //changeable
    request_link_id: 1,
    fields: {
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content: transcript + "\n" + explanation,
        },
      ],
      temperature: 0,
      tools: [
        {
          type: "function",
          function: {
            name: "intent_analysis",
            parameters: {
              type: "object",
              description: intent_prompt,
              properties: {
                intents: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "Category name",
                      },
                      score: {
                        type: "number",
                        description: "category score",
                      },
                      explanation: {
                        type: "string",
                        description: "Category Explanation",
                      },
                    },
                    required: ["name", "score", "explanation"],
                  },
                },
              },
              required: ["intents"],
            },
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: { name: "intent_analysis" },
      },
    },
    headers: {
      Authorization: "Bearer " + process.env.OPEN_AIAPI_KEY,
      "Content-Type": "application/json",
    },
  };
};
export const kpi_config = (kpi_prompt) => {
  return {
    service_api_id: 2, //changeable
    request_link_id: 1,
    fields: {
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content: kpi_prompt,
        },
      ],
      temperature: 0,
      tools: [
        {
          type: "function",
          function: {
            name: "text_analysis",
            parameters: {
              type: "object",
              // description: intent_prompt,
              properties: {
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    description: "KPI/s details",
                    properties: {
                      kpi: {
                        type: "string",
                        description: "Name of the KPI",
                      },
                      grade: {
                        type: "string",
                        description: "Given grade",
                      },
                      explain: {
                        type: "string",
                        description: "Get explanation",
                      },
                    },
                  },
                  required: ["kpi", "grade", "explain"],
                },
              },
              required: ["data"],
            },
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: { name: "text_analysis" },
      },
    },
    headers: {
      Authorization: "Bearer " + process.env.OPEN_AIAPI_KEY,
      "Content-Type": "application/json",
    },
  };
};
export const sentimental_config = (transcript) => {
  return {
    service_api_id: 2, //changeable
    request_link_id: 1,
    fields: {
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "system",
          content: transcript,
        },
      ],
      temperature: 0,
      tools: [
        {
          type: "function",
          function: {
            name: "transcript_sentiment",
            description: "Sentiment analysis",
            parameters: {
              type: "object",
              properties: {
                sentiment_name: {
                  type: "string",
                  description:
                    "Get the sentiment of the document and classify as either positive, negative, neutral.",
                },
                sentiment_score: {
                  type: "number",
                  description:
                    "Provide a score of 0-100% on your confidence of your answer",
                },
                explanation: {
                  type: "string",
                  description:
                    "Provide an explanation of your answer in 20 words or less",
                },
              },
              required: ["sentiment_name", "sentiment_score", "explanation"],
            },
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: { name: "transcript_sentiment" },
      },
    },
    headers: {
      Authorization: "Bearer " + process.env.OPEN_AIAPI_KEY,
      "Content-Type": "application/json",
    },
  };
};
