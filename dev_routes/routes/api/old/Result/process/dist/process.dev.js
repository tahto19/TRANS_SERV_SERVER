"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleError = handleError;
exports.proccess = void 0;

var _TranscriptSeperation = _interopRequireDefault(require("../../../../models/TranscriptSeperation.js"));

var _TranscriptsModel = _interopRequireDefault(require("../../../../models/Transcripts.model.js"));

var _chatgptconfig = require("../../CallAI/proccess/assets/chatgptconfig.js");

var _excuteRequest = _interopRequireDefault(require("../../CallAI/proccess/excuteRequest.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var proccess =
/*#__PURE__*/
function () {
  function proccess() {
    _classCallCheck(this, proccess);

    this.id = "";
  }

  _createClass(proccess, [{
    key: "start",
    value: function start(id) {
      this.id = id;
    }
  }, {
    key: "create",
    value: function create(id) {
      var getId, prompt, r, saveToDB;
      return regeneratorRuntime.async(function create$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              getId = id === undefined ? this.id : id;
              _context.next = 3;
              return regeneratorRuntime.awrap(this.createPrompt(getId));

            case 3:
              prompt = _context.sent;
              _context.next = 6;
              return regeneratorRuntime.awrap(this.request(prompt));

            case 6:
              r = _context.sent;
              _context.next = 9;
              return regeneratorRuntime.awrap(this.saveIntoDatabase(_TranscriptSeperation["default"], {
                transcript_id: getId,
                content: r.details,
                setup_id: r.id
              }));

            case 9:
              saveToDB = _context.sent;
              return _context.abrupt("return", saveToDB);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "createPrompt",
    value: function createPrompt(id) {
      var findTranscript, toPrompt;
      return regeneratorRuntime.async(function createPrompt$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(_TranscriptsModel["default"].findByPk(id));

            case 2:
              findTranscript = _context2.sent;
              _context2.next = 5;
              return regeneratorRuntime.awrap((0, _chatgptconfig.transcript_seperator_config)(findTranscript.content));

            case 5:
              toPrompt = _context2.sent;
              return _context2.abrupt("return", toPrompt);

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "request",
    value: function request(prompt, data) {
      var a, er, i, j;
      return regeneratorRuntime.async(function request$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              a = {
                id: data === undefined ? null : data.id,
                details: data === undefined ? null : data.details
              };
              _context3.prev = 1;
              _context3.next = 4;
              return regeneratorRuntime.awrap(new _excuteRequest["default"]());

            case 4:
              er = _context3.sent;
              _context3.next = 7;
              return regeneratorRuntime.awrap(er.start(prompt));

            case 7:
              i = 0;
              j = 0;

            case 9:
              if (!(a.id === null)) {
                _context3.next = 17;
                break;
              }

              if (j !== 0) console.log("Attempting to reconnect create " + j);
              _context3.next = 13;
              return regeneratorRuntime.awrap(er.create());

            case 13:
              a.id = _context3.sent;
              j++;
              _context3.next = 9;
              break;

            case 17:
              console.log(a);

            case 18:
              if (!(a.details === null)) {
                _context3.next = 27;
                break;
              }

              if (i !== 0) {
                console.log("Attempting to reconnect get " + i);
              }

              _context3.next = 22;
              return regeneratorRuntime.awrap(er.execute());

            case 22:
              a.details = _context3.sent;
              console.log(a.details);
              i++;
              _context3.next = 18;
              break;

            case 27:
              return _context3.abrupt("return", a);

            case 30:
              _context3.prev = 30;
              _context3.t0 = _context3["catch"](1);
              handleError(_context3.t0.message);

            case 33:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[1, 30]]);
    }
  }, {
    key: "saveIntoDatabase",
    value: function saveIntoDatabase(table, data) {
      var save;
      return regeneratorRuntime.async(function saveIntoDatabase$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return regeneratorRuntime.awrap(table.create(data));

            case 3:
              save = _context4.sent;
              return _context4.abrupt("return", save);

            case 7:
              _context4.prev = 7;
              _context4.t0 = _context4["catch"](0);
              handleError(_context4.t0.message);

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 7]]);
    }
  }]);

  return proccess;
}();

exports.proccess = proccess;

function handleError(message) {
  var error = new Error(message);
  error.code = 400;
  error.statusCode = 400;
  throw error;
}