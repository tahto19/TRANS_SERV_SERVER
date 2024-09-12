"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.random = exports.saveTable = exports.saveTranscripts = void 0;

var saveTranscripts = function saveTranscripts() {
  return regeneratorRuntime.async(function saveTranscripts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.saveTranscripts = saveTranscripts;

var saveTable = function saveTable(data, Table) {
  var a;
  return regeneratorRuntime.async(function saveTable$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Table.create(data));

        case 2:
          a = _context2.sent;
          return _context2.abrupt("return", a.id);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.saveTable = saveTable;

var random = function random(number) {
  return Math.floor(Math.random() * number);
};

exports.random = random;