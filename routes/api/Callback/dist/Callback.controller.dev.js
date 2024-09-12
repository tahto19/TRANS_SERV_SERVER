"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCallBack = exports.postCallBack = void 0;

var _helpersHere = require("../../../../helper/helpersHere.js");

var _toSend = require("../../../../helper/toSend.js");

var _AgentsModel = _interopRequireDefault(require("../../../../models/Agents.model.js"));

var _ComplianceModel = _interopRequireDefault(require("../../../../models/Compliance.model.js"));

var _GroupServiceConfigModel = _interopRequireDefault(require("../../../../models/GroupServiceConfig.model.js"));

var _GroupsModel = _interopRequireDefault(require("../../../../models/Groups.model.js"));

var _IntentDetailsModel = _interopRequireDefault(require("../../../../models/IntentDetails.model.js"));

var _IntentResultModel = _interopRequireDefault(require("../../../../models/IntentResult.model.js"));

var _IntentsModel = _interopRequireDefault(require("../../../../models/Intents.model.js"));

var _KpiAnylsisModel = _interopRequireDefault(require("../../../../models/KpiAnylsis.model.js"));

var _NotesModel = _interopRequireDefault(require("../../../../models/Notes.model.js"));

var _QueryModel = _interopRequireDefault(require("../../../../models/Query.model.js"));

var _QueueModel = _interopRequireDefault(require("../../../../models/Queue.model.js"));

var _SentimentAnylsisModel = _interopRequireDefault(require("../../../../models/SentimentAnylsis.model.js"));

var _StoredSpeechModel = _interopRequireDefault(require("../../../../models/StoredSpeech.model.js"));

var _TranscriptsModel = _interopRequireDefault(require("../../../../models/Transcripts.model.js"));

var _Query = require("../../CallAI/helper/Query.js");

var _chatgptconfig = require("../../CallAI/proccess/assets/chatgptconfig.js");

var _excuteRequest = _interopRequireDefault(require("../../CallAI/proccess/excuteRequest.js"));

var _processNewKPI = _interopRequireDefault(require("../../CallAI/proccess/processNewKPI.js"));

