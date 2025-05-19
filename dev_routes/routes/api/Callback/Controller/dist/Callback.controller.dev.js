"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callbackv2 = exports.getCallBack = exports.postCallBack = void 0;

var _sequelize = require("sequelize");

var _helpersHere = require("../../../../helper/helpersHere.js");

var _toSend = require("../../../../helper/toSend.js");

var _AgentsModel = _interopRequireDefault(require("../../../../models/Agents.model.js"));

var _ComplianceModel = _interopRequireDefault(require("../../../../models/Compliance.model.js"));

var _ConfigNotifModel = _interopRequireDefault(require("../../../../models/ConfigNotif.model.js"));

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

var _TranscriptSeperation = _interopRequireDefault(require("../../../../models/TranscriptSeperation.js"));

var _TranscriptsModel = _interopRequireDefault(require("../../../../models/Transcripts.model.js"));

var _averageTotalModel = _interopRequireDefault(require("../../../../models/averageTotal.model.js"));

var _sentimentListsModel = _interopRequireDefault(require("../../../../models/sentimentLists.model.js"));

var _Agent = require("../../Agent/Agent.js");

var _Query = require("../../CallAI/helper/Query.js");

var _chatgptconfig = require("../../CallAI/proccess/assets/chatgptconfig.js");

var _excuteRequest = _interopRequireDefault(require("../../CallAI/proccess/excuteRequest.js"));

var _processNewKPI = _interopRequireDefault(require("../../CallAI/proccess/processNewKPI.js"));

var _GroupController = require("../../Group/controller/Group.controller.js");

var _getDetailsofOrgByAccountCode = require("../../CallAI/outsideCall/getDetailsofOrgByAccountCode.js");

var _ProcessData = require("../../CallAI/helper/ProcessData.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _readOnlyError(name) { throw new Error("\"" + name + "\" is read-only"); }

