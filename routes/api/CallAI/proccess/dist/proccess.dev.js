"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleError = handleError;
exports.proccessIntent = void 0;

var _AgentsModel = _interopRequireDefault(require("../../../../models/Agents.model.js"));

var _GroupServiceConfigModel = _interopRequireDefault(require("../../../../models/GroupServiceConfig.model.js"));

var _GroupsModel = _interopRequireDefault(require("../../../../models/Groups.model.js"));

var _IntentsModel = _interopRequireDefault(require("../../../../models/Intents.model.js"));

var fs = _interopRequireWildcard(require("fs"));

var _prompt = require("./assets/prompt.js");

var _helpersHere = require("../../../../helper/helpersHere.js");

var _chatgptconfig = require("./assets/chatgptconfig.js");

var _excuteRequest = _interopRequireDefault(require("./excuteRequest.js"));

var _TranscriptsModel = _interopRequireDefault(require("../../../../models/Transcripts.model.js"));

var _IntentResultModel = _interopRequireDefault(require("../../../../models/IntentResult.model.js"));

var _IntentDetailsModel = _interopRequireDefault(require("../../../../models/IntentDetails.model.js"));

var _KpiAnylsisModel = _interopRequireDefault(require("../../../../models/KpiAnylsis.model.js"));

var _SentimentAnylsisModel = _interopRequireDefault(require("../../../../models/SentimentAnylsis.model.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import Transcripts from "../../../../models/Transcripts.model.js";
var returnByAi = '{"intents":[{"name":"Sales","score":0.8,"explanation":"The conversation is related to a potential sale or business transaction."},{"name":"Support","score":0.2,"explanation":"The conversation is seeking assistance or support with a product or service."},{"name":"Interview","score":0.0,"explanation":"The conversation is not related to an interview."},{"name":"Complaint","score":0.0,"explanation":"The conversation is not a complaint."}]}';

var proccessIntent =
/*#__PURE__*/
function () {
  function proccessIntent() {
    _classCallCheck(this, proccessIntent);

    this.api_key = "";
    this.group_id;
    this.Intents = [];
    this.error = [];
    this.kind;
  }

  _createClass(proccessIntent, [{
    key: "process",
    value: function process(transcript, userId, kind) {
      var _this = this;

      var getUserInfo, getServiceConfig, getGeneratedPrompt, getPromptIntent, getIntent, getMainAndSubIntent, kpiDetails, processIntentData, _kpi_prompt, getKpi, getKPIResult, senti_prompt, getSenti, saveTranscript, saveSubIntentDetails, saveMainIntentDetails, saveIntentResult, parseGetSenti, getSentimentResult;

      return regeneratorRuntime.async(function process$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(this.getUserInfo(userId));

            case 3:
              getUserInfo = _context2.sent;
              this.kind = kind;
              if (getUserInfo === null) handleError("Id Provided cant find in the database");
              this.group_id = getUserInfo.id;
              _context2.next = 9;
              return regeneratorRuntime.awrap(this.getServiceConfigDetails());

            case 9:
              getServiceConfig = _context2.sent;
              if (getServiceConfig === null) handleError("Cant Find Config for this group");
              if (getServiceConfig.Intents.length === 0) handleError("Cant Find Intent for this group");
              this.Intents = getServiceConfig.Intents;
              _context2.next = 15;
              return regeneratorRuntime.awrap(this.createPromptIntent());

            case 15:
              getGeneratedPrompt = _context2.sent;
              _context2.next = 18;
              return regeneratorRuntime.awrap((0, _chatgptconfig.chatgptConfig)(transcript, getGeneratedPrompt.explanation, getGeneratedPrompt.intent_prompt));

            case 18:
              getPromptIntent = _context2.sent;
              //
              console.log("getIntent");
              _context2.next = 22;
              return regeneratorRuntime.awrap(this.request(getPromptIntent));

            case 22:
              getIntent = _context2.sent;
              getMainAndSubIntent = this.filterIntents(getIntent.details);
              _context2.next = 26;
              return regeneratorRuntime.awrap(this.kpiProcess(getMainAndSubIntent));

            case 26:
              kpiDetails = _context2.sent;
              _context2.next = 29;
              return regeneratorRuntime.awrap(this.createKPI_Prompt(transcript, kpiDetails.data, getServiceConfig.metricRange));

            case 29:
              processIntentData = _context2.sent;
              _context2.next = 32;
              return regeneratorRuntime.awrap((0, _chatgptconfig.kpi_config)(processIntentData));

            case 32:
              _kpi_prompt = _context2.sent;
              console.log("getKpi");
              _context2.next = 36;
              return regeneratorRuntime.awrap(this.request(_kpi_prompt));

            case 36:
              getKpi = _context2.sent;
              //
              getKPIResult = JSON.parse(getKpi.details);
              senti_prompt = (0, _chatgptconfig.sentimental_config)(transcript);
              console.log("getSenti");
              _context2.next = 42;
              return regeneratorRuntime.awrap(this.request(senti_prompt));

            case 42:
              getSenti = _context2.sent;
              //
              console.log("saving Transcripts");
              _context2.next = 46;
              return regeneratorRuntime.awrap(this.saveIntoDatabase(_TranscriptsModel["default"], {
                content: transcript,
                agent_id: userId,
                group_id: getUserInfo.id
              }));

            case 46:
              saveTranscript = _context2.sent;
              saveSubIntentDetails = null;
              console.log("saving IntentDetails");
              _context2.next = 51;
              return regeneratorRuntime.awrap(this.saveIntoDatabase(_IntentDetailsModel["default"], {
                intent_name: getMainAndSubIntent.main_intent.name,
                score: getMainAndSubIntent.main_intent.score,
                desc: getMainAndSubIntent.main_intent.explanation
              }));

            case 51:
              saveMainIntentDetails = _context2.sent;

              if (!(getMainAndSubIntent.sub_intents.length !== 0)) {
                _context2.next = 56;
                break;
              }

              _context2.next = 55;
              return regeneratorRuntime.awrap(this.saveIntoDatabase(_IntentDetailsModel["default"], {
                intent_name: getMainAndSubIntent.sub_intents.name,
                score: getMainAndSubIntent.sub_intents.score,
                desc: getMainAndSubIntent.sub_intents.explanation
              }));

            case 55:
              saveSubIntent = _context2.sent;

            case 56:
              console.log("saving Intent Result " + getIntent.id);
              _context2.next = 59;
              return regeneratorRuntime.awrap(this.saveIntoDatabase(_IntentResultModel["default"], {
                sub_intent_id: saveSubIntentDetails === null ? saveSubIntentDetails : saveSubIntentDetails.id,
                main_intent_id: saveMainIntentDetails.id,
                transcript_id: saveTranscript.id,
                setup_id: getIntent.id
              }));

            case 59:
              saveIntentResult = _context2.sent;
              console.log("saving kpiDetails");
              getKPIResult.data.forEach(function _callee(x) {
                var findKpiDetails;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        findKpiDetails = kpiDetails.data.find(function (xx) {
                          return xx.call_quality.toLowerCase() === x.kpi.toLowerCase();
                        });
                        if (findKpiDetails.length === 0) _this.error.push("".concat(x.kpi, " Didnt save to backend"));
                        _context.next = 4;
                        return regeneratorRuntime.awrap(_this.saveIntoDatabase(_KpiAnylsisModel["default"], {
                          kpi: x.kpi,
                          rating: x.grade,
                          anaylsis: x.explain,
                          transcript_id: saveTranscript.id,
                          getWeight: findKpiDetails.cust_sat_weight,
                          setup_id: getKpi.id
                        }));

                      case 4:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              }); // console.log("saving sentiment", getSentiPromptIdDetails);

              parseGetSenti = JSON.parse(getSenti.details);
              parseGetSenti["setup_id"] = getSenti.id;
              parseGetSenti["transcript_id"] = saveTranscript.id;
              _context2.next = 67;
              return regeneratorRuntime.awrap(this.saveIntoDatabase(_SentimentAnylsisModel["default"], parseGetSenti));

            case 67:
              getSentimentResult = _context2.sent;
              return _context2.abrupt("return", saveTranscript);

            case 71:
              _context2.prev = 71;
              _context2.t0 = _context2["catch"](0);
              console.log(_context2.t0);
              if (_context2.t0.data !== undefined) handleError(_context2.t0.data.error);else handleError(_context2.t0.message);

            case 75:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[0, 71]]);
    }
  }, {
    key: "createPromptIntent",
    value: function createPromptIntent() {
      var intentNames = this.Intents.map(function (intent) {
        return intent.intent;
      }).join(",");

      var newPrompt = _prompt.intent_prompt.replace("[callintent]", intentNames);

      var explanations = this.Intents.filter(function (intent) {
        return intent.desc.trim() !== "";
      }).map(function (intent) {
        return "".concat(intent.intent, ": ").concat(intent.desc);
      }).join("\n");
      var response = {
        response: true,
        intent_prompt: newPrompt,
        explanation: explanations || " "
      };
      return response;
    }
  }, {
    key: "getUserInfo",
    value: function getUserInfo(userId) {
      var r;
      return regeneratorRuntime.async(function getUserInfo$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(_GroupsModel["default"].findAll({
                raw: true,
                include: [{
                  model: _AgentsModel["default"],
                  require: true,
                  attributes: ["fullname", "contact_details", "id", "agent_group_id"],
                  where: {
                    id: userId
                  }
                }]
              }));

            case 2:
              r = _context3.sent;
              console.log(r);
              return _context3.abrupt("return", (0, _helpersHere.changeToJson)(r));

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }, {
    key: "getServiceConfigDetails",
    value: function getServiceConfigDetails() {
      var r;
      return regeneratorRuntime.async(function getServiceConfigDetails$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findAll({
                raw: true,
                where: {
                  groupId: this.group_id
                },
                include: [{
                  model: _IntentsModel["default"],
                  attributes: ["intent", "desc", "data"],
                  where: {
                    active: true
                  }
                }]
              }));

            case 2:
              r = _context4.sent;
              return _context4.abrupt("return", (0, _helpersHere.changeToJson)(r));

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "filterIntents",
    value: function filterIntents(data) {
      var intents = JSON.parse(data);
      var filtered_intent = {
        main_intent: {},
        sub_intents: []
      };
      var filter_main = intents.intents.reduce(function (maxObject, currentObject) {
        return currentObject.score > maxObject.score ? currentObject : maxObject;
      }, intents.intents[0]);
      filtered_intent.main_intent = filter_main;
      var filter_sub = intents.intents.filter(function (x) {
        var score = filtered_intent.main_intent.score - x.score;
        return x !== filtered_intent.main_intent && (x.score > 0.5 || score == 0.1 || score == 0.2);
      });
      filtered_intent.sub_intents = filter_sub;
      return filtered_intent;
    }
  }, {
    key: "kpiProcess",
    value: function kpiProcess(d) {
      var getMainIntent;
      return regeneratorRuntime.async(function kpiProcess$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              getMainIntent = this.Intents.find(function (x) {
                return x.intent === d.main_intent.name;
              });
              return _context5.abrupt("return", getMainIntent);

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "createKPI_Prompt",
    value: function createKPI_Prompt(transcript, kpi_array, metric_range) {
      var prompt, array, i, kpi_name, kpi_explanation;
      return regeneratorRuntime.async(function createKPI_Prompt$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              prompt = _prompt.kpi_prompt;
              array = [];

              for (i = 0; i < kpi_array.length; i++) {
                kpi_name = kpi_array[i].call_quality;
                kpi_explanation = kpi_array[i].metric_desc;
                array.push("\n" + "- " + kpi_name + " which means: " + kpi_explanation);
              }

              prompt = prompt.replace("[kpi_array]", array.join(""));
              prompt = prompt.replace("[transcript]", "\"".concat(transcript, "\""));
              prompt = prompt.replace("[metricrange]", metric_range);
              return _context6.abrupt("return", prompt);

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
  }, {
    key: "saveIntoDatabase",
    value: function saveIntoDatabase(table, data) {
      var save;
      return regeneratorRuntime.async(function saveIntoDatabase$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return regeneratorRuntime.awrap(table.create(data));

            case 3:
              save = _context7.sent;
              return _context7.abrupt("return", save);

            case 7:
              _context7.prev = 7;
              _context7.t0 = _context7["catch"](0);
              handleError(_context7.t0.message);

            case 10:
            case "end":
              return _context7.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }, {
    key: "request",
    value: function request(prompt, data) {
      var a, er, i, j;
      return regeneratorRuntime.async(function request$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              a = {
                id: data === undefined ? null : data.id,
                details: data === undefined ? null : data.details
              };
              _context8.prev = 1;
              _context8.next = 4;
              return regeneratorRuntime.awrap(new _excuteRequest["default"]());

            case 4:
              er = _context8.sent;
              _context8.next = 7;
              return regeneratorRuntime.awrap(er.start(prompt));

            case 7:
              i = 0;
              j = 0;

            case 9:
              if (!(a.id === null)) {
                _context8.next = 17;
                break;
              }

              if (j !== 0) console.log("Attempting to reconnect create " + j);
              _context8.next = 13;
              return regeneratorRuntime.awrap(er.create());

            case 13:
              a.id = _context8.sent;
              j++;
              _context8.next = 9;
              break;

            case 17:
              console.log(a);

            case 18:
              if (!(a.details === null)) {
                _context8.next = 26;
                break;
              }

              if (i !== 0) {
                console.log("Attempting to reconnect get " + i); // a.details = await er.callback();
              } // else


              _context8.next = 22;
              return regeneratorRuntime.awrap(er.execute());

            case 22:
              a.details = _context8.sent;
              i++;
              _context8.next = 18;
              break;

            case 26:
              return _context8.abrupt("return", a);

            case 29:
              _context8.prev = 29;
              _context8.t0 = _context8["catch"](1);
              handleError(_context8.t0.message);

            case 32:
            case "end":
              return _context8.stop();
          }
        }
      }, null, null, [[1, 29]]);
    }
  }]);

  return proccessIntent;
}();

exports.proccessIntent = proccessIntent;

function handleError(message) {
  var error = new Error(message);
  error.code = 400;
  error.statusCode = 400;
  throw error;
}