"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notes_config = exports.compliance_config = exports.speech_cofig = exports.transcript_seperator_config = exports.sentimental_config = exports.kpi_config = exports.intent_config = exports.chatgptConfig = void 0;

require("dotenv/config");

var _prompt = require("./prompt.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var chatgptConfig = function chatgptConfig(transcript, explanation, intent_prompt) {
  return {
    // service_api_id: 2, //changeable
    // request_link_id: 1,
    fields: {
      model: "gpt-3.5-turbo-1106",
      messages: [{
        role: "system",
        content: "[target]" + "\n" + explanation
      }],
      temperature: 0,
      tools: [{
        type: "function",
        "function": {
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
                      description: "Category name"
                    },
                    score: {
                      type: "number",
                      description: "category score"
                    },
                    explanation: {
                      type: "string",
                      description: "Category Explanation"
                    }
                  },
                  required: ["name", "score", "explanation"]
                }
              }
            },
            required: ["intents"]
          }
        }
      }],
      tool_choice: {
        type: "function",
        "function": {
          name: "intent_analysis"
        }
      }
    },
    headers: {
      Authorization: "Bearer " + process.env.OPEN_AIAPI_KEY,
      "Content-Type": "application/json"
    }
  };
};

exports.chatgptConfig = chatgptConfig;

var intent_config = function intent_config(transcript, explanation, intent_prompt) {
  return {
    // service_api_id: 2, //changeable
    // request_link_id: 1,
    model: "gpt-3.5-turbo-1106",
    messages: [{
      role: "system",
      content: "[target]" + "\n" + explanation
    }],
    temperature: 0,
    tools: [{
      type: "function",
      "function": {
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
                    description: "Category name"
                  },
                  score: {
                    type: "number",
                    description: "category score"
                  },
                  explanation: {
                    type: "string",
                    description: "Category Explanation"
                  }
                },
                required: ["name", "score", "explanation"]
              }
            }
          },
          required: ["intents"]
        }
      }
    }],
    tool_choice: {
      type: "function",
      "function": {
        name: "intent_analysis"
      }
    }
  };
};

exports.intent_config = intent_config;

var kpi_config = function kpi_config(kpi_prompt) {
  return {
    model: "gpt-3.5-turbo-1106",
    messages: [{
      role: "system",
      content: kpi_prompt
    }],
    temperature: 0,
    tools: [{
      type: "function",
      "function": {
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
                    description: "Name of the KPI"
                  },
                  grade: {
                    type: "string",
                    description: "Given grade"
                  },
                  explain: {
                    type: "string",
                    description: "Get explanation"
                  }
                }
              },
              required: ["kpi", "grade", "explain"]
            }
          },
          required: ["data"]
        }
      }
    }],
    tool_choice: {
      type: "function",
      "function": {
        name: "text_analysis"
      }
    }
  };
};

exports.kpi_config = kpi_config;

var sentimental_config = function sentimental_config(transcript) {
  return {
    model: "gpt-3.5-turbo-1106",
    messages: [{
      role: "system",
      content: "[target]"
    }],
    temperature: 0,
    tools: [{
      type: "function",
      "function": {
        name: "transcript_sentiment",
        description: "Sentiment analysis",
        parameters: {
          type: "object",
          properties: {
            sentiment_name: {
              type: "string",
              description: "Get the sentiment of the document and classify as one of the following: positive, negative, neutral."
            },
            sentiment_score: {
              type: "number",
              description: "Provide a score of 0-100% on your confidence of your answer"
            },
            explanation: {
              type: "string",
              description: "Provide an explanation of your answer in 20 words or less"
            }
          },
          required: ["sentiment_name", "sentiment_score", "explanation"]
        }
      }
    }],
    tool_choice: {
      type: "function",
      "function": {
        name: "transcript_sentiment"
      }
    }
  };
};

exports.sentimental_config = sentimental_config;

var transcript_seperator_config = function transcript_seperator_config(transcript) {
  var _ref;

  return _ref = {
    model: "gpt-3.5-turbo-1106"
  }, _defineProperty(_ref, "model", "gpt-3.5-turbo-1106"), _defineProperty(_ref, "messages", [{
    role: "system",
    content: "given the agent tranascript '[target]' and the whole transcript of agent and the costumer'".concat(transcript, "'\n        create a new transcript that looks like a chat in json format with costumer and agent seperate")
  }]), _defineProperty(_ref, "temperature", 0), _defineProperty(_ref, "tools", [{
    type: "function",
    "function": {
      name: "transcript_seperation",
      parameters: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: {
              type: "object",
              description: "Separate transcript",
              properties: {
                agent_message: {
                  type: "string",
                  description: "Message for the agent"
                },
                customer_message: {
                  type: "string",
                  description: "Message for the customer"
                }
              }
            },
            required: ["agent_message", "customer_message"]
          }
        },
        required: ["data"]
      }
    }
  }]), _defineProperty(_ref, "tool_choice", {
    type: "function",
    "function": {
      name: "transcript_seperation"
    }
  }), _ref;
};

exports.transcript_seperator_config = transcript_seperator_config;

var speech_cofig = function speech_cofig(file) {
  return {
    file: file,
    model: "whisper-1"
  };
};

exports.speech_cofig = speech_cofig;

var compliance_config = function compliance_config(transcript, script, metricRange) {
  var prompt = _prompt.compliance_prompt;
  prompt = prompt.replace("[transcript]", "\"[target]\"");
  prompt = prompt.replace("[script]", "\"".concat(script, "\""));
  prompt = prompt.replace("[callmetrics]", metricRange);
  return {
    model: "gpt-3.5-turbo-1106",
    messages: [{
      role: "system",
      content: prompt
    }],
    temperature: 0,
    tools: [{
      type: "function",
      "function": {
        name: "compliance_analysis",
        parameters: {
          type: "object",
          properties: {
            score: {
              type: "string",
              description: "Score of the compliance"
            },
            explaination: {
              type: "string",
              description: "Get explanation based on the compliance evaluation"
            },
            suggestion: {
              type: "string",
              description: "Get the suggestion of compliance evaluation"
            }
          }
        },
        required: ["score", "explaination", "suggestion"]
      }
    }],
    tool_choice: {
      type: "function",
      "function": {
        name: "compliance_analysis"
      }
    }
  };
};

exports.compliance_config = compliance_config;

var notes_config = function notes_config(transcript) {
  var prompt = _prompt.notes_prompt;
  prompt = prompt.replace("[transcript]", "\"".concat(transcript, "\""));
  return {
    model: "gpt-3.5-turbo-1106",
    messages: [{
      role: "system",
      content: prompt
    }],
    temperature: 0,
    tools: [{
      type: "function",
      "function": {
        name: "suggestion_compliance_analysis",
        parameters: {
          type: "object",
          properties: {
            suggestion: {
              type: "string",
              description: "suggestion"
            }
          }
        },
        required: ["suggestion"]
      }
    }],
    tool_choice: {
      type: "function",
      "function": {
        name: "suggestion_compliance_analysis"
      }
    }
  };
}; // export const prompts = (data, i) => {
//   const toRetrn = [
//     { data: speech_cofig(data) },
//     { data: intent(data) },
//     { data: kpi_config(data) },
//     {},
//     {},
//     {},
//   ];
// };


exports.notes_config = notes_config;