var postCallBack = function postCallBack(req, res) {
  var _req$body, result, code, getQuery, jsonChange, getAgent, agent, transcript_id, transcript, queries, queueId, i, v, r, _getQuery, saveTranscript, data, intent, _intentId, saveSubIntentDetails, saveMainIntentDetails, kpi, saveQuery, parseGetSenti, parseGetSeperate, _data, d, a, converted, getResult, getConfigNotif, _getResult;

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
          queries = jsonChange.type.split(",");
          queueId = jsonChange.Queue.id; // let data =
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

        case 18:
          if (!(i < queries.length)) {
            _context.next = 121;
            break;
          }

          v = queries[i];

          if (!(v !== "")) {
            _context.next = 118;
            break;
          }

          r = result[i];

          if (!(r.status === "Failed" || r.status === 3)) {
            _context.next = 28;
            break;
          }

          _context.next = 25;
          return regeneratorRuntime.awrap(_QueryModel["default"].update({
            status: "Failed"
          }, {
            where: {
              code: code
            }
          }));

        case 25:
          _getQuery = _context.sent;
          res.send((0, _toSend.changeSend)({
            jsonChange: jsonChange
          }));
          return _context.abrupt("return");

        case 28:
          if (!(v === "Transcript")) {
            _context.next = 39;
            break;
          }

          transcript = r.result.text;
          _context.next = 32;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_TranscriptsModel["default"], {
            content: transcript,
            agent_id: agent.id,
            group_id: jsonChange.Queue.user_group_id,
            queue_date: (0, _helpersHere.isValidDate)(jsonChange.Queue.queue_date) ? jsonChange.Queue.queue_date : jsonChange.Queue.createdAt,
            callerid: jsonChange.Queue.callerid,
            call_id: jsonChange.Queue.callerid,
            call_type: jsonChange.Queue.callerid
          }));

        case 32:
          saveTranscript = _context.sent;
          transcript_id = saveTranscript.id;
          console.log(queueId, transcript_id);
          _context.next = 37;
          return regeneratorRuntime.awrap((0, _Query.updateDataBase)(_StoredSpeechModel["default"], {
            where: {
              queueId: queueId
            }
          }, {
            transcript_id: transcript_id
          }));

        case 37:
          _context.next = 118;
          break;

        case 39:
          if (!(v === "Intent" || v === "Sentiment")) {
            _context.next = 80;
            break;
          }

          data = r.result.choices[0].message.tool_calls[0]["function"].arguments;

          if (!(v === "Intent")) {
            _context.next = 65;
            break;
          }

          intent = (0, _helpersHere.filterIntents)(data);
          _context.next = 45;
          return regeneratorRuntime.awrap((0, _helpersHere.getConfigurationByTranscriptId)(transcript_id, intent.main_intent.name));

        case 45:
          _intentId = _context.sent;
          saveSubIntentDetails = null;
          _context.next = 49;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_IntentDetailsModel["default"], {
            intent_name: intent.main_intent.name,
            score: intent.main_intent.score,
            desc: intent.main_intent.explanation,
            conn: _intentId
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
            conn: _intentId
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
          return regeneratorRuntime.awrap(kpi_process(data, transcript_id, transcript, agent, queueId));

        case 59:
          kpi = _context.sent;
          _context.next = 62;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_QueryModel["default"], {
            type: "Agent,Compliance,Seperation,KPI,Notes",
            status: "Proccessing",
            code: kpi.code,
            setup_id: kpi.id,
            transcript_id: transcript_id,
            queue_id: jsonChange.queue_id
          }));

        case 62:
          saveQuery = _context.sent;
          _context.next = 78;
          break;

        case 65:
          if (!(v === "Sentiment")) {
            _context.next = 74;
            break;
          }

          parseGetSenti = JSON.parse(data);
          parseGetSenti["transcript_id"] = transcript_id;
          parseGetSenti["setup_id"] = r.request_id;

          if (parseGetSenti["sentiment_name"].toLowerCase() !== "positive" && parseGetSenti["sentiment_name"].toLowerCase() !== "negative" && parseGetSenti["sentiment_name"].toLowerCase() !== "neutral") {
            parseGetSenti["sentiment_name"] = "Negative";
          }

          _context.next = 72;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_SentimentAnylsisModel["default"], parseGetSenti));

        case 72:
          _context.next = 78;
          break;

        case 74:
          parseGetSeperate = JSON.parse(data);
          console.log(parseGetSeperate.data);
          _context.next = 78;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_TranscriptSeperation["default"], {
            content: parseGetSeperate.data,
            transcript_id: transcript_id
          }));

        case 78:
          _context.next = 118;
          break;

        case 80:
          _data = r.result.text === undefined ? r.result.choices[0].message.tool_calls[0]["function"].arguments : r.result.text;
          d = r.result.text !== undefined ? "Speech-to-Text" : r.result.choices[0].message.tool_calls[0]["function"].name;

          if (!(d === "Speech-to-Text")) {
            _context.next = 87;
            break;
          }

          _context.next = 85;
          return regeneratorRuntime.awrap(_TranscriptSeperation["default"].update({
            agent: _data
          }, {
            where: {
              transcript_id: transcript_id
            }
          }));

        case 85:
          _context.next = 118;
          break;

        case 87:
          if (!(d === "transcript_seperation")) {
            _context.next = 96;
            break;
          }

          console.log("#####################################");
          console.log(_data);
          console.log("#####################################");
          a = JSON.parse(_data);
          converted = a.data === undefined ? a : a.data;

          _TranscriptSeperation["default"].create({
            transcript_id: transcript_id,
            content: converted
          }); // if (r.length !== 0 && r !== null) {
          // }


          _context.next = 118;
          break;

        case 96:
          if (!(d === "text_analysis")) {
            _context.next = 102;
            break;
          }

          console.log("KPI *********************");
          _context.next = 100;
          return regeneratorRuntime.awrap(saveKpi(_data, transcript_id, agent));

        case 100:
          _context.next = 118;
          break;

        case 102:
          if (!(d === "compliance_analysis")) {
            _context.next = 114;
            break;
          }

          console.log("Compliance *********************");
          getResult = JSON.parse(_data);
          _context.next = 107;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_ComplianceModel["default"], {
            transcript_id: transcript_id,
            explaination: getResult.explaination,
            score: getResult.score
          }));

        case 107:
          _context.next = 109;
          return regeneratorRuntime.awrap(ConfigNotifF(agent.Group.organization_id));

        case 109:
          getConfigNotif = _context.sent;
          _context.next = 112;
          return regeneratorRuntime.awrap(saveAverageTotal({
            csatScore: getResult.score,
            transcript_id: transcript_id,
            compliance: getResult.score <= getConfigNotif.low || getConfigNotif.high <= getResult.score,
            status: getResult.score <= getConfigNotif.low || getConfigNotif.high <= getResult.score ? "Done" : "Created"
          }));

        case 112:
          _context.next = 118;
          break;

        case 114:
          if (!(d === "suggestion_compliance_analysis")) {
            _context.next = 118;
            break;
          }

          _getResult = JSON.parse(_data);
          _context.next = 118;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_NotesModel["default"], {
            transcript_id: transcript_id,
            notes: _getResult.suggestion
          }));

        case 118:
          i++;
          _context.next = 18;
          break;

        case 121:
          _context.next = 123;
          return regeneratorRuntime.awrap(_QueryModel["default"].update({
            status: "Done",
            transcript_id: transcript_id
          }, {
            where: {
              code: code
            }
          }));

        case 123:
          _context.next = 125;
          return regeneratorRuntime.awrap(_QueueModel["default"].update({
            status: "Done"
          }, {
            where: {
              id: jsonChange.queue_id
            }
          }));

        case 125:
          res.send((0, _toSend.changeSend)({
            jsonChange: jsonChange
          }));
          console.log("Callback Done");
          _context.next = 133;
          break;

        case 129:
          _context.prev = 129;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.send({
            result: "error",
            message: "no code found"
          });

        case 133:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 129]]);
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

