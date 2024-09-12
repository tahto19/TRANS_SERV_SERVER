"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _AgentsModel = _interopRequireDefault(require("../../../../models/Agents.model.js"));

var _ComplianceModel = _interopRequireDefault(require("../../../../models/Compliance.model.js"));

var _GroupServiceConfigModel = _interopRequireDefault(require("../../../../models/GroupServiceConfig.model.js"));

var _GroupsModel = _interopRequireDefault(require("../../../../models/Groups.model.js"));

var _IntentDetailsModel = _interopRequireDefault(require("../../../../models/IntentDetails.model.js"));

var _IntentResultModel = _interopRequireDefault(require("../../../../models/IntentResult.model.js"));

var _IntentsModel = _interopRequireDefault(require("../../../../models/Intents.model.js"));

var _KpiAnylsisModel = _interopRequireDefault(require("../../../../models/KpiAnylsis.model.js"));

var _NotesModel = _interopRequireDefault(require("../../../../models/Notes.model.js"));

var _SentimentAnylsisModel = _interopRequireDefault(require("../../../../models/SentimentAnylsis.model.js"));

var _TranscriptsModel = _interopRequireDefault(require("../../../../models/Transcripts.model.js"));

var _QueryModel = _interopRequireDefault(require("../../../../models/Query.model.js"));

var _chatgptconfig = require("./assets/chatgptconfig.js");

var _prompt = require("./assets/prompt.js");

var _excuteRequest = _interopRequireDefault(require("./excuteRequest.js"));

