"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processSpeechToText = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _url = require("url");

var _proccess = require("./proccess.js");

var _chatgptconfig = require("./assets/chatgptconfig.js");

var _excuteRequest = _interopRequireDefault(require("./excuteRequest.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var processSpeechToText =
/*#__PURE__*/
function () {
  function processSpeechToText() {
    _classCallCheck(this, processSpeechToText);

    this.path;
    this.promt;
    this.details;
    this.id;
    this.file;
    this.data = [{
      headers: {
        Authorization: "Bearer " + process.env.OPEN_AIAPI_KEY
      }
    }];
  }

  _createClass(processSpeechToText, [{
    key: "process",
    value: function process(filepath, file) {
      return regeneratorRuntime.async(function process$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.path = filepath;
              this.file = file;

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getPromptAndeChangeToBase64",
    value: function getPromptAndeChangeToBase64() {
      var convertedData, base64Data;
      return regeneratorRuntime.async(function getPromptAndeChangeToBase64$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_fs["default"].readFileSync(this.path, function (err, data) {
                if (err) (0, _proccess.handleError)(err);
                return data;
              }));

            case 3:
              convertedData = _context2.sent;
              base64Data = convertedData.toString("base64");
              this.prompt = (0, _chatgptconfig.speech_cofig)(base64Data);
              return _context2.abrupt("return", this.prompt);

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](0);
              console.log(_context2.t0);
              (0, _proccess.handleError)(_context2.t0);

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[0, 9]]);
    }
  }, {
    key: "executePromptWithOutChangeFile",
    value: function executePromptWithOutChangeFile() {
      return regeneratorRuntime.async(function executePromptWithOutChangeFile$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              this.prompt = (0, _chatgptconfig.speech_cofig)(this.file);
              return _context3.abrupt("return", this.prompt);

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "executeRequests",
    value: function executeRequests(apikey) {
      var a;
      return regeneratorRuntime.async(function executeRequests$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              a = this.request(apikey);
              this.details = a;
              return _context4.abrupt("return", a);

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "request",
    value: function request(apikey) {
      var er, a;
      return regeneratorRuntime.async(function request$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return regeneratorRuntime.awrap(new _excuteRequest["default"]());

            case 3:
              er = _context5.sent;
              _context5.next = 6;
              return regeneratorRuntime.awrap(er.start(this.prompt, apikey));

            case 6:
              _context5.next = 8;
              return regeneratorRuntime.awrap(er.create());

            case 8:
              a = _context5.sent;
              return _context5.abrupt("return", a);

            case 12:
              _context5.prev = 12;
              _context5.t0 = _context5["catch"](0);
              (0, _proccess.handleError)(_context5.t0.message);

            case 15:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this, [[0, 12]]);
    }
  }]);

  return processSpeechToText;
}();

exports.processSpeechToText = processSpeechToText;