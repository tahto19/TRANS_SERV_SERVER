import dbQuery from "../../../dbQuery";

export const getdata = async (req, res) => {
  try {
    const { ids } = req.body;

    let gQuery = new dbQuery();
    let getLatestUpdate = await gQuery.query(
      `SELECT a.*, b.qa_agent_id,b.qa_queue_id 
        FROM etpbx_ca_queues AS a  JOIN 
        etpbx_ca_queue_agents AS b ON a.id = b.queue_id
        WHERE id IN(${ids.join(",")})
        ORDER BY ID`,
      0
    );

    const base64RegExp =
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;

    getLatestUpdate.forEach(async (v, i) => {
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
    });
  } catch (err) {
    throw err;
  }
};
