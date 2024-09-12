import axios from "axios";
import dbQuery from "./dbQuery.js";
import "dotenv/config";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const filePath = dirname(fileURLToPath(import.meta.url + "/data"));
const startProc = async () => {
  try {
    let gQuery = new dbQuery();
    let getLatestUpdate = await gQuery.query(
      `SELECT a.*, b.qa_agent_id,b.qa_queue_id 
      FROM etpbx_ca_queues AS a  JOIN 
      etpbx_ca_queue_agents AS b ON a.id = b.queue_id 
      ORDER BY ID DESC LIMIT 2`,
      0
    );

    let getLatestFromNew = await axios({
      url: "http://localhost:5000/listener/",
      method: "GET",
      headers: { "x-auth": "1231231" },
    });

    if (getLatestFromNew.data.result === "error")
      throw new Error("Server error from new insight");
    let toFInd = [];

    getLatestUpdate.forEach((x, i) => {
      let find = getLatestFromNew.data.data.find(
        (xx) => x.id === xx.queue_id && parseInt(x.qa_agent_id) === xx.user_id
      );
      console.log(getLatestUpdate);
      if (find === undefined) {
        toFInd.push(x);
      }
    });
    console.log(
      getLatestUpdate.length,
      toFInd.length,
      getLatestFromNew.data.data
    );

    console.log("Latest Update In Backend: " + getLatestUpdate.length);
    console.log("Length to update to insight: " + toFInd.length);
    console.log("Length data from ETBX: " + getLatestUpdate.length);
    toFInd.forEach(async (v, i) => {
      // let combine = await axios({
      //   method: "POST",
      //   url: v.audio_link.toString().trim(),
      //   data: {
      //     command: "downloadrecording",
      //     accountcode: v.accountcode,
      //     call_id: v.call_id,
      //     filename: v.filename,
      //   },
      //   headers: {
      //     AuthorizationCode: "aX7nP9yX0oT6mB8kE2qW4xH6zN0kG1uN",
      //   },
      //   // responseType: "stream",
      //   responseType: "arraybuffer",
      // });
      // let agent = await axios({
      //   method: "POST",
      //   url: v.audio_link.toString().trim(),
      //   data: {
      //     command: "downloadrecording",
      //     accountcode: v.accountcode,
      //     call_id: v.call_id,
      //     filename: v.filename + "-in",
      //   },
      //   headers: {
      //     AuthorizationCode: "aX7nP9yX0oT6mB8kE2qW4xH6zN0kG1uN",
      //   },
      //   // responseType: "stream",
      //   responseType: "arraybuffer",
      // });
      // let costumer = await axios({
      //   method: "POST",
      //   url: v.audio_link.toString().trim(),
      //   data: {
      //     command: "downloadrecording",
      //     accountcode: v.accountcode,
      //     call_id: v.call_id,
      //     filename: v.filename + "-out",
      //   },
      //   headers: {
      //     AuthorizationCode: "aX7nP9yX0oT6mB8kE2qW4xH6zN0kG1uN",
      //   },
      //   // responseType: "stream",
      //   responseType: "arraybuffer",
      // });
      // let combineM = combine.data.toString("base64");
      // let cxM = costumer.data.toString("base64");
      // let agentM = agent.data.toString("base64");
      let a = await axios({
        method: "POST",
        url: `${process.env.LISTNER_API_END_POINT}/callai/speechTotextFromListener`,
        data: {
          queue_id: v.id,
          // file: [agentM, cxM, combineM],
          group_id: v.qa_queue_id,
          user_id: v.qa_agent_id,
          client_id: v.client_id,
          createdAt: v.createdAt,
          account_code: v.account_code,
        },
        headers: { "x-auth": "from listner" },
      });
    });

    // let path = await new URL(
    //   "../etbxlistener/" + "2024-01-11-10-03-52-sip2-1704967432.13791.mp3",
    //   import.meta.url
    // );

    // const convertedData = await fs.readFileSync(path, (err, data) => {
    //   if (err) handleError(err);
    //   return data;
    // });
    // const base64 = convertedData.toString("base64");

    // await axios({
    //   method: "POST",
    //   url: `${process.env.LISTNER_API_END_POINT}/callai/speechTotextFromListener`,
    //   data: {
    //     queue_id: 6485,
    //     file: base64,
    //     group_id: "0038493621",
    //     user_id: "0038493621",
    //     client_id: 1,
    //   },
    //   headers: { "x-auth": "from listner" },
    // });
    // await fs.writeFile(filePath + toFInd[0].filename, getAIData.data);
    // var stream = fs.createWriteStream("my_file.txt");
  } catch (err) {
    console.warn(err);
    console.log("error found");
  }

  // console.log(getLatestFromNew);
};
export default startProc;
