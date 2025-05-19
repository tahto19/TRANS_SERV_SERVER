"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _helpersHere = require("../../../../helper/helpersHere.js");

var _toSend = require("../../../../helper/toSend.js");

var _AgentsModel = _interopRequireDefault(require("../../../../models/Agents.model.js"));

var _ComplianceModel = _interopRequireDefault(require("../../../../models/Compliance.model.js"));

var _IntentDetailsModel = _interopRequireDefault(require("../../../../models/IntentDetails.model.js"));

var _IntentResultModel = _interopRequireDefault(require("../../../../models/IntentResult.model.js"));

var _KpiAnylsisModel = _interopRequireDefault(require("../../../../models/KpiAnylsis.model.js"));

var _NotesModel = _interopRequireDefault(require("../../../../models/Notes.model.js"));

var _QueryModel = _interopRequireDefault(require("../../../../models/Query.model.js"));

var _QueueModel = _interopRequireDefault(require("../../../../models/Queue.model.js"));

var _SentimentAnylsisModel = _interopRequireDefault(require("../../../../models/SentimentAnylsis.model.js"));

var _StoredSpeechModel = _interopRequireDefault(require("../../../../models/StoredSpeech.model.js"));

var _TranscriptSeperation = _interopRequireDefault(require("../../../../models/TranscriptSeperation.js"));

var _TranscriptsModel = _interopRequireDefault(require("../../../../models/Transcripts.model.js"));

