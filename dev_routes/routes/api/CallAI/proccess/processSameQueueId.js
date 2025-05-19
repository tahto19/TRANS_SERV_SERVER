import { changeToJson } from "../../../../helper/helpersHere.js";
import { changeSend } from "../../../../helper/toSend.js";
import Agents from "../../../../models/Agents.model.js";
import Compliance from "../../../../models/Compliance.model.js";
import IntentDetails from "../../../../models/IntentDetails.model.js";
import IntentResult from "../../../../models/IntentResult.model.js";
import KpiAnylsis from "../../../../models/KpiAnylsis.model.js";
import Notes from "../../../../models/Notes.model.js";
import Query from "../../../../models/Query.model.js";
import Queue from "../../../../models/Queue.model.js";
import SentimentAnylsis from "../../../../models/SentimentAnylsis.model.js";
import StoredSpeech from "../../../../models/StoredSpeech.model.js";
import TranscriptSeperation from "../../../../models/TranscriptSeperation.js";
import Transcripts from "../../../../models/Transcripts.model.js";
import averageTotal from "../../../../models/averageTotal.model.js";

const processSameQueueId = async (queue_id, user_id, user_group_id) => {
  try {
    let getAgentInfo = await Agents.findOne({
      where: { user_id, agent_group_id: user_group_id },
    });
    if (getAgentInfo === null) throw new Error("No Agent in the group");
    let agentInfo = changeToJson(getAgentInfo);
    let findQueue = await Query.findAll({
      include: [
        { required: true, model: Queue, where: { queue_id } },
        {
          required: true,
          model: Transcripts,
          include: [
            {
              required: true,
              model: TranscriptSeperation,
            },
            {
              required: true,
              model: Notes,
            },
            {
              required: true,
              model: KpiAnylsis,
            },
            { required: true, model: Compliance },
            {
              required: true,
              model: SentimentAnylsis,
            },

            {
              required: true,
              model: StoredSpeech,
            },
            {
              required: true,
              model: averageTotal,
            },
            {
              required: true,
              model: IntentResult,

              include: [
                {
                  required: true,
                  model: IntentDetails,
                  as: "main_intent",
                },
                {
                  model: IntentDetails,
                  as: "sub_intent",
                },
              ],
            },
          ],
        },
      ],
      //   limit: 2,
    });
    if (findQueue.length === 0) throw new Error("processing");
    let queue = changeToJson(findQueue[0]);
    let transcript = queue.Transcripts[0];
    let seperate = transcript.TranscriptsSeperate;
    let note = transcript.note;
    let KpiAnylses = transcript.KpiAnylses;
    let compliance = transcript.Compliance;
    let sentiAnylses = transcript.SentiAnylses;
    let average_total = transcript.average_total;
    let IntentResults = transcript.IntentResults;
    let StoredSpeeches = transcript.StoredSpeeches;
    // save transcripts
    let saveTranscript = await Transcripts.create({
      group_id: user_group_id,
      agent_id: agentInfo.id,
      queue_date: transcript,
      callerid: transcript.callerid,
      call_id: transcript.call_id,
      call_type: transcript.call_type,
      content: transcript.content,
    });
    let transcript_id = saveTranscript.id;

    // save seperation
    await TranscriptSeperation.create({
      agentSegment: seperate.agentSegment,
      costumerSegment: seperate.costumerSegment,
      combineSegment: seperate.combineSegment,
      transcript_id,
    });

    // save note
    await Notes.create({
      notes: note.notes,
      transcript_id,
    });
    // save kpi
    KpiAnylses.forEach((v) => {
      v.transcript_id = transcript_id;
      v.id = null;
      //   console.log(v);
      KpiAnylsis.create(v);
    });
    // Compliance
    Compliance.create({
      transcript_id,
      score: compliance.score,
      explaination: compliance.explaination,
    });
    // SentimentAnylsis
    SentimentAnylsis.create({
      transcript_id,
      sentiment_score: sentiAnylses[0].sentiment_score,
      sentiment_name: sentiAnylses[0].sentiment_name,
      explanation: sentiAnylses[0].explanation,
      setup_id: sentiAnylses[0].setup_id,
    });
    console.log("####################transcript_id");
    console.log(transcript_id);
    console.log(average_total);
    console.log("####################transcript_id");
    averageTotal.create({
      transcript_id,
      compliance: average_total.compliance,
      csat: average_total.csat,
      csatScore: average_total.csatScore,
      complianceScore: average_total.complianceScore,
      status: average_total.status,
    });

    let intent = await IntentResult.create({
      transcript_id,
      main_intent_id: IntentResults[0].main_intent_id,
      sub_intent_id: IntentResults[0].sub_intent_id,
      setup_id: IntentResults[0].setup_id,
    });
    // save main intent result
    let m_i = IntentResults[0].main_intent;
    IntentDetails.create({
      intent_name: m_i.intent_name,
      desc: m_i.desc,
      score: m_i.score,
      conn: m_i.conn,
    });
    if (IntentResults[0].sub_intent_id !== null) {
      let s_i = IntentResults[0].sub_intent;
      IntentDetails.create({
        intent_name: s_i.intent_name,
        desc: s_i.desc,
        score: s_i.score,
        conn: s_i.conn,
      });
    }
    StoredSpeeches.forEach(async (v) => {
      let a = v;
      a["transcript_id"] = transcript_id;
      delete a.id;
      console.log(a);
      await StoredSpeech.create(a);
    });

    Query.create({
      type: "Transfer call",
      code: "Transfer call",
      queue_id: queue.Queue.id,
      transcript_id,
      status: "Done",
      setup_id: 1,
      query: 0,
    });
    return transcript;
  } catch (err) {
    console.log(err);
    return err.message === "processing" ? err.message : false;
  }
};
export default processSameQueueId;
