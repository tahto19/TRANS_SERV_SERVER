import axios from "axios";
import dbQuery from "./dbQuery.js";
import "dotenv/config";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const filePath = dirname(fileURLToPath(import.meta.url + "/data"));
const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};
const manualProc = async () => {
  try {
    let gQuery = new dbQuery();
    let getLatestUpdate = await gQuery.query(
      `SELECT a.*, b.qa_agent_id,b.qa_queue_id 
      FROM etpbx_ca_queues AS a INNER JOIN 
      etpbx_ca_queue_agents AS b ON a.id = b.queue_id 
      WHERE queue_id IN (220994,220996,229644,229593,229622,229026,229021,229047,228940,228939,229014,228967,228889,228885,228900,228941,229001,228886,228917,228891,228887,228893,228901,228938,228964,228902,228947,228920,228909,228942,229011,228969,229045,228939,228893,228941,228940,228891,228900,228887,228902,228938,228920,228885,228886,228942,228901,228964,228917,228947,229001,228909,228969,229011,229045,229544,229545,229544,229545,228876,228855,228804,228816,228821,228803,228777,228783,228738,228746,228741,228763,228750,228749,228740,228743,228756,228769,228772,228774,228766,228761,228758,228751,228764,228747,228757,228765,228748,228755,228786,228838,228739,228852,228842,228863,228800,228745,228770,228780,228762,228850,228742,228847,228804,228803,228855,228816,228876,228821,228772,228774,228748,228777,228852,228751,228761,228838,228783,228749,228786,228746,228763,228769,228758,228765,228757,228747,228764,228750,228738,228756,228739,228740,228755,228743,228741,228766,228848,228770,228863,228780,228850,228800,228762,228745,228742,228847,228842,228848,233891,233899,233921,233922,233945,233952,233954,233965,233969,233985,233990,234003,234027,234022,234005,234038,234057,234062,234061,234063,234064,234071,234077,234078,234080,234093,234099,234101,234102,234137,234146,234111,234139,234123,234115,234122,234116,234147,234133,234112,234157,234159,234153,234154,234188,234261,234264,234282,234287,234290,234296,234307,234318,234323,234329,234328,234344,234347,234355,234360,234361,234371,234401,234403,234420,234441,234442,234450,234451,234462,234466,234471,234497,234521,234525,234550,234570,234573,234577,234580,234605,234615,234617,234632,234647,234660,234661,234669,234673,234681,234682,234703,234706,234709,234715,234722,234728,234729,234744,234747,234759,234766,234770,234771,234775,234787,234793,234801,234805,234811,234818,234828,234830,234859,234861,234867,234870,234875,234897,234898,234910,234987,234996,234997,235005,235006,235017,235053,235074,235103,235128,235149,235159,235170,235171,235179,235183,235198,235204,235209,235239,235256,235261,235264,235266,235272,235280,235287,235302,235318,235321,235332,235336,235340,235344,235350,235349,235360,235389,235399,235410,235432,235448,235455,235474,235479,235486,235501,235503,235508,235516,235518,235524,235528,235534,235541,235564,235618,235635,235638,235647,235651,235652,235653,235663,235669,235677,235680,235686,235687,235698,235700,235713,235720,235723,235731,235737,235747,235750,235772,235793,235794,235802,235809,235840,235849,235851,235876,235881,235887,235889,235895,235920,235928,235946,235948,235949,235955,235961,235993,235992,236003,236009,236015,236018,236032,236058,236082,236090,236103,236113,236121,236122,236131,236138,236149,236168,236169,236172,236182,236186,236189,236192,236201,236212,236220,236223,236242,236253,236256,236255,236259,236265,236268,236273,236272,236271,236282,236290,236296,236298,236313,236320,236331,236337,236340,236359,236365,236370,236381,236408,236419,236425,236426,236431,236435,236458,236460,236477,236488,236490,236506,236512,236522,236548,236549,236550,236557,236561,236563,236572,236587,236591,236601,236612,236625,236635,236647,236649,236654,236663,236669,236676,236685,236695,236736,236762,236783,236814,236839,236855,236869,236872,236890,236893,236914,236924,236928,236942,236953,236957,236958,236979,236987,236990,236991,237014,237024,237027,237025,237031,237052,237057,237061,237080,237109,237137,237158,237180,237223,237229,237235,237241,237247,237265,237279,237283,237301,237306,237311,237334,237337,237355,237385,237394,237402,237410,237423,237431,237434,237437,237453,237473,237474,237490,237497,237501,237506,237510,237540,237559,237563,237579,237590,237623,237624,237625,237631,237636,237650,237655,237661,237665,237691,237704,237705,237754,237777,237790,237799,237806,237810,237816,237827,237849,237859,237860,237871,237880,237886,237913,237914,237942)
      ORDER BY ID DESC`,
      0
    );
    // done 003923 feb 17
    //  WHERE a.accountcode = '003923' AND timestamp BETWEEN '2025-02-11 00:00:00.000000' AND '2025-02-17 23:59:59.999999'
    // 3      WHERE a.id = 141011
    // 153502
    // 153511
    // 153393
    // WHERE a.updatedAt  BETWEEN '2024-04-04 00:00:00.000000' AND '2024-04-04 20:59:59.999999'
    // WHERE a.createdAt  BETWEEN '2024-03-17 00:00:00.000000' AND '2024-03-18 20:59:59.999999'
    // limit 85
    let start = new Date();
    console.log(
      `TIME: ${start} ` +
        "############### starting manual ###########" +
        getLatestUpdate.length
    );

    for (let i = 0; i < getLatestUpdate.length; i++) {
      // toFInd.forEach(async (v, i) => {
      let v = getLatestUpdate[i];

      console.log("adding " + i);
      let delayres = await delay(2000);
      try {
        let combine = await axios({
          method: "POST",
          url: v.audio_link.toString().trim(),
          data: {
            command: "downloadrecording",
            accountcode: v.accountcode,
            call_id: v.call_id,
            filename: v.filename,
          },
          headers: {
            AuthorizationCode: "aX7nP9yX0oT6mB8kE2qW4xH6zN0kG1uN",
          },
          // responseType: "stream",
          responseType: "arraybuffer",
        });

        let agent = await axios({
          method: "POST",
          url: v.audio_link.toString().trim(),
          data: {
            command: "downloadrecording",
            accountcode: v.accountcode,
            call_id: v.call_id,
            filename: v.filename + "-in",
          },
          headers: {
            AuthorizationCode: "aX7nP9yX0oT6mB8kE2qW4xH6zN0kG1uN",
          },
          // responseType: "stream",
          responseType: "arraybuffer",
        });
        let costumer = await axios({
          method: "POST",
          url: v.audio_link.toString().trim(),
          data: {
            command: "downloadrecording",
            accountcode: v.accountcode,
            call_id: v.call_id,
            filename: v.filename + "-out",
          },
          headers: {
            AuthorizationCode: "aX7nP9yX0oT6mB8kE2qW4xH6zN0kG1uN",
          },
          // responseType: "stream",
          responseType: "arraybuffer",
        });
        let combineM = combine.data.toString("base64");

        // let checkFile = base64RegExp.test(combineM);
        // if (!checkFile) {
        //   console.log("ERROR This is not a base64 format");
        //   console.log(combineM);
        //   console.log("############################" + i);
        // }
        let cxM =
          v.call_type === "outgoing"
            ? agent.data.toString("base64") //
            : costumer.data.toString("base64");
        // let checkFilecxM = base64RegExp.test(cxM);
        // if (!checkFilecxM) {
        //   console.log("ERROR This is not a base64 format");
        //   console.log(checkFilecxM);
        //   console.log("############################" + i);
        // }
        let agentM =
          v.call_type === "incoming"
            ? agent.data.toString("base64")
            : costumer.data.toString("base64");
        // let checkFileagentM = base64RegExp.test(agentM);

        // if (!checkFileagentM) {
        //   console.log("ERROR This is not a base64 format");
        //   console.log(checkFileagentM);
        //   console.log("############################" + i);
        // }
        if (agentM.length < 10 || cxM.length < 10 || combineM.length < 10)
          console.log(agentM, "||", cxM, "||", combineM);
        let ToForce = [
          "0038493608",
          "0038493623",
          "0038493630",
          "0038493650",
          "0038493652",
          "0038493710",
          "0038493712",
          "0038493720",
          "0038493703",
          "0038493626",
        ];
        let group_id =
          ToForce.includes(v.qa_agent_id) && v.call_type === "outgoing"
            ? 3
            : v.qa_queue_id === "0038490082"
            ? "0018490082"
            : v.qa_queue_id;
        var file = [agentM, cxM, combineM];
        if (v.accountcode === "003909") {
          file = [combineM, combineM, combineM];
        }
        if (
          cxM === "M2ZhaWxlZA==" &&
          agentM === "M2ZhaWxlZA==" &&
          combineM === "M2ZhaWxlZA=="
        ) {
          console.log("######");
          console.log("combine data", combineM);
          console.log("######");
          throw new Error(
            "M2ZhaWxlZA== file name queue_id:" + v.id + " code " + v.code
          );
        } else if (
          cxM === "M2ZhaWxlZA==" &&
          agentM === "M2ZhaWxlZA==" &&
          combineM !== "M2ZhaWxlZA=="
        ) {
          file = [combineM, combineM, combineM];
        }

        let data = {
          queue_id: v.id,
          file: file,
          number_dialled: v.number_dialled,
          group_id: group_id,
          user_id: v.qa_agent_id === "" ? null : v.qa_agent_id,
          client_id: v.client_id,
          createdAt: v.timestamp,
          account_code: v.accountcode,
          callerid: v.callerid,
          call_id: v.call_id,
          call_type: v.call_type,
          priority:
            v.accountcode === "003916" ||
            v.accountcode === "003909" ||
            v.accountcode === "003817" ||
            v.accountcode === "003917" ||
            v.accountcode === "003875" ||
            v.accountcode === "003923",
        };
        console.log("sending queue_id: " + v.id);
        let a = await axios({
          method: "POST",
          url: `http://127.0.0.1:5000/callai/fromListener`,
          data,
          headers: { "x-auth": "from listener" },
        });
        console.log(a.data);
      } catch (err) {
        if (err.data !== undefined) {
          console.log(err.data);
          // console.log(err.message);
        } else {
          // console.log(err);
          console.log(err.message);
          console.log("from listening table");
        }
      }
      // });
    }
    console.log(
      `start TIMe: ${start} - end TIME: ${new Date()} ` +
        "################ end manual ###############"
    );
  } catch (err) {
    console.log(err.message);
    console.log("error found");
  }

  // console.log(getLatestFromNew);
};

export default manualProc;
