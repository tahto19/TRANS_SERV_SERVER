"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateUserTranscript = void 0;

var _helpersHere = require("../../../../helper/helpersHere.js");

var _GroupServiceConfigModel = _interopRequireDefault(require("../../../../models/GroupServiceConfig.model.js"));

var _GroupsModel = _interopRequireDefault(require("../../../../models/Groups.model.js"));

var _IntentsModel = _interopRequireDefault(require("../../../../models/Intents.model.js"));

var _QueryModel = _interopRequireDefault(require("../../../../models/Query.model.js"));

var _QueueModel = _interopRequireDefault(require("../../../../models/Queue.model.js"));

var _Query = require("../../CallAI/helper/Query.js");

var _getDetailsofOrg = _interopRequireDefault(require("../../CallAI/outsideCall/getDetailsofOrg.js"));

var _excuteRequest = _interopRequireDefault(require("../../CallAI/proccess/excuteRequest.js"));

var _processNew = _interopRequireDefault(require("../../CallAI/proccess/processNew.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var generateUserTranscript = function generateUserTranscript(user_id, agent_group_id) {
  var agent, getQueueList, org, apikey;
  return regeneratorRuntime.async(function generateUserTranscript$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          if (!(user_id !== "" && agent_group_id !== "")) {
            _context2.next = 17;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap((0, _Query.findAgent)(user_id, {
            model: _GroupsModel["default"],
            include: {
              model: _GroupServiceConfigModel["default"],
              include: [{
                model: _IntentsModel["default"],
                attributes: ["intent", "desc", "data", "script"],
                where: {
                  active: true
                }
              }]
            }
          }));

        case 4:
          agent = _context2.sent;
          console.log("running");
          _context2.next = 8;
          return regeneratorRuntime.awrap((0, _Query.findTable)(_QueueModel["default"], {
            user_id: user_id,
            status: "Created"
          }));

        case 8:
          getQueueList = _context2.sent;
          org = new _getDetailsofOrg["default"]();
          _context2.next = 12;
          return regeneratorRuntime.awrap(org.start(81998));

        case 12:
          apikey = org.getApiByCallback("http://localhost:4118/gateway/mock/callback");
          getQueueList.forEach(function _callee(v, i) {
            var val, getQueue_date, file, p, speechToText, getIntent, getSentiment, getPrompt, er, response, a, saveQuery;
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    val = (0, _helpersHere.changeToJson)(v);
                    console.log(val);
                    getQueue_date = val.queue_date instanceof Date && !isNaN(val.queue_date);

                    if (getQueue_date) {
                      _context.next = 6;
                      break;
                    }

                    _context.next = 6;
                    return regeneratorRuntime.awrap((0, _Query.updateDataBase)(_QueueModel["default"], {
                      where: {
                        id: val.id
                      }
                    }, {
                      queue_date: (0, _helpersHere.isValidDate)(val.queue_date) ? val.queue_date : val.createdAt
                    }));

                  case 6:
                    _context.next = 8;
                    return regeneratorRuntime.awrap((0, _helpersHere.getBase64)(val.filepath));

                  case 8:
                    file = _context.sent;

                    if (!file) {
                      _context.next = 30;
                      break;
                    }

                    p = new _processNew["default"]();
                    _context.next = 13;
                    return regeneratorRuntime.awrap(p.start(file, apikey, agent));

                  case 13:
                    speechToText = p.speechToText();
                    getIntent = p.getIntent();
                    getSentiment = p.getSentiment();
                    getPrompt = p.getGeneratedPrompt(); //    start prompt

                    er = new _excuteRequest["default"]();
                    _context.next = 20;
                    return regeneratorRuntime.awrap(er.start(getPrompt, apikey));

                  case 20:
                    _context.next = 22;
                    return regeneratorRuntime.awrap(er.start_call());

                  case 22:
                    response = _context.sent;
                    _context.next = 25;
                    return regeneratorRuntime.awrap((0, _Query.updateDataBase)(_QueueModel["default"], {
                      where: {
                        id: val.id
                      }
                    }, {
                      status: "Processed"
                    }));

                  case 25:
                    a = _context.sent;
                    console.log(a);
                    _context.next = 29;
                    return regeneratorRuntime.awrap((0, _Query.saveToDatabase)(_QueryModel["default"], {
                      type: "Transcript,Intent,Sentiment",
                      status: "Proccessing",
                      code: response.code,
                      setup_id: response.id,
                      transcript_id: null,
                      queue_id: val.id
                    }));

                  case 29:
                    saveQuery = _context.sent;

                  case 30:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });
          return _context2.abrupt("return", {
            getQueueList: getQueueList,
            agent: agent
          });

        case 17:
          return _context2.abrupt("return", false);

        case 18:
          _context2.next = 24;
          break;

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          console.log("error in generating transcript");

        case 24:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

exports.generateUserTranscript = generateUserTranscript;