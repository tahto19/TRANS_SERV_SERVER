import TranscriptSeperation from "../../../../models/TranscriptSeperation.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import { transcript_seperator_config } from "../../CallAI/proccess/assets/chatgptconfig.js";
import executeRequest from "../../CallAI/proccess/excuteRequest.js";

export class proccess {
  constructor() {
    this.id = "";
  }
  start(id) {
    this.id = id;
  }
  async create(id) {
    let getId = id === undefined ? this.id : id;
    var prompt = await this.createPrompt(getId);
    let r = await this.request(prompt);
    let saveToDB = await this.saveIntoDatabase(TranscriptSeperation, {
      transcript_id: getId,
      content: r.details,
      setup_id: r.id,
    });
    return saveToDB;
  }

  async createPrompt(id) {
    var findTranscript = await Transcripts.findByPk(id);
    var toPrompt = await transcript_seperator_config(findTranscript.content);
    return toPrompt;
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
      console.log(a);
      while (a.details === null) {
        if (i !== 0) {
          console.log("Attempting to reconnect get " + i);
        }

        a.details = await er.execute();
        console.log(a.details);
        i++;
      }

      return a;
    } catch (err) {
      handleError(err.message);
    }
  }
  async saveIntoDatabase(table, data) {
    try {
      let save = await table.create(data);
      return save;
    } catch (err) {
      handleError(err.message);
    }
  }
}
export function handleError(message) {
  let error = new Error(message);
  error.code = 400;
  error.statusCode = 400;
  throw error;
}
