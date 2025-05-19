import {
  chatgptConfig,
  intent_config,
  sentimental_config,
  speech_cofig,
  transcript_seperator_config,
} from "./assets/chatgptconfig.js";
import { intent_prompt } from "./assets/prompt.js";

class processNew {
  constructor() {
    this.prompts = [];
    this.details;
    this.id;
    this.file;
    this.servicebundles;
    this.api_key;
    this.Intents;
    this.data = {
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AIAPI_KEY,
      },
      data: [],
    };
  }
  start(file, api_key, agent) {
    this.file = file;

    this.api_key = api_key;
    this.Intents = agent.Group.GroupServiceConfigs[0].Intents;
  }
  speechToText() {
    let prompt = speech_cofig(this.file);
    this.prompts.push(prompt);
    this.data.data.push(prompt);
    return prompt;
  }
  getIntent() {
    let createPrompt = this.createPromptIntent(this.Intents);
    let prompt = intent_config(
      null,
      createPrompt.explanation,
      createPrompt.intent_prompt
    );
    this.prompts.push(prompt);
    this.data.data.push(prompt);
    return prompt;
    // return this.createPromptIntent();
  }
  getSentiment() {
    let prompt = sentimental_config();
    this.prompts.push(prompt);
    this.data.data.push(prompt);
    return prompt;
  }
  // getSeperation() {
  //   let prompt = transcript_seperator_config();
  //   this.prompts.push(prompt);
  //   this.data.data.push(prompt);
  //   return prompt;
  // }
  createPromptIntent() {
    const intentNames = this.Intents.map((intent) => intent.intent).join(",");
    const newPrompt = intent_prompt.replace("[callintent]", intentNames);

    const explanations = this.Intents.filter(
      (intent) => intent.desc.trim() !== ""
    )
      .map((intent) => `${intent.intent}: ${intent.desc}`)
      .join("\n");

    const response = {
      response: true,
      intent_prompt: newPrompt,
      explanation: explanations || " ",
    };

    return response;
  }
  getGeneratedPrompt() {
    return this.data;
  }
}
export default processNew;
