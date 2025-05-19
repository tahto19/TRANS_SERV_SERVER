"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convert = void 0;

var _sequelize = require("sequelize");

var _toSend = require("../../../helper/toSend.js");

var _AgentsModel = _interopRequireDefault(require("../../../models/Agents.model.js"));

var _helpersHere = require("../../../helper/helpersHere.js");

var _functions = require("./functions.js");

var _TranscriptsModel = _interopRequireDefault(require("../../../models/Transcripts.model.js"));

var _IntentResultModel = _interopRequireDefault(require("../../../models/IntentResult.model.js"));

var _IntentDetailsModel = _interopRequireDefault(require("../../../models/IntentDetails.model.js"));

var _SentimentAnylsisModel = _interopRequireDefault(require("../../../models/SentimentAnylsis.model.js"));

var _KpiAnylsisModel = _interopRequireDefault(require("../../../models/KpiAnylsis.model.js"));

var _ComplianceModel = _interopRequireDefault(require("../../../models/Compliance.model.js"));

var _NotesModel = _interopRequireDefault(require("../../../models/Notes.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sequelize = new _sequelize.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  dialect: process.env.SEQUELIZE_DIALECT
});

var convert = function convert(req, res) {
  var getAgents, getTranscript, agentloop;
  return regeneratorRuntime.async(function convert$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          console.warn("######################### Starting to convert #################");
          _context3.next = 4;
          return regeneratorRuntime.awrap(_AgentsModel["default"].findAll({}));

        case 4:
          getAgents = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(sequelize.query("SELECT A.content,B.*FROM \n      etpbx_ca_transcripts AS A INNER JOIN etpbx_ca_queue_agents AS B \n      ON B.queue_id = A.queue_id", {
            type: _sequelize.QueryTypes.SELECT
          }));

        case 7:
          getTranscript = _context3.sent;
          agentloop = 0;
          getTranscript.forEach(function _callee2(v, i) {
            var agent, transcript_id, getCompliance, Intents, Intent_id, Sentiments, s, kpi, notes;
            return regeneratorRuntime.async(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (agentloop >= getAgents.length) {
                      agentloop = 0;
                    }

                    agent = (0, _helpersHere.changeToJson)(getAgents[(0, _functions.random)(getAgents.length)]);

                    if (!true) {
                      _context2.next = 37;
                      break;
                    }

                    _context2.next = 5;
                    return regeneratorRuntime.awrap((0, _functions.saveTable)({
                      content: v.content,
                      group_id: agent.agent_group_id,
                      agent_id: agent.id,
                      createdAt: v.createdAt
                    }, _TranscriptsModel["default"]));

                  case 5:
                    transcript_id = _context2.sent;
                    _context2.next = 8;
                    return regeneratorRuntime.awrap(sequelize.query("SELECT * FROM\n          etpbx_ca_queue_result_compliances\n          WHERE queue_id = ".concat(v.queue_id), {
                      type: _sequelize.QueryTypes.SELECT
                    }));

                  case 8:
                    getCompliance = _context2.sent;

                    if (!(getCompliance.length !== 0)) {
                      _context2.next = 13;
                      break;
                    }

                    console.log(getCompliance);
                    _context2.next = 13;
                    return regeneratorRuntime.awrap((0, _functions.saveTable)({
                      createdAt: getCompliance[0].createdAt,
                      explaination: getCompliance[0].description,
                      score: getCompliance[0].rating,
                      transcript_id: transcript_id
                    }, _ComplianceModel["default"]));

                  case 13:
                    _context2.next = 15;
                    return regeneratorRuntime.awrap(sequelize.query("SELECT * FROM\n        etpbx_ca_queue_result_intents\n          WHERE queue_id = ".concat(v.queue_id), {
                      type: _sequelize.QueryTypes.SELECT
                    }));

                  case 15:
                    Intents = _context2.sent;

                    if (!(Intents.length !== 0)) {
                      _context2.next = 22;
                      break;
                    }

                    _context2.next = 19;
                    return regeneratorRuntime.awrap(_IntentDetailsModel["default"].create({
                      intent_name: Intents[0].main_intent,
                      createdAt: Intents[0].createdAt,
                      desc: Intents[0].description,
                      score: 1
                    }));

                  case 19:
                    Intent_id = _context2.sent;
                    _context2.next = 22;
                    return regeneratorRuntime.awrap(_IntentResultModel["default"].create({
                      transcript_id: transcript_id,
                      main_intent_id: Intent_id.id,
                      setup_id: v.queue_id,
                      createdAt: Intents[0].createdAt
                    }));

                  case 22:
                    _context2.next = 24;
                    return regeneratorRuntime.awrap(sequelize.query("SELECT * FROM\n        etpbx_ca_queue_result_sentiments\n          WHERE queue_id = ".concat(v.queue_id), {
                      type: _sequelize.QueryTypes.SELECT
                    }));

                  case 24:
                    Sentiments = _context2.sent;

                    if (!(Sentiments.length !== 0)) {
                      _context2.next = 29;
                      break;
                    }

                    s = Sentiments[0];
                    _context2.next = 29;
                    return regeneratorRuntime.awrap(_SentimentAnylsisModel["default"].create({
                      sentiment_name: s.sentiment,
                      explanation: s.description,
                      setup_id: s.queue_id,
                      transcript_id: transcript_id,
                      sentiment_score: 90
                    }));

                  case 29:
                    _context2.next = 31;
                    return regeneratorRuntime.awrap(sequelize.query("SELECT * FROM\n        etpbx_ca_queue_result_quality_metrics\n          WHERE queue_id = ".concat(v.queue_id), {
                      type: _sequelize.QueryTypes.SELECT
                    }));

                  case 31:
                    kpi = _context2.sent;

                    if (kpi.length !== 0) {
                      kpi.forEach(function _callee(v, i) {
                        var kpiMetric;
                        return regeneratorRuntime.async(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                _context.next = 2;
                                return regeneratorRuntime.awrap(sequelize.query("SELECT * FROM\n            etpbx_ca_chat_group_call_quality_metrics\n              WHERE id = ".concat(v.quality_metric_id), {
                                  type: _sequelize.QueryTypes.SELECT
                                }));

                              case 2:
                                kpiMetric = _context.sent;
                                console.log(kpiMetric);

                                _KpiAnylsisModel["default"].create({
                                  kpi: v.metrictype,
                                  rating: v.rating_str.includes("%") ? v.rating_str : "".concat(v.rating_str, "%"),
                                  transcript_id: transcript_id,
                                  metricsRange: "1-100%",
                                  setup_id: v.queue_id,
                                  anaylsis: v.description,
                                  getWeight: kpiMetric[0].satisfaction_weight
                                });

                              case 5:
                              case "end":
                                return _context.stop();
                            }
                          }
                        });
                      });
                    }

                    _context2.next = 35;
                    return regeneratorRuntime.awrap(sequelize.query("SELECT * FROM\n          etpbx_ca_queue_result_summaries\n          WHERE queue_id = ".concat(v.queue_id), {
                      type: _sequelize.QueryTypes.SELECT
                    }));

                  case 35:
                    notes = _context2.sent;

                    if (notes.length !== 0) {
                      _NotesModel["default"].create({
                        transcript_id: transcript_id,
                        notes: notes[0].content
                      });
                    }

                  case 37:
                    agentloop++;

                  case 38:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          });
          console.log("done");
          res.send((0, _toSend.changeSend)("done"));
          _context3.next = 18;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          console.warn(_context3.t0);
          throw _context3.t0;

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.convert = convert;