var callbackv2 = function callbackv2(req, res) {
  var transcript, saveTranscript, changePosition, _req$body2, result, code, getQuery, jsonChange, getAgent, agent, transcript_id, queueId, findFirst, toTransfer, i, v, _i, _v, d, data, r, getResult;

  return regeneratorRuntime.async(function callbackv2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body2 = req.body, result = _req$body2.result, code = _req$body2.code;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_QueryModel["default"].findOne({
            where: {
              code: code
            },
            include: [{
              model: _QueueModel["default"]
            }]
          }));

        case 4:
          getQuery = _context3.sent;

          if (!(getQuery === null)) {
            _context3.next = 7;
            break;
          }

          throw new Error("Somethin went wrong 9989");

        case 7:
          jsonChange = (0, _helpersHere.changeToJson)(getQuery);
          _context3.next = 10;
          return regeneratorRuntime.awrap(_AgentsModel["default"].findOne({
            where: {
              user_id: jsonChange.Queue.user_id
            },
            include: [{
              model: _GroupsModel["default"],
              include: {
                model: _GroupServiceConfigModel["default"],
                include: [{
                  model: _IntentsModel["default"],
                  where: {
                    active: true
                  }
                }]
              }
            }]
          }));

        case 10:
          getAgent = _context3.sent;
          agent = (0, _helpersHere.changeToJson)(getAgent); // find first queue

          transcript_id = jsonChange.transcript_id;
          queueId = jsonChange.Queue.id; // change position result

          findFirst = result.findIndex(function (v) {
            return v.result && v.result.task && v.result.task === "transcribe";
          }); // if (findFirst !== 0 && findFirst !== -1) {
          //   changePosition = array_move(result, findFirst, 0);
          // }

          toTransfer = 0;

          for (i = 0; i < result.length; i++) {
            v = result[i];

            if (v.result && v.result.task && v.result.task === "transcribe") {
              changePosition = array_move(result, i, toTransfer);
              toTransfer += 1;
            }
          }

          _i = 0;

        case 18:
          if (!(_i < result.length)) {
            _context3.next = 80;
            break;
          }

          _v = result[_i];

          if (!(_v.status.toLowerCase() === "failed")) {
            _context3.next = 26;
            break;
          }

          _context3.next = 23;
          return regeneratorRuntime.awrap(_QueueModel["default"].update({
            status: "Failed"
          }, {
            where: {
              id: queueId
            }
          }));

        case 23:
          _context3.next = 25;
          return regeneratorRuntime.awrap(_QueryModel["default"].update({
            status: "Failed"
          }, {
            where: {
              code: code
            }
          }));

        case 25:
          throw new Error("Failed");

        case 26:
          d = _v.result.choices === undefined ? "Speech-To-Text" : _v.result.choices[0].message.tool_calls[0]["function"].name;
          data = _v.result.text === undefined ? _v.result.choices[0].message.tool_calls[0]["function"].arguments : _v.result.text;

          if (!(d === "Speech-To-Text")) {
            _context3.next = 47;
            break;
          }

          if (!(jsonChange.query == 1)) {
            _context3.next = 42;
            break;
          }

          if (!(transcript_id === null || transcript_id === undefined)) {
            _context3.next = 38;
            break;
          }

          transcript = data;
          _context3.next = 34;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_TranscriptsModel["default"], {
            content: transcript,
            agent_id: agent.id,
            group_id: jsonChange.Queue.user_group_id,
            queue_date: (0, _helpersHere.isValidDate)(jsonChange.Queue.queue_date) ? jsonChange.Queue.queue_date : jsonChange.Queue.createdAt,
            callerid: jsonChange.Queue.callerid,
            call_id: jsonChange.Queue.callerid,
            call_type: jsonChange.Queue.callerid
          }));

        case 34:
          saveTranscript = _context3.sent;
          transcript_id = saveTranscript.id;
          _context3.next = 38;
          return regeneratorRuntime.awrap((0, _Query.updateDataBase)(_StoredSpeechModel["default"], {
            where: {
              queueId: queueId
            }
          }, {
            transcript_id: transcript_id
          }));

        case 38:
          _context3.next = 40;
          return regeneratorRuntime.awrap(saveTranscriptSeperation(_v.result.segments, transcript_id));

        case 40:
          _context3.next = 45;
          break;

        case 42:
          if (!(jsonChange.query == 2)) {
            _context3.next = 45;
            break;
          }

          _context3.next = 45;
          return regeneratorRuntime.awrap(saveTranscriptSeperation(_v.result.segments, transcript_id));

        case 45:
          _context3.next = 72;
          break;

        case 47:
          if (!(d === "intent_analysis")) {
            _context3.next = 53;
            break;
          }

          _context3.next = 50;
          return regeneratorRuntime.awrap(saveIntent(data, agent, transcript_id, transcript, queueId, _v.request_id, jsonChange.Queue.account_code));

        case 50:
          r = _context3.sent;
          _context3.next = 72;
          break;

        case 53:
          if (!(d === "transcript_sentiment")) {
            _context3.next = 58;
            break;
          }

          _context3.next = 56;
          return regeneratorRuntime.awrap(saveSentiment(data, _v.request_id, transcript_id));

        case 56:
          _context3.next = 72;
          break;

        case 58:
          if (!(d === "compliance_analysis")) {
            _context3.next = 63;
            break;
          }

          _context3.next = 61;
          return regeneratorRuntime.awrap(saveCompliance(data, transcript_id, agent));

        case 61:
          _context3.next = 72;
          break;

        case 63:
          if (!(d === "text_analysis")) {
            _context3.next = 68;
            break;
          }

          _context3.next = 66;
          return regeneratorRuntime.awrap(saveKpi(data, transcript_id, agent));

        case 66:
          _context3.next = 72;
          break;

        case 68:
          if (!(d === "suggestion_compliance_analysis")) {
            _context3.next = 72;
            break;
          }

          getResult = JSON.parse(data);
          _context3.next = 72;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_NotesModel["default"], {
            transcript_id: transcript_id,
            notes: getResult.suggestion
          }));

        case 72:
          if (!(_i === result.length - 1)) {
            _context3.next = 77;
            break;
          }

          _context3.next = 75;
          return regeneratorRuntime.awrap(_QueryModel["default"].update({
            status: "Done",
            transcript_id: transcript_id
          }, {
            where: {
              code: code
            }
          }));

        case 75:
          _context3.next = 77;
          return regeneratorRuntime.awrap(_QueueModel["default"].update({
            status: jsonChange.query == 1 ? "2nd" : "Done"
          }, {
            where: {
              id: jsonChange.queue_id
            }
          }));

        case 77:
          _i++;
          _context3.next = 18;
          break;

        case 80:
          res.send((0, _toSend.changeSend)(getQuery));
          _context3.next = 87;
          break;

        case 83:
          _context3.prev = 83;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          throw _context3.t0;

        case 87:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 83]]);
};

