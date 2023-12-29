import fs from "fs";

import pump from "pump";
import { v4 as uuidv4 } from "uuid";
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
