import {
  compliance_config,
  kpi_config,
  notes_config,
  speech_cofig,
  transcript_seperator_config,
} from "./assets/chatgptconfig.js";
import { kpi_prompt } from "./assets/prompt.js";

class processNewKPI {
  constructor() {
    this.transcript;
    this.transcript_id;
    this.intent;
    this.kpi;
    this.metric_range;
    this.data = {
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AIAPI_KEY,
      },
      data: [],
    };
    this.prompts = [];
  }
  start(transcript_id, transcript, intentsInfo, intent, metric_range, file) {
    this.transcript = transcript;
    this.transcript_id = transcript_id;
    let getMainIntent = intentsInfo.find((x) => {
      return x.intent === intent.main_intent.name;
    });
    this.kpi_array = getMainIntent;
    this.metric_range = metric_range;
    this.file = file;
    this.speechToText();
    this.complianceprompt();
    // this.getSeperation();
    this.kpiprompt();

    return this.prompt();
  }
  speechToText() {
    let prompt = speech_cofig(this.file);
    this.prompts.push(prompt);
    this.data.data.push(prompt);
    return prompt;
  }
  kpiprompt() {
    let array = [];
    let prompt = kpi_prompt;
    for (let i = 0; i < this.kpi_array.data.length; i++) {
      const kpi_name = this.kpi_array.data[i].call_quality;
      const kpi_explanation = this.kpi_array.data[i].metric_desc;
      array.push("\n" + "- " + kpi_name + ":if" + kpi_explanation);
    }

    prompt = prompt.replace("[kpi_array]", array.join(""));
    prompt = prompt.replace("[transcript]", `"${this.transcript}"`);
    prompt = prompt.replace("[metricrange]", this.metric_range);
    let config = kpi_config(prompt);
    this.prompts.push(config);
    this.data.data.push(config);
    return config;
  }
  complianceprompt() {
    let config = compliance_config(
      this.transcript,
      this.kpi_array.script,
      this.metric_range
    );
    this.prompts.push(config);
    this.data.data.push(config);
    this.getSeperation();
    this.notesPrompt();

    return config;
  }
  getSeperation() {
    let prompt = transcript_seperator_config(this.transcript);
    this.prompts.push(prompt);
    this.data.data.push(prompt);
    return prompt;
  }
  notesPrompt() {
    let config = notes_config(this.transcript, this.kpi_array.script);
    this.prompts.push(config);
    this.data.data.push(config);
    return config;
  }
  prompt() {
    return this.data;
  }
}
export default processNewKPI;
