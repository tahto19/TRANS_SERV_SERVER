"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Associations;

var _AgentListsModel = _interopRequireDefault(require("../AgentLists.model.js"));

var _AgentsModel = _interopRequireDefault(require("../Agents.model.js"));

var _ComplianceModel = _interopRequireDefault(require("../Compliance.model.js"));

var _GroupServiceConfigModel = _interopRequireDefault(require("../GroupServiceConfig.model.js"));

var _GroupsModel = _interopRequireDefault(require("../Groups.model.js"));

var _IntentDetailsModel = _interopRequireDefault(require("../IntentDetails.model.js"));

var _IntentResultModel = _interopRequireDefault(require("../IntentResult.model.js"));

var _IntentsModel = _interopRequireDefault(require("../Intents.model.js"));

var _KpiAnylsisModel = _interopRequireDefault(require("../KpiAnylsis.model.js"));

var _NotesModel = _interopRequireDefault(require("../Notes.model.js"));

var _NotesConfigModel = _interopRequireDefault(require("../NotesConfig.model.js"));

var _NotesDetailsModel = _interopRequireDefault(require("../NotesDetails.model.js"));

var _PiiFilterModel = _interopRequireDefault(require("../PiiFilter.model.js"));

var _QueryModel = _interopRequireDefault(require("../Query.model.js"));

var _QueueModel = _interopRequireDefault(require("../Queue.model.js"));

var _SentimentAnylsisModel = _interopRequireDefault(require("../SentimentAnylsis.model.js"));

var _StoredSpeechModel = _interopRequireDefault(require("../StoredSpeech.model.js"));

var _TranscriptSeperation = _interopRequireDefault(require("../TranscriptSeperation.js"));

var _TranscriptsModel = _interopRequireDefault(require("../Transcripts.model.js"));

var _averageTotalModel = _interopRequireDefault(require("../averageTotal.model.js"));

