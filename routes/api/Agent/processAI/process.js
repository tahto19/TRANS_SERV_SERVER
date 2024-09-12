import {
  changeToJson,
  getBase64,
  isValidDate,
} from "../../../../helper/helpersHere.js";
import GroupServiceConfig from "../../../../models/GroupServiceConfig.model.js";
import Groups from "../../../../models/Groups.model.js";
import Intents from "../../../../models/Intents.model.js";
import Query from "../../../../models/Query.model.js";
import Queue from "../../../../models/Queue.model.js";
import {
  findAgent,
  findTable,
  saveToDatabase,
  updateDataBase,
} from "../../CallAI/helper/Query.js";
import getOrg from "../../CallAI/outsideCall/getDetailsofOrg.js";
import executeRequest from "../../CallAI/proccess/excuteRequest.js";
import processNew from "../../CallAI/proccess/processNew.js";

export const generateUserTranscript = async (user_id, agent_group_id) => {
  try {
    if (user_id !== "" && agent_group_id !== "") {
      var agent = await findAgent(user_id, {
        model: Groups,
        include: {
          model: GroupServiceConfig,
          include: [
            {
              model: Intents,
              attributes: ["intent", "desc", "data", "script"],
              where: { active: true },
            },
          ],
        },
      });
      console.log("running");
      var getQueueList = await findTable(Queue, {
        user_id: user_id,
        status: "Created",
      });
      var org = new getOrg();
      await org.start(81998);
      var apikey = org.getApiByCallback(
        "http://localhost:4118/gateway/mock/callback"
      );

      getQueueList.forEach(async (v, i) => {
        let val = changeToJson(v);
        console.log(val);
        let getQueue_date =
          val.queue_date instanceof Date && !isNaN(val.queue_date);
        if (!getQueue_date) {
          await updateDataBase(
            Queue,
            { where: { id: val.id } },
            {
              queue_date: isValidDate(val.queue_date)
                ? val.queue_date
                : val.createdAt,
            }
          );
        }

        let file = await getBase64(val.filepath);
        if (file) {
          let p = new processNew();
          await p.start(file, apikey, agent);
          let speechToText = p.speechToText();
          let getIntent = p.getIntent();
          let getSentiment = p.getSentiment();
          let getPrompt = p.getGeneratedPrompt();
          //    start prompt
          let er = new executeRequest();
          await er.start(getPrompt, apikey);
          let response = await er.start_call();

          let a = await updateDataBase(
            Queue,
            { where: { id: val.id } },
            { status: "Processed" }
          );
          console.log(a);
          let saveQuery = await saveToDatabase(Query, {
            type: "Transcript,Intent,Sentiment",
            status: "Proccessing",
            code: response.code,
            setup_id: response.id,
            transcript_id: null,
            queue_id: val.id,
          });
        }
      });
      return { getQueueList, agent };
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    console.log("error in generating transcript");
  }
};
