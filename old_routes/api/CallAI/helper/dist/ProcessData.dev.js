"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.kpiPromt = exports.createPromptIntent = exports.processingData = void 0;

var _helpersHere = require("../../../../helper/helpersHere.js");

var _QueryModel = _interopRequireDefault(require("../../../../models/Query.model.js"));

var _TranscriptSeperation = _interopRequireDefault(require("../../../../models/TranscriptSeperation.js"));

var _chatgptconfig = require("../proccess/assets/chatgptconfig.js");

var _prompt5 = require("../proccess/assets/prompt.js");

var _excuteRequest = _interopRequireDefault(require("../proccess/excuteRequest.js"));

var _processNew = _interopRequireDefault(require("../proccess/processNew.js"));

var _Query = require("./Query.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var processingData = function processingData(file, apikey, agent, service, intent, transcript, transcript_id) {
  var type, serviceBundle, data, agentDetails, i, v, getAiModule, fileToChage, createPrompt, prompt, _prompt, _prompt2, _prompt3, _prompt4, er, response;

  return regeneratorRuntime.async(function processingData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          type = "";
          _context.prev = 1;

          if (!(!service.Service && !service.Service.ServiceBundles)) {
            _context.next = 4;
            break;
          }

          throw new Error("No Services Found");

        case 4:
          serviceBundle = service.Service.ServiceBundles;
          data = {
            headers: {
              Authorization: "Bearer " + process.env.OPEN_AIAPI_KEY
            },
            data: []
          };
          agentDetails = agent.Group.GroupServiceConfigs[0].Intents[0].intent === undefined ? (0, _helpersHere.changeToJson)(agent) : agent;
          serviceBundle.sort(function (a, b) {
            return a.sequence - b.sequence;
          }); // serviceBundle.forEach(async (v) => {

          i = 0;

        case 9:
          if (!(i < serviceBundle.length)) {
            _context.next = 41;
            break;
          }

          v = serviceBundle[i];
          getAiModule = v.AiModule;
          type += type === "" ? getAiModule.name : "|" + getAiModule.name;

          if (!(getAiModule.name === "DEV-TEXT-TO-SPEECH")) {
            _context.next = 18;
            break;
          }

          fileToChage = v.sequence === 1 ? 2 : 1;
          data.data.push((0, _chatgptconfig.speech_cofig)(file[fileToChage]));
          _context.next = 38;
          break;

        case 18:
          if (!(v.requirement !== null)) {
            _context.next = 22;
            break;
          }

          if (getAiModule.name === "Sentiment Analysis") {
            data.data.push((0, _chatgptconfig.sentimental_config)());
          } else if (getAiModule.name === "Intent Analysis") {
            createPrompt = createPromptIntent(agentDetails.Group.GroupServiceConfigs[0].Intents);
            prompt = (0, _chatgptconfig.intent_config)(null, createPrompt.explanation, createPrompt.intent_prompt);
            data.data.push(prompt);
          } else if (getAiModule.name === "Compliance") {
            console.log(v);
            _prompt = (0, _chatgptconfig.compliance_config)(null, intent.script, agentDetails.Group.GroupServiceConfigs[0].metricRange);
            data.data.push(_prompt);
          }

          _context.next = 38;
          break;

        case 22:
          if (!(getAiModule.name === "Text Analysis")) {
            _context.next = 27;
            break;
          }

          _prompt2 = kpiPromt(intent, transcript, agentDetails.Group.GroupServiceConfigs[0].metricRange);
          data.data.push(_prompt2);
          _context.next = 38;
          break;

        case 27:
          if (!(getAiModule.name === "Content Summarizer")) {
            _context.next = 32;
            break;
          }

          _prompt3 = (0, _chatgptconfig.notes_config)(transcript);
          data.data.push(_prompt3);
          _context.next = 38;
          break;

        case 32:
          if (!(getAiModule.name === "Compliance")) {
            _context.next = 38;
            break;
          }

          _context.next = 35;
          return regeneratorRuntime.awrap(compliancePropmt_with_no_target(transcript_id, intent.script, agentDetails.Group.GroupServiceConfigs[0].metricRange));

        case 35:
          _prompt4 = _context.sent;
          console.log(data.data.length);
          data.data.push(_prompt4);

        case 38:
          i++;
          _context.next = 9;
          break;

        case 41:
          er = new _excuteRequest["default"]();
          _context.next = 44;
          return regeneratorRuntime.awrap(er.start(data, apikey));

        case 44:
          _context.next = 46;
          return regeneratorRuntime.awrap(er.start_call(apikey));

        case 46:
          response = _context.sent;
          return _context.abrupt("return", {
            response: response,
            type: type
          });

        case 50:
          _context.prev = 50;
          _context.t0 = _context["catch"](1);
          console.log(_context.t0);
          throw _context.t0;

        case 54:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 50]]);
};

exports.processingData = processingData;

var compliancePropmt_with_no_target = function compliancePropmt_with_no_target(transcript_id, script, metricRange) {
  var transcriptSeperation, tS, agentText, prompt;
  return regeneratorRuntime.async(function compliancePropmt_with_no_target$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_TranscriptSeperation["default"].findOne({
            where: {
              transcript_id: transcript_id
            }
          }));

        case 3:
          transcriptSeperation = _context2.sent;

          if (!(transcriptSeperation === null)) {
            _context2.next = 6;
            break;
          }

          throw new Error("Somethin went wrong");

        case 6:
          tS = (0, _helpersHere.changeToJson)(transcriptSeperation);
          agentText = "";
          tS.agentSegment.forEach(function (v, i) {
            agentText += v.text + "/n";
          });
          prompt = (0, _chatgptconfig.compliance_config)(agentText, script, metricRange);
          return _context2.abrupt("return", prompt);

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var createPromptIntent = function createPromptIntent(intents) {
  var intentNames = intents.map(function (intent) {
    return intent.intent;
  }).join(",");

  var newPrompt = _prompt5.intent_prompt.replace("[callintent]", intentNames);

  var explanations = intents.filter(function (intent) {
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
};

exports.createPromptIntent = createPromptIntent;

var kpiPromt = function kpiPromt(kpi_array, transcript, metric_range) {
  var array = [];
  var prompt = _prompt5.kpi_prompt;

  for (var i = 0; i < kpi_array.data.length; i++) {
    var kpi_name = kpi_array.data[i].call_quality;
    var kpi_explanation = kpi_array.data[i].metric_desc;
    array.push("\n" + "- " + kpi_name + ":if" + kpi_explanation);
  }

  prompt = prompt.replace("[kpi_array]", array.join(""));
  prompt = prompt.replace("[transcript]", "\"".concat(transcript, "\""));
  prompt = prompt.replace("[metricrange]", metric_range);
  var config = (0, _chatgptconfig.kpi_config)(prompt);
  return config;
};

exports.kpiPromt = kpiPromt;