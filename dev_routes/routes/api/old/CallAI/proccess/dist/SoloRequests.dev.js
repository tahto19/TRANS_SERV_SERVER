"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.speechToTextSolo = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var speechToTextSolo = function speechToTextSolo(file, kind) {
  var a;
  return regeneratorRuntime.async(function speechToTextSolo$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "Post",
            fd: fd
          }));

        case 3:
          a = _context.sent;
          _context.next = 10;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          throw _context.t0;

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

exports.speechToTextSolo = speechToTextSolo;