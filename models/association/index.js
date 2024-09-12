import AgentLists from "../AgentLists.model.js";
import Agents from "../Agents.model.js";
import Compliance from "../Compliance.model.js";
import GroupServiceConfig from "../GroupServiceConfig.model.js";
import Groups from "../Groups.model.js";
import IntentDetails from "../IntentDetails.model.js";
import IntentMetrics from "../IntentMetrics.model.js";
import IntentResult from "../IntentResult.model.js";
import Intents from "../Intents.model.js";
import KpiAnylsis from "../KpiAnylsis.model.js";
import Notes from "../Notes.model.js";
import NotesConfig from "../NotesConfig.model.js";
import NotesDetails from "../NotesDetails.model.js";
import PiiFilter from "../PiiFilter.model.js";
import PiiResult from "../PiiResult.model.js";
import Query from "../Query.model.js";
import Queue from "../Queue.model.js";
import SentimentAnylsis from "../SentimentAnylsis.model.js";
import StoredSpeech from "../StoredSpeech.model.js";
import TranscriptSeperation from "../TranscriptSeperation.js";
import Transcripts from "../Transcripts.model.js";
import averageTotal from "../averageTotal.model.js";
import callDuration from "../callduration.model.js";
import HighlightConfig from "../HighlightConfig.model.js";
import OrgIntentMetrics from "../OrgIntentMetrics.model.js";
import OrgIntentsConf from "../OrgIntentsConf.model.js";
import OrgHighConfig from "../OrgHighConfig.mode.js";
import OrgNotesConfig from "../OrgNotesConfig.model.js";
import OrgPiiFilter from "../OrgPiiFilter.model.js";
export default async function Associations() {
  GroupServiceConfig.hasMany(Intents, {
    foreignKey: "GroupServicePKey",
    sourceKey: "id",
    constraints: false,
  });
  Intents.hasOne(HighlightConfig, {
    foreignKey: "intent_id",
    sourceKey: "id",
    constraints: false,
  });
  HighlightConfig.hasOne(Intents, {
    foreignKey: "intent_id",
    targetKey: "id",
    constraints: false,
  });
  Intents.belongsTo(GroupServiceConfig, {
    foreignKey: "GroupServicePKey",
    targetKey: "id",
    constraints: false,
  });
  Intents.hasOne(NotesConfig, {
    foreignKey: "intent_id",
    sourceKey: "id",
    constraints: false,
  });
  NotesConfig.belongsTo(Intents, {
    foreignKey: "intent_id",
    targetKey: "id",
    constraints: false,
  });
  Intents.hasMany(IntentMetrics, {
    foreignKey: "intent_id",
    sourceKey: "id",
    constraints: false,
  });
  IntentMetrics.belongsTo(Intents, {
    foreignKey: "intent_id",
    targetKey: "id",
    constraints: false,
  });
  Groups.hasMany(GroupServiceConfig, {
    foreignKey: "groupId",
    sourceKey: "id",
    constraints: false,
  });
  GroupServiceConfig.belongsTo(Groups, {
    foreignKey: "groupId",
    targetKey: "id",
    constraints: false,
  });
  Groups.hasMany(Agents, {
    foreignKey: "agent_group_id",
    sourceKey: "id",
    constraints: false,
  });
  Agents.belongsTo(Groups, {
    foreignKey: "agent_group_id",
    targetKey: "id",
    constraints: false,
  });
  AgentLists.hasMany(Agents, {
    foreignKey: "user_conn",
    sourceKey: "id",
    constraints: false,
  });
  Agents.belongsTo(AgentLists, {
    foreignKey: "user_conn",
    targetKey: "id",
    constraints: false,
  });
  Query.hasMany(Transcripts, {
    foreignKey: "id",
    sourceKey: "transcript_id",
    constraints: false,
  });
  Transcripts.belongsTo(Query, {
    foreignKey: "id",
    targetKey: "transcript_id",
    constraints: false,
  });
  Query.belongsTo(Queue, {
    foreignKey: "queue_id",
    targetKey: "id",
    constraints: false,
  });
  Queue.hasMany(Query, {
    foreignKey: "queue_id",
    sourceKey: "id",
    constraints: false,
  });
  Agents.hasMany(Transcripts, {
    foreignKey: "agent_id",
    sourceKey: "id",
    constraints: false,
  });
  Transcripts.belongsTo(Agents, {
    foreignKey: "agent_id",
    targetKey: "id",
    constraints: false,
  });
  Groups.hasMany(Transcripts, {
    foreignKey: "group_id",
    sourceKey: "id",
    constraints: false,
  });
  Transcripts.belongsTo(Groups, {
    foreignKey: "group_id",
    targetKey: "id",
    constraints: false,
  }); // ##################### trans to notes
  Transcripts.hasOne(Notes, {
    foreignKey: "transcript_id",
    sourceKey: "id",
    constraints: false,
  });
  Notes.belongsTo(Transcripts, {
    foreignKey: "transcript_id",
    targetKey: "id",
    constraints: false,
  });
  Transcripts.hasOne(PiiResult, {
    foreignKey: "transcript_id",
    sourceKey: "id",
    constraints: false,
  });
  PiiResult.belongsTo(Transcripts, {
    foreignKey: "transcript_id",
    targetKey: "id",
    constraints: false,
  });
  Notes.hasMany(NotesDetails, {
    foreignKey: "notes_id",
    sourceKey: "id",
    constraints: false,
  });
  NotesDetails.belongsTo(Notes, {
    foreignKey: "notes_id",
    targetKey: "id",
    constraints: false,
  });
  // ##################### trans to compliance
  Transcripts.hasOne(Compliance, {
    foreignKey: "transcript_id",
    sourceKey: "id",
    constraints: false,
  });
  Compliance.belongsTo(Transcripts, {
    foreignKey: "transcript_id",
    targetKey: "id",
    constraints: false,
  });
  // ##################### trans to intentresults
  Transcripts.hasMany(IntentResult, {
    foreignKey: "transcript_id",
    sourceKey: "id",
    constraints: false,
  });
  IntentResult.belongsTo(Transcripts, {
    foreignKey: "transcript_id",
    targetKey: "id",
    constraints: false,
  });
  // ##################### trans to kpi
  Transcripts.hasMany(KpiAnylsis, {
    foreignKey: "transcript_id",
    sourceKey: "id",
    constraints: false,
  });
  KpiAnylsis.belongsTo(Transcripts, {
    foreignKey: "transcript_id",
    targetKey: "id",
    constraints: false,
  });
  // ##################### trans to senti
  Transcripts.hasMany(SentimentAnylsis, {
    foreignKey: "transcript_id",
    sourceKey: "id",
    constraints: false,
  });
  SentimentAnylsis.belongsTo(Transcripts, {
    foreignKey: "transcript_id",
    targetKey: "id",
    constraints: false,
  }); //
  // ##################### trans to transcripts
  Transcripts.hasMany(StoredSpeech, {
    foreignKey: { name: "transcript_id", allowNull: true },
    sourceKey: "id",
    constraints: false,
  });
  StoredSpeech.belongsTo(Transcripts, {
    foreignKey: { name: "transcript_id", allowNull: true },
    targetKey: "id",
    constraints: false,
  });
  Queue.hasMany(StoredSpeech, {
    foreignKey: "queueId",
    sourceKey: "id",
    constraints: false,
  });
  StoredSpeech.belongsTo(Queue, {
    foreignKey: "queueId",
    targetKey: "id",
    constraints: false,
  });
  // ##################### trans to seperate

  Transcripts.hasOne(TranscriptSeperation, {
    foreignKey: "transcript_id",
    sourceKey: "id",
    constraints: false,
  });
  TranscriptSeperation.belongsTo(Transcripts, {
    foreignKey: "transcript_id",
    targetKey: "id",
    constraints: false,
  });
  // ##################### IntentResult to IntentDetails sub_intent

  Transcripts.hasOne(averageTotal, {
    foreignKey: "transcript_id",
    sourceKey: "id",
    constraints: false,
  });
  averageTotal.belongsTo(Transcripts, {
    foreignKey: "transcript_id",
    targetKey: "id",
    constraints: false,
  }); // ################# notif##############
  IntentDetails.hasOne(IntentResult, {
    foreignKey: "sub_intent_id",
    sourceKey: "id",
    constraints: false,
  });
  IntentResult.belongsTo(IntentDetails, {
    as: "sub_intent",
    foreignKey: "sub_intent_id",
    targetKey: "id",
    constraints: false,
  });
  IntentDetails.hasOne(Intents, {
    foreignKey: "id",
    sourceKey: "conn",
    constraints: false,
  });
  Intents.belongsTo(IntentDetails, {
    foreignKey: "id",
    targetKey: "conn",
    constraints: false,
  });
  Intents.hasOne(PiiFilter, {
    foreignKey: "intent_id",
    sourceKey: "id",
    constraints: false,
  });
  PiiFilter.hasOne(Intents, {
    foreignKey: "intent_id",
    targetKey: "id",
    constraints: false,
  });
  // ##################### IntentResult to IntentDetails main_intent
  IntentDetails.hasOne(IntentResult, {
    foreignKey: "main_intent_id",
    sourceKey: "id",
    constraints: false,
  });
  IntentResult.belongsTo(IntentDetails, {
    as: "main_intent",
    foreignKey: "main_intent_id",
    targetKey: "id",
    constraints: false,
  });
  // ##################### IntentResult to IntentDetails sub_intent

  Transcripts.hasOne(averageTotal, {
    foreignKey: "transcript_id",
    sourceKey: "id",
    constraints: false,
  });
  averageTotal.belongsTo(Transcripts, {
    foreignKey: "transcript_id",
    targetKey: "id",
    constraints: false,
  });
  // ################# notif##############
  // ################# call Duration ##############
  Transcripts.hasOne(callDuration, {
    foreignKey: "transcript_id",
    sourceKey: "id",
    constraints: false,
  });
  callDuration.belongsTo(Transcripts, {
    foreignKey: "transcript_id",
    targetKey: "id",
    constraints: false,
  });
  Agents.hasOne(callDuration, {
    foreignKey: "agent_id",
    sourceKey: "id",
    constraints: false,
  });
  callDuration.belongsTo(Agents, {
    foreignKey: "agent_id",
    targetKey: "id",
    constraints: false,
  });
  Groups.hasOne(callDuration, {
    foreignKey: "group_id",
    sourceKey: "id",
    constraints: false,
  });
  callDuration.belongsTo(Groups, {
    foreignKey: "group_id",
    targetKey: "id",
    constraints: false,
  });
  // ################# Call Duration##############

  // ################### intent_org #####################
  OrgIntentsConf.hasMany(OrgIntentMetrics, {
    foreignKey: "intent_id",
    sourceKey: "id",
    constraints: false,
  });
  OrgIntentMetrics.belongsTo(OrgIntentsConf, {
    foreignKey: "intent_id",
    targetKey: "id",
    constraints: false,
  });
  OrgIntentsConf.hasOne(OrgNotesConfig, {
    foreignKey: "intent_id",
    sourceKey: "id",
    constraints: false,
  });
  OrgNotesConfig.belongsTo(OrgIntentsConf, {
    foreignKey: "intent_id",
    targetKey: "id",
    constraints: false,
  });
  OrgIntentsConf.hasOne(OrgHighConfig, {
    foreignKey: "intent_id",
    sourceKey: "id",
    constraints: false,
  });
  OrgHighConfig.belongsTo(OrgIntentsConf, {
    foreignKey: "intent_id",
    targetKey: "id",
    constraints: false,
  });

  OrgIntentsConf.hasOne(OrgPiiFilter, {
    foreignKey: "intent_id",
    sourceKey: "id",
    constraints: false,
  });
  OrgPiiFilter.belongsTo(OrgIntentsConf, {
    foreignKey: "intent_id",
    targetKey: "id",
    constraints: false,
  });
  OrgIntentsConf.hasMany(Intents, {
    foreignKey: "orgIntentConn",
    sourceKey: "id",
    constraints: false,
  });
  Intents.belongsTo(OrgIntentsConf, {
    foreignKey: "orgIntentConn",
    targetKey: "id",
    constraints: false,
  });
  // ################### end intent_org #####################
}