exports.callbackv2 = callbackv2;

var kpi_process = function kpi_process(data, transcript_id, transcript, agent, queueId, account_code) {
  var getStored, path, filebase64, intent, kpi, start, er, response;
  return regeneratorRuntime.async(function kpi_process$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap((0, _Query.findTable)(_StoredSpeechModel["default"], {
            queueId: queueId,
            type: 1
          }));

        case 2:
          getStored = _context4.sent;
          path = (0, _helpersHere.changeToJson)(getStored[0]);
          _context4.next = 6;
          return regeneratorRuntime.awrap((0, _helpersHere.getBase64)(path.path));

        case 6:
          filebase64 = _context4.sent;
          intent = (0, _helpersHere.filterIntents)(data);
          kpi = new _processNewKPI["default"]();
          start = kpi.start(transcript_id, transcript, agent.Group.GroupServiceConfigs[0].Intents, intent, agent.Group.GroupServiceConfigs[0].metricRange, filebase64);
          er = new _excuteRequest["default"]();
          _context4.next = 13;
          return regeneratorRuntime.awrap(er.start(start, null));

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(er.start_call(2));

        case 15:
          response = _context4.sent;
          console.log(response);
          return _context4.abrupt("return", response);

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var callForAiProcess = function callForAiProcess(data, transcript_id, transcript, IntentDetailsData, agent, queueId, account_code) {
  var orgDetails, intent, processSecondRequests, saveQuery;
  return regeneratorRuntime.async(function callForAiProcess$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          // const getStored = await findTable(StoredSpeech, { queueId, type: 1 });
          // console.log(queueId);
          // const path = changeToJson(getStored[0]);
          // let filebase64 = await getBase64(path.path);
          console.log(account_code);
          _context5.next = 4;
          return regeneratorRuntime.awrap((0, _getDetailsofOrgByAccountCode.getDetailsofOrgByAccountCode)(account_code, 1));

        case 4:
          orgDetails = _context5.sent;
          intent = (0, _helpersHere.filterIntents)(data);
          _context5.next = 8;
          return regeneratorRuntime.awrap((0, _ProcessData.processingData)(null, orgDetails.apikey, agent, orgDetails.service, IntentDetailsData, transcript, transcript_id));

        case 8:
          processSecondRequests = _context5.sent;
          _context5.next = 11;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_QueryModel["default"], {
            type: processSecondRequests.type,
            status: "Proccessing",
            code: processSecondRequests.response.code,
            setup_id: processSecondRequests.response.id,
            transcript_id: transcript_id,
            queue_id: queueId,
            query: 2
          }));

        case 11:
          saveQuery = _context5.sent;
          return _context5.abrupt("return", processSecondRequests);

        case 15:
          _context5.prev = 15;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          return _context5.abrupt("return", false);

        case 19:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var saveKpi = function saveKpi(data, transcript_id, agent) {
  var getKPIResult, getMainIntent, main_intent, kpi_of_mainIntent, total, _loop, i, getConfigNotif;

  return regeneratorRuntime.async(function saveKpi$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          getKPIResult = JSON.parse(data);
          console.log(getKPIResult);
          _context7.next = 4;
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
          getMainIntent = _context7.sent;
          main_intent = (0, _helpersHere.changeToJson)(getMainIntent).main_intent.intent_name;
          kpi_of_mainIntent = agent.Group.GroupServiceConfigs[0].Intents.find(function (x) {
            return x.intent === main_intent;
          }); // let totalCSAT = 0;
          // getKPIResult.data.forEach(async (x, i) => {

          total = 0;

          _loop = function _loop(i) {
            var x, findKpiDetails, rw;
            return regeneratorRuntime.async(function _loop$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    x = getKPIResult.data[i];
                    findKpiDetails = kpi_of_mainIntent.data.find(function (xx) {
                      return xx.call_quality.toLowerCase() === x.kpi.toLowerCase();
                    });
                    _context6.next = 4;
                    return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_KpiAnylsisModel["default"], {
                      kpi: x.kpi,
                      rating: x.grade,
                      anaylsis: x.explain,
                      transcript_id: transcript_id,
                      getWeight: findKpiDetails.cust_sat_weight,
                      setup_id: 1,
                      metricsRange: agent.Group.GroupServiceConfigs[0].metricRange
                    }));

                  case 4:
                    rw = _context6.sent;
                    total += parseFloat(findKpiDetails.cust_sat_weight) * 0.01 * parseFloat(x.grade);

                  case 6:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          };

          i = 0;

        case 10:
          if (!(i < getKPIResult.data.length)) {
            _context7.next = 16;
            break;
          }

          _context7.next = 13;
          return regeneratorRuntime.awrap(_loop(i));

        case 13:
          i++;
          _context7.next = 10;
          break;

        case 16:
          _context7.next = 18;
          return regeneratorRuntime.awrap(ConfigNotifF(agent.Group.organization_id));

        case 18:
          getConfigNotif = _context7.sent;
          _context7.next = 21;
          return regeneratorRuntime.awrap(saveAverageTotal({
            csatScore: total,
            transcript_id: transcript_id,
            csat: total <= getConfigNotif.low || total >= getConfigNotif.low,
            status: total <= getConfigNotif.low || total >= getConfigNotif.score ? "Done" : "Created"
          }));

        case 21:
        case "end":
          return _context7.stop();
      }
    }
  });
};

