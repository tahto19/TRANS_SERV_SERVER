import fs from "fs";
import path from "path";

import pump from "pump";
import { v4 as uuidv4 } from "uuid";
import Transcripts from "../models/Transcripts.model.js";
import Groups from "../models/Groups.model.js";
import GroupServiceConfig from "../models/GroupServiceConfig.model.js";
import Intents from "../models/Intents.model.js";
import IntentResult from "../models/IntentResult.model.js";
import IntentDetails from "../models/IntentDetails.model.js";
import { Op } from "sequelize";

export const randomLetters = (length) => {
  let toreturn = "";
  const alphabet =
    "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#~";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    toreturn += alphabet[randomIndex];
  }
  return toreturn;
};
export const getTimeStamp = (date) => {
  let getDate =
    date === undefined ? new Date().getTime() : new Date(date).getTime();
  const currentTimestamp = getDate;
  return currentTimestamp;
};
export const changeToJson = (data) => {
  return data.toJSON();
};
export const uploadDestination = async (dest, files, ext) => {
  try {
    const filepath = [];
    for await (const file of files) {
      if (file.type === "file") {
        console.log(file);
        let extension =
          file.filename.split(".")[file.filename.split(".").length - 1];

        if (extension.includes(ext) || ext === undefined) {
          let filename = `${getTimeStamp()}-${randomLetters(5)}-${randomLetters(
            7
          )}.${extension}`;
          let newUrl = await new URL(
            "../upload/" + dest + "/" + filename,
            import.meta.url
          );

          await pump(file.file, await fs.createWriteStream(newUrl), (error) => {
            if (error) {
              throw new Error(error.message);
            } else {
            }
          });
          filepath.push(newUrl.href);
        }
      }
    }
    return filepath;
  } catch (err) {
    console.log(err);
    return err;
  }
};
export const uploadQueueFile = async (dest, file, ext, f) => {
  try {
    let filename = `${getTimeStamp()}-${randomLetters(5)}-${randomLetters(
      7
    )}.mp3`;
    let path_ = await new URL(
      "../upload/" + dest + "/" + filename,
      import.meta.url
    );
    let buff = file;

    if (f === undefined) buff = Buffer.from(file, "base64");
    await fs.writeFileSync(path_, buff);
    let getvalue = await fs.readFileSync(path_, "utf-8");

    let getFileNameSave = path_.pathname.split("upload/audio/");
    if (filename !== getFileNameSave[1]) {
      fs.unlinkSync(path_);

      let getPath = await uploadQueueFile("audio", file);

      let a = getPath.split("audio/");

      getFileNameSave[1] = a[1];
    }

    if (getvalue.includes("failed")) {
      console.log(getvalue);
      fs.unlinkSync(path);
      return false;
    } else {
      let toReturn = dest + "/" + getFileNameSave[1];
      console.log(toReturn);
      console.log("toReturn");
      return toReturn;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
export const shortSaveToDatabase = async (db, data) => {
  let r = await db.create(data);
  return r;
};
export class changeFormat {
  constructor() {
    this.path;
    this.buffer;
  }
  start(path) {
    this.path = path;
  }
  async toBuffer() {
    return await fs.readFileSync(this.path);
  }
  async tobase64() {
    let buffer = await this.toBuffer();
    return buffer.toString("base64");
  }
}
export const getBase64 = async (filepath) => {
  try {
    let newUrl = await new URL("../upload/" + filepath, import.meta.url);
    console.log(newUrl);
    const bitmap = fs.readFileSync(newUrl);
    return bitmap.toString("base64");
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const filterIntents = (data) => {
  let intents = JSON.parse(data);

  let filtered_intent = {
    main_intent: {},
    sub_intents: [],
  };

  const filter_main = intents.intents.reduce((maxObject, currentObject) => {
    return currentObject.score > maxObject.score ? currentObject : maxObject;
  }, intents.intents[0]);

  filtered_intent.main_intent = filter_main;

  const filter_sub = intents.intents.filter((x) => {
    const score = filtered_intent.main_intent.score - x.score;
    return (
      x !== filtered_intent.main_intent &&
      (x.score > 0.5 || score == 0.1 || score == 0.2)
    );
  });
  filtered_intent.sub_intents = filter_sub;

  return filtered_intent;
};
export const getConfigurationByTranscriptId = async (id, name) => {
  try {
    let r = await Transcripts.findOne({
      where: { id },
      include: [
        {
          model: Groups,
          include: [
            {
              model: GroupServiceConfig,
              // attributes: [],
              include: [
                {
                  model: Intents,
                  where: { active: true },
                },
              ],
            },
          ],
        },
      ],
    });
    let a = r.Group.GroupServiceConfigs[0].Intents.find(
      (x) => x.intent.toLowerCase() === name.toLowerCase()
    );
    return a === undefined ? false : a.id;
  } catch (err) {
    console.log(id);
  }
};
export const isValidDate = function (date) {
  return new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
};
export const unlink = async (path) => {
  console.log(path);
};
