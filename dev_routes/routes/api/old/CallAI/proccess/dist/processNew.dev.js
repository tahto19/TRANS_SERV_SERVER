"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _chatgptconfig = require("./assets/chatgptconfig.js");

var _prompt = require("./assets/prompt.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var processNew =
/*#__PURE__*/
function () {
  function processNew() {
    _classCallCheck(this, processNew);

    this.prompts = [];
    this.details;
    this.id;
    this.file;
    this.servicebundles;
    this.api_key;
    this.Intents;
    this.data = {
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AIAPI_KEY
      },
      data: []
    };
  }

  _createClass(processNew, [{
    key: "start",
    value: function start(file, api_key, agent) {
      this.file = file;
      this.api_key = api_key;
      this.Intents = agent.Group.GroupServiceConfigs[0].Intents;
    }
  }, {
    key: "speechToText",
    value: function speechToText() {
      var prompt = (0, _chatgptconfig.speech_cofig)(this.file);
      this.prompts.push(prompt);
      this.data.data.push(prompt);
      return prompt;
    }
  }, {
    key: "getIntent",
    value: function getIntent() {
      var createPrompt = this.createPromptIntent(this.Intents);
      var prompt = (0, _chatgptconfig.intent_config)(null, createPrompt.explanation, createPrompt.intent_prompt);
      this.prompts.push(prompt);
      this.data.data.push(prompt);
      return prompt; // return this.createPromptIntent();
    }
  }, {
    key: "getSentiment",
    value: function getSentiment() {
      var prompt = (0, _chatgptconfig.sentimental_config)();
      this.prompts.push(prompt);
      this.data.data.push(prompt);
      return prompt;
    } // getSeperation() {
    //   let prompt = transcript_seperator_config();
    //   this.prompts.push(prompt);
    //   this.data.data.push(prompt);
    //   return prompt;
    // }

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
    key: "getGeneratedPrompt",
    value: function getGeneratedPrompt() {
      return this.data;
    }
  }]);

  return processNew;
}();

var _default = processNew;
exports["default"] = _default;