var ConfigNotifF = function ConfigNotifF(organization_id) {
  var getConfigNotif;
  return regeneratorRuntime.async(function ConfigNotifF$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          console.log(organization_id);
          _context8.prev = 1;
          _context8.next = 4;
          return regeneratorRuntime.awrap(_ConfigNotifModel["default"].findOne({
            where: {
              organization_id: organization_id
            }
          }));

        case 4:
          getConfigNotif = _context8.sent;

          if (!(getConfigNotif !== undefined && getConfigNotif !== null)) {
            _context8.next = 10;
            break;
          }

          console.log(getConfigNotif);
          return _context8.abrupt("return", (0, _helpersHere.changeToJson)(getConfigNotif));

        case 10:
          return _context8.abrupt("return", {
            low: 70,
            high: 90
          });

        case 11:
          _context8.next = 17;
          break;

        case 13:
          _context8.prev = 13;
          _context8.t0 = _context8["catch"](1);
          console.log(_context8.t0);
          throw _context8.t0;

        case 17:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[1, 13]]);
};

var saveAverageTotal = function saveAverageTotal(data) {
  var f;
  return regeneratorRuntime.async(function saveAverageTotal$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(_averageTotalModel["default"].findOne({
            where: {
              transcript_id: data.transcript_id
            }
          }));

        case 2:
          f = _context9.sent;

          if (!(f === null)) {
            _context9.next = 8;
            break;
          }

          _context9.next = 6;
          return regeneratorRuntime.awrap(_averageTotalModel["default"].create(data));

        case 6:
          _context9.next = 10;
          break;

        case 8:
          _context9.next = 10;
          return regeneratorRuntime.awrap(_averageTotalModel["default"].update(data, {
            where: {
              transcript_id: data.transcript_id
            }
          }));

        case 10:
          return _context9.abrupt("return", true);

        case 11:
        case "end":
          return _context9.stop();
      }
    }
  });
};

