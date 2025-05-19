import { changeToJson } from "../../../../helper/helpersHere.js";
import StoredSpeech from "../../../../models/StoredSpeech.model.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import axios from "axios";
const sendDurationCall = async (data, id, total) => {
  try {
    console.log("running sendDuration");
    let getTranscript = await StoredSpeech.findOne({
      where: { transcript_id: id },
    });
    let getTranscript_details = await Transcripts.findOne({
      where: { id: id },
    });
    if (getTranscript !== null && getTranscript_details !== null) {
      let r = changeToJson(getTranscript);
      let trans_details = changeToJson(getTranscript_details);
      await axios.post(
        "https://ai-insight.etpbx.com/general-info/report/call/create/logs",
        {
          organization_id: data.Group.organization_id,
          minutes: r.duration / 60,
          agent_count: total,
          call_date: trans_details.queue_date,
        }
      );
    } else {
      console.log(id);
    }
  } catch (err) {
    throw err;
  }
};
export default sendDurationCall;
