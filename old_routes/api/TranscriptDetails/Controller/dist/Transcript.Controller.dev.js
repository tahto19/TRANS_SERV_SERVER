"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSeperation = void 0;

var _helpersHere = require("../../../../helper/helpersHere.js");

var _toSend = require("../../../../helper/toSend.js");

var _TranscriptSeperation = _interopRequireDefault(require("../../../../models/TranscriptSeperation.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var getSeperation = function getSeperation(req, res) {
  var id, a, changeA, modifyAgent, modifyCostumer, mergetArray;
  return regeneratorRuntime.async(function getSeperation$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          id = req.query.id;
          console.log(id);
          _context.next = 5;
          return regeneratorRuntime.awrap(_TranscriptSeperation["default"].findOne({
            where: {
              transcript_id: id
            }
          }));

        case 5:
          a = _context.sent;

          if (!(a === null)) {
            _context.next = 8;
            break;
          }

          throw new Error("Not found");

        case 8:
          changeA = (0, _helpersHere.changeToJson)(a);
          modifyAgent = changeA.agentSegment.map(function (v) {
            return {
              agent_message: v.text,
              start: v.start,
              end: v.end,
              id: v.id
            };
          });
          modifyCostumer = changeA.costumerSegment.map(function (v) {
            return {
              customer_message: v.text,
              start: v.start,
              end: v.end,
              id: v.id
            };
          });
          mergetArray = [].concat(_toConsumableArray(modifyAgent), _toConsumableArray(modifyCostumer));
          mergetArray.sort(function (a, b) {
            return a.id - b.id;
          });
          res.send((0, _toSend.changeSend)(mergetArray));
          _context.next = 20;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          throw _context.t0;

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

exports.getSeperation = getSeperation;