var _GroupController = require("../../Group/controller/Group.controller.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var postCallBack = function postCallBack(req, res) {
  var _req$body, result, code, getQuery, jsonChange, getAgent, agent, transcript_id, transcript, queries, i, v, r, _getQuery, saveTranscript, data, intent, intentId, saveSubIntentDetails, saveMainIntentDetails, kpi, saveQuery, parseGetSenti, _data, getResult, _getResult;

  return regeneratorRuntime.async(function postCallBack$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          console.log("Callback Running");
          _req$body = req.body, result = _req$body.result, code = _req$body.code;
          _context.next = 5;
          return regeneratorRuntime.awrap(_QueryModel["default"].findOne({
            where: {
              code: code
            },
            include: [{
              model: _QueueModel["default"]
            }]
          }));

        case 5:
          getQuery = _context.sent;
          console.log(code);

          if (!(getQuery === null)) {
            _context.next = 9;
            break;
          }

          throw new Error("Somethin went wrong 9989");

        case 9:
          jsonChange = (0, _helpersHere.changeToJson)(getQuery);
          _context.next = 12;
          return regeneratorRuntime.awrap(_AgentsModel["default"].findOne({
            where: {
              user_id: jsonChange.Queue.user_id
            },
            include: [{
              model: _GroupsModel["default"],
              include: {
                model: _GroupServiceConfigModel["default"],
                include: [{
                  model: _IntentsModel["default"]
                }]
              }
            }]
          }));

        case 12:
          getAgent = _context.sent;
          agent = (0, _helpersHere.changeToJson)(getAgent);
          transcript_id = jsonChange.transcript_id;
          queries = jsonChange.type.split(","); // let data =
          //   result[1].result.choices[0].message.tool_calls[0].function.arguments;
          // let kpi = await kpi_process(
          //   data,
          //   transcript_id,
          //   result[0].result.text,
          //   agent
          // );
          // let saveQuery = await saveToDatabase(Query, {
          //   type: "KPI,Compliance",
          //   status: "Proccessing",
          //   code: kpi.code,
          //   setup_id: kpi.id,
          //   transcript_id: transcript_id,
          //   queue_id: jsonChange.queue_id,
          // });
          // res.send(changeSend(kpi));

          i = 0;

        case 17:
          if (!(i < queries.length)) {
            _context.next = 96;
            break;
          }

          v = queries[i];

          if (!(v !== "")) {
            _context.next = 93;
            break;
          }

          r = result[i];

          if (!(r.status === "Failed" || r.status === 3)) {
            _context.next = 28;
            break;
          }

          _context.next = 24;
          return regeneratorRuntime.awrap(_QueryModel["default"].update({
            status: "Failed"
          }, {
            where: {
              code: code
            }
          }));

        case 24:
          _getQuery = _context.sent;
          console.log(_getQuery, "Failed");
          res.send((0, _toSend.changeSend)({
            jsonChange: jsonChange
          }));
          return _context.abrupt("return");

        case 28:
          if (!(v === "Transcript")) {
            _context.next = 38;
            break;
          }

          transcript = r.result.text;
          _context.next = 32;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_TranscriptsModel["default"], {
            content: transcript,
            agent_id: agent.id,
            group_id: jsonChange.Queue.user_group_id,
            queue_date: (0, _helpersHere.isValidDate)(jsonChange.Queue.queue_date) ? jsonChange.Queue.queue_date : jsonChange.Queue.createdAt
          }));

        case 32:
          saveTranscript = _context.sent;
          transcript_id = saveTranscript.id;
          _context.next = 36;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_StoredSpeechModel["default"], {
            path: jsonChange.Queue.filepath,
            transcript_id: transcript_id
          }));

        case 36:
          _context.next = 93;
          break;

        case 38:
          if (!(v === "Intent" || v === "Sentiment")) {
            _context.next = 73;
            break;
          }

          data = r.result.choices[0].message.tool_calls[0]["function"].arguments;

          if (!(v === "Intent")) {
            _context.next = 65;
            break;
          }

          intent = (0, _helpersHere.filterIntents)(data);
          _context.next = 44;
          return regeneratorRuntime.awrap((0, _helpersHere.getConfigurationByTranscriptId)(transcript_id, intent.main_intent.name));

        case 44:
          intentId = _context.sent;
          saveSubIntentDetails = null;
          console.log(intentId);
          _context.next = 49;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_IntentDetailsModel["default"], {
            intent_name: intent.main_intent.name,
            score: intent.main_intent.score,
            desc: intent.main_intent.explanation,
            conn: intentId
          }));

        case 49:
          saveMainIntentDetails = _context.sent;

          if (!(intent.sub_intents.length !== 0)) {
            _context.next = 55;
            break;
          }

          _readOnlyError("saveSubIntentDetails");

          _context.next = 54;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_IntentDetailsModel["default"], {
            intent_name: intent.sub_intents[0].name,
            score: intent.sub_intents[0].score,
            desc: intent.sub_intents[0].explanation,
            conn: intentId
          }));

        case 54:
          saveSubIntentDetails = _context.sent;

        case 55:
          _context.next = 57;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_IntentResultModel["default"], {
            sub_intent_id: saveSubIntentDetails === null ? saveSubIntentDetails : saveSubIntentDetails.id,
            main_intent_id: saveMainIntentDetails.id,
            transcript_id: transcript_id,
            setup_id: r.request_id
          }));

        case 57:
          _context.next = 59;
          return regeneratorRuntime.awrap(kpi_process(data, transcript_id, transcript, agent));

        case 59:
          kpi = _context.sent;
          _context.next = 62;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_QueryModel["default"], {
            type: "KPI,Compliance,Notes",
            status: "Proccessing",
            code: kpi.code,
            setup_id: kpi.id,
            transcript_id: transcript_id,
            queue_id: jsonChange.queue_id
          }));

        case 62:
          saveQuery = _context.sent;
          _context.next = 71;
          break;

        case 65:
          parseGetSenti = JSON.parse(data);
          parseGetSenti["transcript_id"] = transcript_id;
          parseGetSenti["setup_id"] = r.request_id;

          if (parseGetSenti["sentiment_name"].toLowerCase() !== "positive" && parseGetSenti["sentiment_name"].toLowerCase() !== "negative" || parseGetSenti["sentiment_name"].toLowerCase() !== "neutral") {
            parseGetSenti["sentiment_name"] = "Neutral";
          }

          _context.next = 71;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_SentimentAnylsisModel["default"], parseGetSenti));

        case 71:
          _context.next = 93;
          break;

        case 73:
          _data = r.result.choices[0].message.tool_calls[0]["function"].arguments;

          if (!(v === "KPI")) {
            _context.next = 80;
            break;
          }

          console.log("KPI *********************");
          _context.next = 78;
          return regeneratorRuntime.awrap(saveKpi(_data, transcript_id, agent));

        case 78:
          _context.next = 93;
          break;

        case 80:
          if (!(v === "Compliance")) {
            _context.next = 89;
            break;
          }

          console.log("Compliance *********************");
          getResult = JSON.parse(_data);
          _context.next = 85;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_NotesModel["default"], {
            transcript_id: transcript_id,
            notes: getResult.suggestion
          }));

        case 85:
          _context.next = 87;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_ComplianceModel["default"], {
            transcript_id: transcript_id,
            explaination: getResult.explaination,
            score: getResult.score
          }));

        case 87:
          _context.next = 93;
          break;

        case 89:
          if (!(v === "Notes")) {
            _context.next = 93;
            break;
          }

          _getResult = JSON.parse(_data);
          _context.next = 93;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_NotesModel["default"], {
            transcript_id: transcript_id,
            notes: _getResult.suggestion
          }));

        case 93:
          i++;
          _context.next = 17;
          break;

        case 96:
          _context.next = 98;
          return regeneratorRuntime.awrap(_QueryModel["default"].update({
            status: "Done",
            transcript_id: transcript_id
          }, {
            where: {
              code: code
            }
          }));

        case 98:
          _context.next = 100;
          return regeneratorRuntime.awrap(_QueueModel["default"].update({
            status: "Done"
          }, {
            where: {
              id: jsonChange.queue_id
            }
          }));

        case 100:
          res.send((0, _toSend.changeSend)({
            jsonChange: jsonChange
          }));
          console.log("Callback Done");
          _context.next = 108;
          break;

        case 104:
          _context.prev = 104;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.send({
            result: "error",
            message: "no code found"
          });

        case 108:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 104]]);
};