var array_move = function array_move(arr, old_index, new_index) {
  var k;
  return regeneratorRuntime.async(function array_move$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          if (new_index >= arr.length) {
            k = new_index - arr.length + 1;

            while (k--) {
              arr.push(undefined);
            }
          }

          arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
          return _context10.abrupt("return", arr);

        case 3:
        case "end":
          return _context10.stop();
      }
    }
  });
};

var saveIntent = function saveIntent(data, agent, transcript_id, transcript, queueId, request_id, account_code) {
  var intent, IntentDetailsData, saveSubIntentDetails, saveMainIntentDetails, SubIntentDetails, kpi;
  return regeneratorRuntime.async(function saveIntent$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          intent = (0, _helpersHere.filterIntents)(data);
          IntentDetailsData = agent.Group.GroupServiceConfigs[0].Intents.find(function (x) {
            return x.intent === intent.main_intent.name;
          }); // check if main intent have real intent in the database

          if (IntentDetailsData === undefined) {
            IntentDetailsData = agent.Group.GroupServiceConfigs[0].Intents.find(function (x) {
              return x["default"] === true;
            });
          }

          saveSubIntentDetails = null;
          _context11.next = 7;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_IntentDetailsModel["default"], {
            intent_name: intent.main_intent.name,
            score: intent.main_intent.score,
            desc: intent.main_intent.explanation,
            conn: IntentDetailsData.id
          }));

        case 7:
          saveMainIntentDetails = _context11.sent;

          if (!(intent.sub_intents.length !== 0)) {
            _context11.next = 15;
            break;
          }

          // first find if sub intent is find
          SubIntentDetails = agent.Group.GroupServiceConfigs[0].Intents.find(function (x) {
            return x.intent === intent.sub_intents.name;
          });

          if (!(SubIntentDetails !== undefined)) {
            _context11.next = 15;
            break;
          }

          _readOnlyError("saveSubIntentDetails");

          _context11.next = 14;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_IntentDetailsModel["default"], {
            intent_name: intent.sub_intents[0].name,
            score: intent.sub_intents[0].score,
            desc: intent.sub_intents[0].explanation,
            conn: intentId
          }));

        case 14:
          saveSubIntentDetails = _context11.sent;

        case 15:
          _context11.next = 17;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_IntentResultModel["default"], {
            sub_intent_id: saveSubIntentDetails === null ? saveSubIntentDetails : saveSubIntentDetails.id,
            main_intent_id: saveMainIntentDetails.id,
            transcript_id: transcript_id,
            setup_id: request_id
          }));

        case 17:
          _context11.next = 19;
          return regeneratorRuntime.awrap(callForAiProcess(data, transcript_id, transcript, IntentDetailsData, agent, queueId, account_code));

        case 19:
          kpi = _context11.sent;
          return _context11.abrupt("return", kpi);

        case 23:
          _context11.prev = 23;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0);
          return _context11.abrupt("return", false);

        case 27:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

