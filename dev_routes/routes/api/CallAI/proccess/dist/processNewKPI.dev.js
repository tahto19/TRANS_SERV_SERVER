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

var processNewKPI =
/*#__PURE__*/
function () {
  function processNewKPI() {
    _classCallCheck(this, processNewKPI);

    this.transcript;
    this.transcript_id;
    this.intent;
    this.kpi;
    this.metric_range;
    this.data = {
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AIAPI_KEY
      },
      data: []
    };
    this.prompts = [];
  }

  _createClass(processNewKPI, [{
    key: "start",
    value: function start(transcript_id, transcript, intentsInfo, intent, metric_range, file) {
      this.transcript = transcript;
      this.transcript_id = transcript_id;
      var getMainIntent = intentsInfo.find(function (x) {
        return x.intent === intent.main_intent.name;
      });
      this.kpi_array = getMainIntent;
      this.metric_range = metric_range;
      this.file = file;
      this.speechToText();
      this.complianceprompt(); // this.getSeperation();

      this.kpiprompt();
      return this.prompt();
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
    key: "kpiprompt",
    value: function kpiprompt() {
      var array = [];
      var prompt = _prompt.kpi_prompt;

      for (var i = 0; i < this.kpi_array.data.length; i++) {
        var kpi_name = this.kpi_array.data[i].call_quality;
        var kpi_explanation = this.kpi_array.data[i].metric_desc;
        array.push("\n" + "- " + kpi_name + ":if" + kpi_explanation);
      }

      prompt = prompt.replace("[kpi_array]", array.join(""));
      prompt = prompt.replace("[transcript]", "\"".concat(this.transcript, "\""));
      prompt = prompt.replace("[metricrange]", this.metric_range);
      var config = (0, _chatgptconfig.kpi_config)(prompt);
      this.prompts.push(config);
      this.data.data.push(config);
      return config;
    }
  }, {
    key: "complianceprompt",
    value: function complianceprompt() {
      var config = (0, _chatgptconfig.compliance_config)(this.transcript, this.kpi_array.script, this.metric_range);
      this.prompts.push(config);
      this.data.data.push(config);
      this.getSeperation();
      this.notesPrompt();
      return config;
    }
  }, {
    key: "getSeperation",
    value: function getSeperation() {
      var prompt = (0, _chatgptconfig.transcript_seperator_config)(this.transcript);
      this.prompts.push(prompt);
      this.data.data.push(prompt);
      return prompt;
    }
  }, {
    key: "notesPrompt",
    value: function notesPrompt() {
      var config = (0, _chatgptconfig.notes_config)(this.transcript, this.kpi_array.script);
      this.prompts.push(config);
      this.data.data.push(config);
      return config;
    }
  }, {
    key: "prompt",
    value: function prompt() {
      return this.data;
    }
  }]);

  return processNewKPI;
}();

var _default = processNewKPI;
exports["default"] = _default;