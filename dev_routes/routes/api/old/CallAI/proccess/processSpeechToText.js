// const Request = require("../_helpers/request");
import fs from "fs";
import { URL } from "url";
import { handleError, proccessIntent } from "./proccess.js";
import { speech_cofig } from "./assets/chatgptconfig.js";
import executeRequest from "./excuteRequest.js";

export class processSpeechToText {
  constructor() {
    this.path;
    this.promt;
    this.details;
    this.id;
    this.file;
    this.data = [
      {
        headers: {
          Authorization: "Bearer " + process.env.OPEN_AIAPI_KEY,
        },
      },
    ];
  }
  async process(filepath, file) {
    this.path = filepath;
    this.file = file;
  }
  async getPromptAndeChangeToBase64() {
    try {
      const convertedData = await fs.readFileSync(this.path, (err, data) => {
        if (err) handleError(err);
        return data;
      });

      const base64Data = convertedData.toString("base64");
      this.prompt = speech_cofig(base64Data);
      return this.prompt;
    } catch (err) {
      console.log(err);
      handleError(err);
    }
  }
  async executePromptWithOutChangeFile() {
    this.prompt = speech_cofig(this.file);
    return this.prompt;
  }
  async executeRequests(apikey) {
    let a = this.request(apikey);
    this.details = a;
    return a;
  }

  async request(apikey) {
    try {
      let er = await new executeRequest();
      await er.start(this.prompt, apikey);
      let a = await er.create();

      return a;
    } catch (err) {
      handleError(err.message);
    }
  }
}
