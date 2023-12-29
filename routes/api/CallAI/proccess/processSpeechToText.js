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
  }
  async process(filepath) {
    this.path = filepath;
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
  async executeRequest() {
    let a = this.request(this.prompt);
    this.details = a;
    return a;
  }

  async request(prompt, data) {
    let a = {
      id: data === undefined ? null : data.id,
      details: data === undefined ? null : data.details,
    };
    try {
      let er = await new executeRequest();
      await er.start(prompt);
      let i = 0;
      let j = 0;
      while (a.id === null) {
        if (j !== 0) console.log("Attempting to reconnect create " + j);
        a.id = await er.create();
        j++;
      }

      while (a.details === null) {
        if (i !== 0) {
          console.log("Attempting to reconnect get " + i);
          // a.details = await er.callback();
        }
        // else

        a.details = await er.execute();
        i++;
      }
      console.log(a);
      return a;
    } catch (err) {
      handleError(err.message);
    }
  }
}