var saveSentiment = function saveSentiment(data, request_id, transcript_id) {
  var parseGetSenti, findSentiment, changeToJsonS;
  return regeneratorRuntime.async(function saveSentiment$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          parseGetSenti = JSON.parse(data);
          parseGetSenti["transcript_id"] = transcript_id;
          parseGetSenti["setup_id"] = request_id;
          parseGetSenti["sentiment_name"] = parseGetSenti["sentiment_name"].toLowerCase();

          if (!(parseGetSenti["sentiment_name"] === undefined)) {
            _context12.next = 9;
            break;
          }

          parseGetSenti["sentiment_name"] = "neutral";
          _context12.next = 14;
          break;

        case 9:
          if (!(parseGetSenti["sentiment_name"].toLowerCase() !== "positive" && parseGetSenti["sentiment_name"].toLowerCase() !== "negative" && parseGetSenti["sentiment_name"].toLowerCase() !== "neutral")) {
            _context12.next = 14;
            break;
          }

          _context12.next = 12;
          return regeneratorRuntime.awrap(_sentimentListsModel["default"].findOne({
            where: {
              list: _defineProperty({}, _sequelize.Op.like, "%".concat(parseGetSenti["sentiment_name"], "%"))
            }
          }));

        case 12:
          findSentiment = _context12.sent;

          if (findSentiment !== null) {
            changeToJsonS = (0, _helpersHere.changeToJson)(findSentiment);
            parseGetSenti["sentiment_name"] = changeToJsonS.type;
          } else {
            parseGetSenti["sentiment_name"] = "neutral";
          }

        case 14:
          _context12.next = 16;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_SentimentAnylsisModel["default"], parseGetSenti));

        case 16:
          _context12.next = 22;
          break;

        case 18:
          _context12.prev = 18;
          _context12.t0 = _context12["catch"](0);
          console.log(_context12.t0);
          return _context12.abrupt("return", false);

        case 22:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var saveTranscriptSeperation = function saveTranscriptSeperation(data, transcript_id, transcript) {
  var findTranscript, findTranscript2, cTranscript, getCombine, agent, costumer;
  return regeneratorRuntime.async(function saveTranscriptSeperation$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _context13.next = 3;
          return regeneratorRuntime.awrap(_TranscriptSeperation["default"].findOne({
            where: {
              transcript_id: transcript_id
            }
          }));

        case 3:
          findTranscript = _context13.sent;
          _context13.next = 6;
          return regeneratorRuntime.awrap(_TranscriptSeperation["default"].findOne({
            where: {
              transcript_id: transcript_id
            }
          }));

        case 6:
          findTranscript2 = _context13.sent;

          if (!(findTranscript === null)) {
            _context13.next = 12;
            break;
          }

          _context13.next = 10;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_TranscriptSeperation["default"], {
            combineSegment: data,
            transcript_id: transcript_id
          }));

        case 10:
          _context13.next = 20;
          break;

        case 12:
          cTranscript = (0, _helpersHere.changeToJson)(findTranscript);
          getCombine = cTranscript.combineSegment;
          agent = [];
          data.forEach(function (v, i) {
            var startMinus = i === 0 ? v.start : v.start - 1;
            var startPlus = i === 0 ? v.start : v.start + 1;
            var endMinus = i === 0 ? v.end : v.end - 2;
            var endPlus = i === 0 ? v.end : v.end + 2;
            var overTalk = 0;
            var a = getCombine.find(function (x) {
              if (x.start >= startMinus && x.start <= startPlus) {
                if (x.end >= endMinus && x.end <= endPlus) return x;
              }
            });

            if (a !== undefined) {
              var temp = {
                start: a.start,
                end: a.end,
                text: a.text,
                id: a.id
              };
              agent.push(temp);
            } // getCombine.forEach((x) => {
            //   let temp = { start: x.start, end: x.end, text: x.text, id: x.id };
            //   if (x.start >= startMinus && x.start >= startPlus) {
            //     console.log(x.start);
            //     // if (x.text === " Yes, it's Yvonne.") {
            //     //   console.log(x);
            //     //   console.log(v.start, x.start);
            //     //   console.log(v.end, x.end);
            //     //   console.log(v);
            //     // }
            //     let check = contain(x.text, v.text);
            //     if (check) {
            //       let check = agent.find((w) => w.id === temp.id);
            //       if (!check) agent.push(temp);
            //     }
            //   } else {
            //     if (
            //       (x.start <= v.start ||
            //         x.start <= startMinus ||
            //         x.start <= startPlus) &&
            //       (x.end >= v.end || x.end >= v.endMinus || x.end >= v.endPlus)
            //     ) {
            //       if (x.end - 2 >= v.end && x.start === v.start) {
            //         temp = { start: v.start, end: v.end, text: v.text, id: null };
            //         agent.push(temp);
            //       } else if (x.end <= v.end + 2) {
            //         // console.log("END");
            //         // console.log(x.text, "|", v.text);
            //         // console.log(x.end, "|", v.end);
            //         // console.log("END");
            //         let check = contain(x.text, v.text);
            //         if (check) {
            //           let a = agent.find((vv) => vv.text === x.text);
            //           if (a === undefined) agent.push(temp);
            //           // else
            //         }
            //       }
            //     }
            //   }
            // });

          });
          costumer = getCombine.map(function (x) {
            var b = agent.find(function (xx) {
              return xx.id === x.id;
            });

            if (b === undefined) {
              return {
                start: x.start,
                end: x.end,
                text: x.text,
                id: x.id
              };
            } else return false;
          }).filter(function (x) {
            return x;
          });
          _context13.next = 19;
          return regeneratorRuntime.awrap(_TranscriptSeperation["default"].update({
            agentSegment: agent,
            costumerSegment: costumer
          }, {
            where: {
              transcript_id: transcript_id
            }
          }));

        case 19:
          return _context13.abrupt("return", {
            costumer: costumer,
            agent: agent
          });

        case 20:
          _context13.next = 26;
          break;

        case 22:
          _context13.prev = 22;
          _context13.t0 = _context13["catch"](0);
          console.log(_context13.t0);
          throw false;

        case 26:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