var _proccess = require("./proccess.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var NewIntentProcess =
/*#__PURE__*/
function () {
  function NewIntentProcess() {
    _classCallCheck(this, NewIntentProcess);

    this.transcript = "";
    this.transcript_id;
    this.userInfo;
    this.user_id;
    this.group_id;
    this.Intents;
    this.error = [];
    this.saveTranscript_id;
    this.main_intent = null;
    this.getServiceConfig = null;
    this.apikey = 22;
  } // this is old below ////
  // async start(transcript, user_id) {
  //   try {
  //     this.transcript = transcript;
  //     this.user_id = user_id;
  //     this.userInfo = await this.getUserInfo();
  //     this.group_id = this.userInfo.id;
  //     this.getServiceConfig = await this.getServiceConfigDetails();
  //     this.Intents = this.getServiceConfig.Intents;
  //     let getGeneratedPrompt = await this.createPromptIntent();
  //     let getPromptIntent = await chatgptConfig(
  //       transcript,
  //       getGeneratedPrompt.explanation,
  //       getGeneratedPrompt.intent_prompt
  //     );
  //     // this.saveTranscript_id = saveTranscript.id;
  //     let getIntent = await this.request(getPromptIntent);
  //     let saveTranscript = await this.saveToDatabase(Transcripts, {
  //       content: transcript,
  //       agent_id: user_id,
  //       group_id: this.group_id,
  //     });
  //     this.saveTranscript_id = saveTranscript.id;
  //     await saveToQuery(getIntent, "IntentResult");
  //     return;
  //     await this.saveIntent(getIntent);
  //     // let kpiProcess = await this.savekpi();
  //     let senti = await this.saveSenti();
  //     let saveCompliance = await this.saveCompliance();
  //     return { Transcripts: saveTranscript, error: this.error };
  //   } catch (err) {
  //     console.log(err);
  //     throw err;
  //   }
  // }
  // this is old upper ////


  _createClass(NewIntentProcess, [{
    key: "start",
    value: function start(transcript, user_id, Access) {
      var getGeneratedPrompt, getPromptIntent, senti_prompt, getIntent, saveTranscript, getSenti;
      return regeneratorRuntime.async(function start$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              this.apikey = Access.ApiKeys.find(function (x) {
                return x.callback_url === "http://localhost:4118/gateway/mock/callback";
              }).api_key;
              this.transcript = transcript;
              this.user_id = user_id;
              _context.next = 6;
              return regeneratorRuntime.awrap(this.getUserInfo());

            case 6:
              this.userInfo = _context.sent;
              this.group_id = this.userInfo.id;
              _context.next = 10;
              return regeneratorRuntime.awrap(this.getServiceConfigDetails());

            case 10:
              this.getServiceConfig = _context.sent;
              this.Intents = this.getServiceConfig.Intents;
              _context.next = 14;
              return regeneratorRuntime.awrap(this.createPromptIntent());

            case 14:
              getGeneratedPrompt = _context.sent;
              _context.next = 17;
              return regeneratorRuntime.awrap((0, _chatgptconfig.chatgptConfig)(transcript, getGeneratedPrompt.explanation, getGeneratedPrompt.intent_prompt));

            case 17:
              getPromptIntent = _context.sent;
              senti_prompt = (0, _chatgptconfig.sentimental_config)(this.transcript); // this.saveTranscript_id = saveTranscript.id;

              return _context.abrupt("return", getPromptIntent);

            case 22:
              getIntent = _context.sent;
              _context.next = 25;
              return regeneratorRuntime.awrap(this.saveToDatabase(_TranscriptsModel["default"], {
                content: transcript,
                agent_id: user_id,
                group_id: this.group_id
              }));

            case 25:
              saveTranscript = _context.sent;
              this.saveTranscript_id = saveTranscript.id;
              _context.next = 29;
              return regeneratorRuntime.awrap(this.saveToQuery(getIntent, "IntentResult"));

            case 29:
              _context.next = 31;
              return regeneratorRuntime.awrap(this.request(senti_prompt));

            case 31:
              getSenti = _context.sent;
              _context.next = 34;
              return regeneratorRuntime.awrap(this.saveToQuery(getSenti, "SentimentAnylsis"));

            case 34:
              return _context.abrupt("return", {
                Transcripts: saveTranscript,
                error: this.error,
                getSenti: getSenti,
                getIntent: getIntent
              });

            case 37:
              _context.prev = 37;
              _context.t0 = _context["catch"](0);
              console.log(_context.t0);
              throw _context.t0;

            case 41:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 37]]);
    }
  }, {
    key: "process",
    value: function process() {}
  }, {
    key: "getUserInfo",
    value: function getUserInfo() {
      var r;
      return regeneratorRuntime.async(function getUserInfo$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_GroupsModel["default"].findOne({
                include: [{
                  model: _AgentsModel["default"],
                  require: true,
                  attributes: ["fullname", "contact_details", "id", "agent_group_id"],
                  where: {
                    id: this.user_id
                  }
                }]
              }));

            case 3:
              r = _context2.sent;

              if (!(r == null)) {
                _context2.next = 6;
                break;
              }

              throw new Error("Not user Found");

            case 6:
              return _context2.abrupt("return", r.toJSON());

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](0);
              throw _context2.t0;

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[0, 9]]);
    }
  }, {
    key: "getServiceConfigDetails",
    value: function getServiceConfigDetails() {
      var r, _toReturn;

      return regeneratorRuntime.async(function getServiceConfigDetails$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findOne({
                where: {
                  groupId: this.group_id
                },
                include: [{
                  model: _IntentsModel["default"],
                  attributes: ["intent", "desc", "data", "script"],
                  where: {
                    active: true
                  }
                }]
              }));

            case 3:
              r = _context3.sent;

              if (!(r === null)) {
                _context3.next = 6;
                break;
              }

              throw new Error("Not Found Config");

            case 6:
              _toReturn = r.toJSON();

              if (!(_toReturn.Intents.length === 0)) {
                _context3.next = 9;
                break;
              }

              throw new Error("No Intent Found");

            case 9:
              return _context3.abrupt("return", _toReturn);

            case 12:
              _context3.prev = 12;
              _context3.t0 = _context3["catch"](0);
              console.log(_context3.t0);
              throw _context3.t0;

            case 16:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[0, 12]]);
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
    key: "request",
    value: function request(prompt, data) {
      var a, er, i, j, _a;

      return regeneratorRuntime.async(function request$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              a = {
                id: data === undefined ? null : data.id,
                details: data === undefined ? null : data.details,
                createDetails: data === undefined ? null : data.createDetails
              };
              _context4.prev = 1;
              _context4.next = 4;
              return regeneratorRuntime.awrap(new _excuteRequest["default"]());

            case 4:
              er = _context4.sent;
              i = 0;
              j = 0;
              prompt["data"] = [prompt["fields"]];
              delete prompt.fields;
              delete prompt.service_api_id;
              delete prompt.request_link_id;
              _context4.next = 13;
              return regeneratorRuntime.awrap(er.start(prompt, this.apikey));

            case 13:
              _context4.next = 15;
              return regeneratorRuntime.awrap(er.create());

            case 15:
              _a = _context4.sent;
              return _context4.abrupt("return", _a);

            case 19:
              _context4.prev = 19;
              _context4.t0 = _context4["catch"](1);
              (0, _proccess.handleError)(_context4.t0.message);

            case 22:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this, [[1, 19]]);
    }
  }, {
    key: "createKPI_Prompt",
    value: function createKPI_Prompt(transcript, kpi_array, metric_range) {
      var prompt, array, i, kpi_name, kpi_explanation;
      return regeneratorRuntime.async(function createKPI_Prompt$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
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
              return _context5.abrupt("return", prompt);

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      });
    } // new saving below

  }, {
    key: "saveToQuery",
    value: function saveToQuery(data, TableName) {
      var toReturn;
      return regeneratorRuntime.async(function saveToQuery$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(this.saveToDatabase(_QueryModel["default"], {
                type: TableName,
                setup_id: data.id,
                code: data.code,
                transcript_id: this.saveTranscript_id
              }));

            case 2:
              toReturn = _context6.sent;
              return _context6.abrupt("return", toReturn);

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    } // new saving above

  }, {
    key: "saveIntent",
    value: function saveIntent(data) {
      var saveSubIntentDetails, saveMainIntentDetails, toReturn, intents, filtered_intent, filter_main, filter_sub;
      return regeneratorRuntime.async(function saveIntent$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              saveSubIntentDetails = null;
              saveMainIntentDetails = null;
              toReturn = null;
              intents = JSON.parse(data.details);

              if (!data.details.error) {
                _context7.next = 11;
                break;
              }

              _context7.next = 7;
              return regeneratorRuntime.awrap(this.saveToDatabase(_QueryModel["default"], {
                type: "Intents",
                setup_id: data.id.id,
                code: data.id.code,
                transcript_id: this.saveTranscript_id
              }));

            case 7:
              toReturn = _context7.sent;
              this.error.push(data.details.error);
              _context7.next = 24;
              break;

            case 11:
              filtered_intent = {
                main_intent: {},
                sub_intents: {}
              };
              filter_main = intents.intents.reduce(function (maxObject, currentObject) {
                return currentObject.score > maxObject.score ? currentObject : maxObject;
              }, intents.intents[0]); // filtered_intent.main_intent = filter_main;

              filter_sub = intents.intents.filter(function (x) {
                var score = filtered_intent.main_intent.score - x.score;
                return x !== filtered_intent.main_intent && (x.score > 0.5 || score == 0.1 || score == 0.2);
              });
              _context7.next = 16;
              return regeneratorRuntime.awrap(this.saveToDatabase(_IntentDetailsModel["default"], {
                intent_name: filter_main.name,
                score: filter_main.score,
                desc: filter_main.explanation
              }));

            case 16:
              saveMainIntentDetails = _context7.sent;

              if (!(filter_sub.length !== 0)) {
                _context7.next = 21;
                break;
              }

              _context7.next = 20;
              return regeneratorRuntime.awrap(this.saveToDatabase(_IntentDetailsModel["default"], {
                intent_name: filter_sub[0].name,
                score: filter_sub[0].score,
                desc: filter_sub[0].explanation
              }));

            case 20:
              saveSubIntentDetails = _context7.sent;

            case 21:
              _context7.next = 23;
              return regeneratorRuntime.awrap(this.saveToDatabase(_IntentResultModel["default"], {
                sub_intent_id: saveSubIntentDetails === null ? saveSubIntentDetails : saveSubIntentDetails.id,
                main_intent_id: saveMainIntentDetails.id,
                transcript_id: this.saveTranscript_id,
                setup_id: data.id
              }));

            case 23:
              toReturn = _context7.sent;

            case 24:
              this.main_intent = saveMainIntentDetails.toJSON();
              return _context7.abrupt("return", toReturn);

            case 26:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "savekpi",
    value: function savekpi(d) {
      var _this = this;

      var toReturn, getMainIntent, processIntentData, _kpi_prompt, getKpi, getKPIResult;

      return regeneratorRuntime.async(function savekpi$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              toReturn = null;

              if (!(this.main_intent === null)) {
                _context9.next = 5;
                break;
              }

              this.error.push({
                error: true,
                message: "Need Intent to Finish this transaction"
              });
              _context9.next = 24;
              break;

            case 5:
              getMainIntent = this.Intents.find(function (x) {
                return x.intent === _this.main_intent.intent_name;
              });
              _context9.next = 8;
              return regeneratorRuntime.awrap(this.createKPI_Prompt(this.transcript, getMainIntent.data, this.getServiceConfig.metricRange));

            case 8:
              processIntentData = _context9.sent;
              _context9.next = 11;
              return regeneratorRuntime.awrap((0, _chatgptconfig.kpi_config)(processIntentData));

            case 11:
              _kpi_prompt = _context9.sent;
              _context9.next = 14;
              return regeneratorRuntime.awrap(this.request(_kpi_prompt));

            case 14:
              getKpi = _context9.sent;

              if (!getKpi.details.error) {
                _context9.next = 22;
                break;
              }

              _context9.next = 18;
              return regeneratorRuntime.awrap(this.saveToDatabase(_QueryModel["default"], {
                type: "KPI",
                setup_id: getKpi.id.id,
                code: getKpi.id.code,
                transcript_id: this.saveTranscript_id
              }));

            case 18:
              toReturn = _context9.sent;
              this.push({
                error: true,
                message: "Waiting for KPI to finish"
              });
              _context9.next = 24;
              break;

            case 22:
              getKPIResult = JSON.parse(getKpi.details);
              getKPIResult.data.forEach(function _callee(x) {
                var findKpiDetails;
                return regeneratorRuntime.async(function _callee$(_context8) {
                  while (1) {
                    switch (_context8.prev = _context8.next) {
                      case 0:
                        console.log(x, getMainIntent.data);
                        findKpiDetails = getMainIntent.data.find(function (xx) {
                          return xx.call_quality.toLowerCase() === x.kpi.toLowerCase();
                        });
                        if (findKpiDetails === undefined) _this.error.push("".concat(x.kpi, " Didnt save to backend"));
                        _context8.next = 5;
                        return regeneratorRuntime.awrap(_this.saveToDatabase(_KpiAnylsisModel["default"], {
                          kpi: x.kpi,
                          rating: x.grade,
                          anaylsis: x.explain,
                          transcript_id: _this.saveTranscript_id,
                          getWeight: findKpiDetails.cust_sat_weight,
                          setup_id: getKpi.id,
                          metricsRange: _this.getServiceConfig.metricRange
                        }));

                      case 5:
                        toReturn = _context8.sent;

                      case 6:
                      case "end":
                        return _context8.stop();
                    }
                  }
                });
              });

            case 24:
              return _context9.abrupt("return", toReturn);

            case 25:
            case "end":
              return _context9.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "saveSenti",
    value: function saveSenti() {
      var toReturn, senti_prompt, getSenti, parseGetSenti;
      return regeneratorRuntime.async(function saveSenti$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              toReturn = null;
              senti_prompt = (0, _chatgptconfig.sentimental_config)(this.transcript);
              _context10.next = 4;
              return regeneratorRuntime.awrap(this.request(senti_prompt));

            case 4:
              getSenti = _context10.sent;

              if (!getSenti.details.error) {
                _context10.next = 12;
                break;
              }

              _context10.next = 8;
              return regeneratorRuntime.awrap(this.saveToDatabase(_QueryModel["default"], {
                type: "Sentiment Anylsis",
                setup_id: getSenti.id.id,
                code: getSenti.id.code,
                transcript_id: this.saveTranscript_id
              }));

            case 8:
              toReturn = _context10.sent;
              this.error.push({
                error: true,
                message: "waiting for senti to finish"
              });
              _context10.next = 18;
              break;

            case 12:
              parseGetSenti = JSON.parse(getSenti.details);
              parseGetSenti["setup_id"] = getSenti.id;
              parseGetSenti["transcript_id"] = this.saveTranscript_id;
              _context10.next = 17;
              return regeneratorRuntime.awrap(this.saveToDatabase(_SentimentAnylsisModel["default"], parseGetSenti));

            case 17:
              toReturn = _context10.sent;

            case 18:
              return _context10.abrupt("return", toReturn);

            case 19:
            case "end":
              return _context10.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "saveCompliance",
    value: function saveCompliance() {
      var _this2 = this;

      var getMainIntent, config, getRequest, getResult;
      return regeneratorRuntime.async(function saveCompliance$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              if (!(this.main_intent === null)) {
                _context11.next = 4;
                break;
              }

              this.error.push({
                error: true,
                message: "Need Intent to Finish this transaction"
              });
              _context11.next = 27;
              break;

            case 4:
              getMainIntent = this.Intents.find(function (x) {
                return x.intent === _this2.main_intent.intent_name;
              });

              if (!(getMainIntent === undefined)) {
                _context11.next = 10;
                break;
              }

              console.log(this.Intents);
              this.error.push({
                error: true,
                message: "Cant Find Main Intent"
              });
              _context11.next = 27;
              break;

            case 10:
              config = (0, _chatgptconfig.compliance_config)(this.transcript, getMainIntent.script, this.getServiceConfig.metricRange);
              _context11.next = 13;
              return regeneratorRuntime.awrap(this.request(config));

            case 13:
              getRequest = _context11.sent;

              if (!getRequest.details.error) {
                _context11.next = 21;
                break;
              }

              _context11.next = 17;
              return regeneratorRuntime.awrap(this.saveToDatabase(_QueryModel["default"], {
                type: "Compliance",
                setup_id: getRequest.id.id,
                code: getRequest.id.code,
                transcript_id: this.saveTranscript_id
              }));

            case 17:
              toReturn = _context11.sent;
              this.push({
                error: true,
                message: "Waiting for Compliance to finish"
              });
              _context11.next = 27;
              break;

            case 21:
              getResult = JSON.parse(getRequest.details);
              _context11.next = 24;
              return regeneratorRuntime.awrap(this.saveToDatabase(_NotesModel["default"], {
                transcript_id: this.saveTranscript_id,
                notes: getResult.explaination
              }));

            case 24:
              _context11.next = 26;
              return regeneratorRuntime.awrap(this.saveToDatabase(_ComplianceModel["default"], {
                transcript_id: this.saveTranscript_id,
                explaination: getResult.explaination,
                score: getResult.score
              }));

            case 26:
              return _context11.abrupt("return", {
                getResult: getResult,
                config: config
              });

            case 27:
            case "end":
              return _context11.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "saveToDatabase",
    value: function saveToDatabase(table, data) {
      var dataToInsert, save;
      return regeneratorRuntime.async(function saveToDatabase$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.prev = 0;
              dataToInsert = data.error ? {} : data;
              _context12.next = 4;
              return regeneratorRuntime.awrap(table.create(dataToInsert));

            case 4:
              save = _context12.sent;
              return _context12.abrupt("return", save);

            case 8:
              _context12.prev = 8;
              _context12.t0 = _context12["catch"](0);
              (0, _proccess.handleError)(_context12.t0);

            case 11:
            case "end":
              return _context12.stop();
          }
        }
      }, null, null, [[0, 8]]);
    }
  }]);

  return NewIntentProcess;
}();

var _default = NewIntentProcess;
exports["default"] = _default;