exports.postCallBack = postCallBack;

var getCallBack = function getCallBack(req, res) {
  return regeneratorRuntime.async(function getCallBack$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log("Callback Running get");
          console.log(req.query);
          console.log(req.params);
          console.log("Callback Running get");
          res.send({
            result: "success",
            message: "connected"
          });
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          throw _context2.t0;

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getCallBack = getCallBack;

var kpi_process = function kpi_process(data, transcript_id, transcript, agent) {
  var intent, kpi, start, er, response;
  return regeneratorRuntime.async(function kpi_process$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          intent = (0, _helpersHere.filterIntents)(data);
          kpi = new _processNewKPI["default"]();
          start = kpi.start(transcript_id, transcript, agent.Group.GroupServiceConfigs[0].Intents, intent, agent.Group.GroupServiceConfigs[0].metricRange);
          er = new _excuteRequest["default"]();
          _context3.next = 6;
          return regeneratorRuntime.awrap(er.start(start, null));

        case 6:
          _context3.next = 8;
          return regeneratorRuntime.awrap(er.start_call(2));

        case 8:
          response = _context3.sent;
          console.log(response);
          return _context3.abrupt("return", response);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var saveKpi = function saveKpi(data, transcript_id, agent) {
  var getKPIResult, getMainIntent, main_intent, kpi_of_mainIntent;
  return regeneratorRuntime.async(function saveKpi$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          getKPIResult = JSON.parse(data);
          console.log(getKPIResult);
          _context5.next = 4;
          return regeneratorRuntime.awrap(_IntentResultModel["default"].findOne({
            where: {
              transcript_id: transcript_id
            },
            include: [{
              model: _IntentDetailsModel["default"],
              as: "main_intent"
            }]
          }));

        case 4:
          getMainIntent = _context5.sent;
          main_intent = (0, _helpersHere.changeToJson)(getMainIntent).main_intent.intent_name;
          kpi_of_mainIntent = agent.Group.GroupServiceConfigs[0].Intents.find(function (x) {
            return x.intent === main_intent;
          }); // let totalCSAT = 0;

          getKPIResult.data.forEach(function _callee(x, i) {
            var findKpiDetails, rw;
            return regeneratorRuntime.async(function _callee$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    findKpiDetails = kpi_of_mainIntent.data.find(function (xx) {
                      return xx.call_quality.toLowerCase() === x.kpi.toLowerCase();
                    }); // let getKPIResult = computePerKpi({
                    //   kpi: x.kpi,
                    //   rating: x.grade,
                    //   anaylsis: x.explain,
                    //   transcript_id: transcript_id,
                    //   getWeight: findKpiDetails.cust_sat_weight,
                    //   setup_id: 1,
                    //   metricsRange: agent.Group.GroupServiceConfigs[0].metricRange,
                    // });
                    // if (i === 0) totalCSAT += getKPIResult.weightConverted;
                    // else totalCSAT = totalCSAT + getKPIResult.weightConverted / 2;

                    _context4.next = 3;
                    return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_KpiAnylsisModel["default"], {
                      kpi: x.kpi,
                      rating: x.grade,
                      anaylsis: x.explain,
                      transcript_id: transcript_id,
                      getWeight: findKpiDetails.cust_sat_weight,
                      setup_id: 1,
                      metricsRange: agent.Group.GroupServiceConfigs[0].metricRange
                    }));

                  case 3:
                    rw = _context4.sent;

                  case 4:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          });

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
};