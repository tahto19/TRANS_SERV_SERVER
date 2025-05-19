import { changeToJson } from "../../../../helper/helpersHere.js";
import Transcripts from "../../../../models/Transcripts.model.js";

const sendDurationCall = async (data) => {
  try {
    let getTranscript = await Transcripts.findOne({
      where: { transcript_id: id },
    });
    if (getTranscript !== null) {
      let r = changeToJson(getTranscript);
      await axios.post(
        "https://ai-insight.etpbx.com/general-info/report/call/create/logs",
        {
          organization_id: data.Groups.organization_id,
          minutes: r.duration,
          agent_count: 1,
        }
      );
    }
  } catch (err) {
    throw err;
  }
};
export default sendDurationCall;
