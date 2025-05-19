"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postNotes = exports.getNotes = void 0;

var _toSend = require("../../../../helper/toSend.js");

var _NotesModel = _interopRequireDefault(require("../../../../models/Notes.model.js"));

var _TranscriptsModel = _interopRequireDefault(require("../../../../models/Transcripts.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getNotes = function getNotes(req, res) {
  var id, findTranscript, findNotes;
  return regeneratorRuntime.async(function getNotes$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          id = req.query.id;
          _context.next = 4;
          return regeneratorRuntime.awrap(_TranscriptsModel["default"].findByPk(id));

        case 4:
          findTranscript = _context.sent;

          if (!(findTranscript === null)) {
            _context.next = 7;
            break;
          }

          throw new Error("Something went wrong not found notes");

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(_NotesModel["default"].findOne({
            where: {
              transcript_id: id
            }
          }));

        case 9:
          findNotes = _context.sent;

          if (!(findNotes === null || findNotes.length === 0)) {
            _context.next = 15;
            break;
          }

          _context.next = 13;
          return regeneratorRuntime.awrap(_NotesModel["default"].create({
            transcript_id: id
          }));

        case 13:
          findNotes = _context.sent;
          findNotes["notes"] = "";

        case 15:
          res.send((0, _toSend.changeSend)(findNotes));
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          throw _context.t0;

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

exports.getNotes = getNotes;

var postNotes = function postNotes(req, res) {
  var _req$body, id, notes, r;

  return regeneratorRuntime.async(function postNotes$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, id = _req$body.id, notes = _req$body.notes;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_NotesModel["default"].update({
            notes: notes
          }, {
            where: {
              transcript_id: id
            }
          }));

        case 4:
          r = _context2.sent;
          res.send((0, _toSend.changeSend)(r));
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

exports.postNotes = postNotes;