var saveCompliance = function saveCompliance(data, transcript_id, agent) {
  var getResult, getConfigNotif;
  return regeneratorRuntime.async(function saveCompliance$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          console.log("Compliance *********************");
          getResult = JSON.parse(data);
          _context14.next = 4;
          return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_ComplianceModel["default"], {
            transcript_id: transcript_id,
            explaination: getResult.explaination,
            score: getResult.score
          }));

        case 4:
          _context14.next = 6;
          return regeneratorRuntime.awrap(ConfigNotifF(agent.Group.organization_id));

        case 6:
          getConfigNotif = _context14.sent;
          _context14.next = 9;
          return regeneratorRuntime.awrap(saveAverageTotal({
            csatScore: getResult.score,
            transcript_id: transcript_id,
            compliance: getResult.score <= getConfigNotif.low || getConfigNotif.high <= getResult.score,
            status: getResult.score <= getConfigNotif.low || getConfigNotif.high <= getResult.score ? "Done" : "Created"
          }));

        case 9:
        case "end":
          return _context14.stop();
      }
    }
  });
};

var contain = function contain(agent, combine) {
  var regex, cSplit, countTrue, getPercent;
  return regeneratorRuntime.async(function contain$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
          cSplit = combine.trim().split(" ");
          countTrue = 0;
          cSplit.forEach(function (v) {
            var agentClean = agent.replace(regex, "");
            var combineClean = v.replace(regex, "");
            var a = agentClean.toLowerCase().includes(combineClean.toLowerCase());
            countTrue += a ? 1 : 0;
          });
          getPercent = countTrue / cSplit.length;

          if (!(getPercent >= 0.7)) {
            _context15.next = 9;
            break;
          }

          return _context15.abrupt("return", true);

        case 9:
          return _context15.abrupt("return", false);

        case 10:
        case "end":
          return _context15.stop();
      }
    }
  });
};