var _calldurationModel = _interopRequireDefault(require("../callduration.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function Associations() {
  return regeneratorRuntime.async(function Associations$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _GroupServiceConfigModel["default"].hasMany(_IntentsModel["default"], {
            foreignKey: "GroupServicePKey",
            sourceKey: "id",
            constraints: false
          });

          _IntentsModel["default"].belongsTo(_GroupServiceConfigModel["default"], {
            foreignKey: "GroupServicePKey",
            targetKey: "id",
            constraints: false
          });

          _GroupServiceConfigModel["default"].hasOne(_NotesConfigModel["default"], {
            foreignKey: "GroupServicePKey",
            sourceKey: "id",
            constraints: false
          });

          _NotesConfigModel["default"].belongsTo(_GroupServiceConfigModel["default"], {
            foreignKey: "GroupServicePKey",
            targetKey: "id",
            constraints: false
          });

          _GroupsModel["default"].hasMany(_GroupServiceConfigModel["default"], {
            foreignKey: "groupId",
            sourceKey: "id",
            constraints: false
          });

          _GroupServiceConfigModel["default"].belongsTo(_GroupsModel["default"], {
            foreignKey: "groupId",
            targetKey: "id",
            constraints: false
          });

          _GroupsModel["default"].hasMany(_AgentsModel["default"], {
            foreignKey: "agent_group_id",
            sourceKey: "id",
            constraints: false
          });

          _AgentsModel["default"].belongsTo(_GroupsModel["default"], {
            foreignKey: "agent_group_id",
            targetKey: "id",
            constraints: false
          });

          _AgentListsModel["default"].hasMany(_AgentsModel["default"], {
            foreignKey: "user_id",
            sourceKey: "user_id",
            constraints: false
          });

          _AgentsModel["default"].belongsTo(_AgentListsModel["default"], {
            foreignKey: "user_id",
            targetKey: "user_id",
            constraints: false
          });

          _QueryModel["default"].hasMany(_TranscriptsModel["default"], {
            foreignKey: "id",
            sourceKey: "transcript_id",
            constraints: false
          });

          _TranscriptsModel["default"].belongsTo(_QueryModel["default"], {
            foreignKey: "id",
            targetKey: "transcript_id",
            constraints: false
          });

          _QueryModel["default"].belongsTo(_QueueModel["default"], {
            foreignKey: "queue_id",
            targetKey: "id",
            constraints: false
          });

          _QueueModel["default"].hasMany(_QueryModel["default"], {
            foreignKey: "queue_id",
            sourceKey: "id",
            constraints: false
          });

          _AgentsModel["default"].hasMany(_TranscriptsModel["default"], {
            foreignKey: "agent_id",
            sourceKey: "id",
            constraints: false
          });

          _TranscriptsModel["default"].belongsTo(_AgentsModel["default"], {
            foreignKey: "agent_id",
            targetKey: "id",
            constraints: false
          });

          _GroupsModel["default"].hasMany(_TranscriptsModel["default"], {
            foreignKey: "group_id",
            sourceKey: "id",
            constraints: false
          });

          _TranscriptsModel["default"].belongsTo(_GroupsModel["default"], {
            foreignKey: "group_id",
            targetKey: "id",
            constraints: false
          }); // ##################### trans to notes


          _TranscriptsModel["default"].hasOne(_NotesModel["default"], {
            foreignKey: "transcript_id",
            sourceKey: "id",
            constraints: false
          });

          _NotesModel["default"].belongsTo(_TranscriptsModel["default"], {
            foreignKey: "transcript_id",
            targetKey: "id",
            constraints: false
          });

          _NotesModel["default"].hasMany(_NotesDetailsModel["default"], {
            foreignKey: "notes_id",
            sourceKey: "id",
            constraints: false
          });

          _NotesDetailsModel["default"].belongsTo(_NotesModel["default"], {
            foreignKey: "notes_id",
            targetKey: "id",
            constraints: false
          }); // ##################### trans to compliance


          _TranscriptsModel["default"].hasOne(_ComplianceModel["default"], {
            foreignKey: "transcript_id",
            sourceKey: "id",
            constraints: false
          });

          _ComplianceModel["default"].belongsTo(_TranscriptsModel["default"], {
            foreignKey: "transcript_id",
            targetKey: "id",
            constraints: false
          }); // ##################### trans to intentresults


          _TranscriptsModel["default"].hasMany(_IntentResultModel["default"], {
            foreignKey: "transcript_id",
            sourceKey: "id",
            constraints: false
          });

          _IntentResultModel["default"].belongsTo(_TranscriptsModel["default"], {
            foreignKey: "transcript_id",
            targetKey: "id",
            constraints: false
          }); // ##################### trans to kpi


          _TranscriptsModel["default"].hasMany(_KpiAnylsisModel["default"], {
            foreignKey: "transcript_id",
            sourceKey: "id",
            constraints: false
          });

          _KpiAnylsisModel["default"].belongsTo(_TranscriptsModel["default"], {
            foreignKey: "transcript_id",
            targetKey: "id",
            constraints: false
          }); // ##################### trans to senti


          _TranscriptsModel["default"].hasMany(_SentimentAnylsisModel["default"], {
            foreignKey: "transcript_id",
            sourceKey: "id",
            constraints: false
          });

          _SentimentAnylsisModel["default"].belongsTo(_TranscriptsModel["default"], {
            foreignKey: "transcript_id",
            targetKey: "id",
            constraints: false
          }); //
          // ##################### trans to transcripts


          _TranscriptsModel["default"].hasMany(_StoredSpeechModel["default"], {
            foreignKey: {
              name: "transcript_id",
              allowNull: true
            },
            sourceKey: "id",
            constraints: false
          });

          _StoredSpeechModel["default"].belongsTo(_TranscriptsModel["default"], {
            foreignKey: {
              name: "transcript_id",
              allowNull: true
            },
            targetKey: "id",
            constraints: false
          });

          _QueueModel["default"].hasMany(_StoredSpeechModel["default"], {
            foreignKey: "queueId",
            sourceKey: "id",
            constraints: false
          });

          _StoredSpeechModel["default"].belongsTo(_QueueModel["default"], {
            foreignKey: "queueId",
            targetKey: "id",
            constraints: false
          }); // ##################### trans to seperate


          _TranscriptsModel["default"].hasOne(_TranscriptSeperation["default"], {
            foreignKey: "transcript_id",
            sourceKey: "id",
            constraints: false
          });

          _TranscriptSeperation["default"].belongsTo(_TranscriptsModel["default"], {
            foreignKey: "transcript_id",
            targetKey: "id",
            constraints: false
          }); // ##################### IntentResult to IntentDetails sub_intent


          _TranscriptsModel["default"].hasOne(_averageTotalModel["default"], {
            foreignKey: "transcript_id",
            sourceKey: "id",
            constraints: false
          });

          _averageTotalModel["default"].belongsTo(_TranscriptsModel["default"], {
            foreignKey: "transcript_id",
            targetKey: "id",
            constraints: false
          }); // ################# notif##############


          _IntentDetailsModel["default"].hasOne(_IntentResultModel["default"], {
            foreignKey: "sub_intent_id",
            sourceKey: "id",
            constraints: false
          });

          _IntentResultModel["default"].belongsTo(_IntentDetailsModel["default"], {
            as: "sub_intent",
            foreignKey: "sub_intent_id",
            targetKey: "id",
            constraints: false
          });

          _IntentDetailsModel["default"].hasOne(_IntentsModel["default"], {
            foreignKey: "id",
            sourceKey: "conn",
            constraints: false
          });

          _IntentsModel["default"].belongsTo(_IntentDetailsModel["default"], {
            foreignKey: "id",
            targetKey: "conn",
            constraints: false
          });

          _IntentsModel["default"].hasOne(_PiiFilterModel["default"], {
            foreignKey: "intent_id",
            sourceKey: "id",
            constraints: false
          });

          _PiiFilterModel["default"].hasOne(_IntentsModel["default"], {
            foreignKey: "intent_id",
            targetKey: "id",
            constraints: false
          }); // ##################### IntentResult to IntentDetails main_intent


          _IntentDetailsModel["default"].hasOne(_IntentResultModel["default"], {
            foreignKey: "main_intent_id",
            sourceKey: "id",
            constraints: false
          });

          _IntentResultModel["default"].belongsTo(_IntentDetailsModel["default"], {
            as: "main_intent",
            foreignKey: "main_intent_id",
            targetKey: "id",
            constraints: false
          }); // ##################### IntentResult to IntentDetails sub_intent


          _TranscriptsModel["default"].hasOne(_averageTotalModel["default"], {
            foreignKey: "transcript_id",
            sourceKey: "id",
            constraints: false
          });

          _averageTotalModel["default"].belongsTo(_TranscriptsModel["default"], {
            foreignKey: "transcript_id",
            targetKey: "id",
            constraints: false
          }); // ################# notif##############
          // ################# call Duration ##############


          _TranscriptsModel["default"].hasOne(_calldurationModel["default"], {
            foreignKey: "transcript_id",
            sourceKey: "id",
            constraints: false
          });

          _calldurationModel["default"].belongsTo(_TranscriptsModel["default"], {
            foreignKey: "transcript_id",
            targetKey: "id",
            constraints: false
          });

          _AgentsModel["default"].hasOne(_calldurationModel["default"], {
            foreignKey: "agent_id",
            sourceKey: "id",
            constraints: false
          });

          _calldurationModel["default"].belongsTo(_AgentsModel["default"], {
            foreignKey: "agent_id",
            targetKey: "id",
            constraints: false
          });

          _GroupsModel["default"].hasOne(_calldurationModel["default"], {
            foreignKey: "group_id",
            sourceKey: "id",
            constraints: false
          });

          _calldurationModel["default"].belongsTo(_GroupsModel["default"], {
            foreignKey: "group_id",
            targetKey: "id",
            constraints: false
          }); // ################# Call Duration##############


        case 54:
        case "end":
          return _context.stop();
      }
    }
  });
}