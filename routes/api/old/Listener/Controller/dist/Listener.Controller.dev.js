"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProcess = exports.testListener = exports.getListener = void 0;

var _helpersHere = require("../../../../helper/helpersHere.js");

var _toSend = require("../../../../helper/toSend.js");

var _QueryModel = _interopRequireDefault(require("../../../../models/Query.model.js"));

var _QueueModel = _interopRequireDefault(require("../../../../models/Queue.model.js"));

var _TranscriptsModel = _interopRequireDefault(require("../../../../models/Transcripts.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getListener = function getListener(req, res) {
  var getTranscriptLatest;
  return regeneratorRuntime.async(function getListener$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_QueueModel["default"].findAll({
            limit: 50,
            attributes: ["queue_id", "id"],
            order: [["queue_id", "DESC"]]
          }));

        case 3:
          getTranscriptLatest = _context.sent;
          res.send((0, _toSend.changeSend)(getTranscriptLatest));
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          throw _context.t0;

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getListener = getListener;

var testListener = function testListener(req, res) {
  var id, a;
  return regeneratorRuntime.async(function testListener$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.body.id;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _helpersHere.getConfigurationByTranscriptId)(id));

        case 3:
          a = _context2.sent;
          console.log(a);
          res.send((0, _toSend.changeSend)(a));

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.testListener = testListener;

var getProcess = function getProcess(req, res) {
  var getProcessData;
  return regeneratorRuntime.async(function getProcess$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(_QueryModel["default"].findAll({
            where: {
              limit: 1,
              status: "Proccessing"
            }
          }));

        case 2:
          getProcessData = _context3.sent;
          res.send((0, _toSend.changeSend)(getProcessData));
          console.log(getProcessData);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getProcess = getProcess;