var _averageTotalModel = _interopRequireDefault(require("../../../../models/averageTotal.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var processSameQueueId = function processSameQueueId(queue_id, user_id, user_group_id) {
  var getAgentInfo, agentInfo, findQueue, queue, transcript, seperate, note, KpiAnylses, compliance, sentiAnylses, average_total, IntentResults, StoredSpeeches, saveTranscript, transcript_id, intent, m_i, s_i;
  return regeneratorRuntime.async(function processSameQueueId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_AgentsModel["default"].findOne({
            where: {
              user_id: user_id,
              agent_group_id: user_group_id
            }
          }));

        case 3:
          getAgentInfo = _context2.sent;

          if (!(getAgentInfo === null)) {
            _context2.next = 6;
            break;
          }

          throw new Error("No Agent in the group");

        case 6:
          agentInfo = (0, _helpersHere.changeToJson)(getAgentInfo);
          _context2.next = 9;
          return regeneratorRuntime.awrap(_QueryModel["default"].findAll({
            include: [{
              required: true,
              model: _QueueModel["default"],
              where: {
                queue_id: queue_id
              }
            }, {
              required: true,
              model: _TranscriptsModel["default"],
              include: [{
                required: true,
                model: _TranscriptSeperation["default"]
              }, {
                required: true,
                model: _NotesModel["default"]
              }, {
                required: true,
                model: _KpiAnylsisModel["default"]
              }, {
                required: true,
                model: _ComplianceModel["default"]
              }, {
                required: true,
                model: _SentimentAnylsisModel["default"]
              }, {
                required: true,
                model: _StoredSpeechModel["default"]
              }, {
                required: true,
                model: _averageTotalModel["default"]
              }, {
                required: true,
                model: _IntentResultModel["default"],
                include: [{
                  required: true,
                  model: _IntentDetailsModel["default"],
                  as: "main_intent"
                }, {
                  model: _IntentDetailsModel["default"],
                  as: "sub_intent"
                }]
              }]
            }] //   limit: 2,

          }));

        case 9:
          findQueue = _context2.sent;

          if (!(findQueue.length === 0)) {
            _context2.next = 12;
            break;
          }

          throw new Error("processing");

        case 12:
          queue = (0, _helpersHere.changeToJson)(findQueue[0]);
          transcript = queue.Transcripts[0];
          seperate = transcript.TranscriptsSeperate;
          note = transcript.note;
          KpiAnylses = transcript.KpiAnylses;
          compliance = transcript.Compliance;
          sentiAnylses = transcript.SentiAnylses;
          average_total = transcript.average_total;
          IntentResults = transcript.IntentResults;
          StoredSpeeches = transcript.StoredSpeeches; // save transcripts

          _context2.next = 24;
          return regeneratorRuntime.awrap(_TranscriptsModel["default"].create({
            group_id: user_group_id,
            agent_id: agentInfo.id,
            queue_date: transcript,
            callerid: transcript.callerid,
            call_id: transcript.call_id,
            call_type: transcript.call_type,
            content: transcript.content
          }));

        case 24:
          saveTranscript = _context2.sent;
          transcript_id = saveTranscript.id; // save seperation

          _context2.next = 28;
          return regeneratorRuntime.awrap(_TranscriptSeperation["default"].create({
            agentSegment: seperate.agentSegment,
            costumerSegment: seperate.costumerSegment,
            combineSegment: seperate.combineSegment,
            transcript_id: transcript_id
          }));

        case 28:
          _context2.next = 30;
          return regeneratorRuntime.awrap(_NotesModel["default"].create({
            notes: note.notes,
            transcript_id: transcript_id
          }));

        case 30:
          // save kpi
          KpiAnylses.forEach(function (v) {
            v.transcript_id = transcript_id;
            v.id = null; //   console.log(v);

            _KpiAnylsisModel["default"].create(v);
          }); // Compliance

          _ComplianceModel["default"].create({
            transcript_id: transcript_id,
            score: compliance.score,
            explaination: compliance.explaination
          }); // SentimentAnylsis


          _SentimentAnylsisModel["default"].create({
            transcript_id: transcript_id,
            sentiment_score: sentiAnylses[0].sentiment_score,
            sentiment_name: sentiAnylses[0].sentiment_name,
            explanation: sentiAnylses[0].explanation,
            setup_id: sentiAnylses[0].setup_id
          });

          _averageTotalModel["default"].create({
            transcript_id: transcript_id,
            compliance: average_total.compliance,
            csat: average_total.csat,
            csatScore: average_total.csatScore,
            complianceScore: average_total.complianceScore,
            status: average_total.status
          });

          _context2.next = 36;
          return regeneratorRuntime.awrap(_IntentResultModel["default"].create({
            transcript_id: transcript_id,
            main_intent_id: IntentResults[0].main_intent_id,
            sub_intent_id: IntentResults[0].sub_intent_id,
            setup_id: IntentResults[0].setup_id
          }));

        case 36:
          intent = _context2.sent;
          // save main intent result
          m_i = IntentResults[0].main_intent;

          _IntentDetailsModel["default"].create({
            intent_name: m_i.intent_name,
            desc: m_i.desc,
            score: m_i.score,
            conn: m_i.conn
          });

          if (IntentResults[0].sub_intent_id !== null) {
            s_i = IntentResults[0].sub_intent;

            _IntentDetailsModel["default"].create({
              intent_name: s_i.intent_name,
              desc: s_i.desc,
              score: s_i.score,
              conn: s_i.conn
            });
          }

          StoredSpeeches.forEach(function _callee(v) {
            var a;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    a = v;
                    a["transcript_id"] = transcript_id;
                    delete a.id;
                    console.log(a);
                    _context.next = 6;
                    return regeneratorRuntime.awrap(_StoredSpeechModel["default"].create(a));

                  case 6:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });

          _QueryModel["default"].create({
            type: "Transfer call",
            code: "Transfer call",
            queue_id: queue.Queue.id,
            transcript_id: transcript_id,
            status: "Done",
            setup_id: 1,
            query: 0
          });

          return _context2.abrupt("return", transcript);

        case 45:
          _context2.prev = 45;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          return _context2.abrupt("return", _context2.t0.message === "processing" ? _context2.t0.message : false);

        case 49:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 45]]);
};

var _default = processSameQueueId;
exports["default"] = _default;