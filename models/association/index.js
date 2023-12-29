import Agents from "../Agents.model.js";
import Compliance from "../Compliance.model.js";
import GroupServiceConfig from "../GroupServiceConfig.model.js";
import Groups from "../Groups.model.js";
import IntentDetails from "../IntentDetails.model.js";
import IntentResult from "../IntentResult.model.js";
import Intents from "../Intents.model.js";
import KpiAnylsis from "../KpiAnylsis.model.js";
import Notes from "../Notes.model.js";
import SentimentAnylsis from "../SentimentAnylsis.model.js";
import TranscriptSeperation from "../TranscriptSeperation.js";
import Transcripts from "../Transcripts.model.js";

export default async function Associations() {
  GroupServiceConfig.hasMany(Intents, {
    foreignKey: "GroupServicePKey",
    sourceKey: "id",
    constraints: false,
  });
  Groups.hasMany(Agents, {
    foreignKey: "agent_group_id",
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
  }); // ##################### trans to compliance
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
  // Transcripts.hasMany(StoredSpeach, {
  //   foreignKey: "transcript_id",
  //   sourceKey: "id",
  //   constraints: false,
  // });
  // StoredSpeach.belongsTo(Transcripts, {
  //   foreignKey: "transcript_id",
  //   targetKey: "id",
  //   constraints: false,
  // });
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
}
