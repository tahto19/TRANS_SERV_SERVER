"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findTable = exports.updateDataBase = exports.saveToDatabase = exports.findAgent = void 0;

var _helpersHere = require("../../../../helper/helpersHere.js");

var _AgentsModel = _interopRequireDefault(require("../../../../models/Agents.model.js"));

var _GroupServiceConfigModel = _interopRequireDefault(require("../../../../models/GroupServiceConfig.model.js"));

var _GroupsModel = _interopRequireDefault(require("../../../../models/Groups.model.js"));

var _IntentsModel = _interopRequireDefault(require("../../../../models/Intents.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var findAgent = function findAgent(id, include) {
  var agent;
  return regeneratorRuntime.async(function findAgent$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_AgentsModel["default"].findOne({
            where: {
              user_id: id
            },
            include: [include]
          }));

        case 3:
          agent = _context.sent;

          if (!(agent === null)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", {});

        case 8:
          return _context.abrupt("return", (0, _helpersHere.changeToJson)(agent));

        case 9:
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          throw _context.t0;

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.findAgent = findAgent;

var saveToDatabase = function saveToDatabase(Table, data) {
  var a;
  return regeneratorRuntime.async(function saveToDatabase$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          console.log(Table, "here");
          _context2.next = 4;
          return regeneratorRuntime.awrap(Table.create(data));

        case 4:
          a = _context2.sent;
          return _context2.abrupt("return", a);

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

exports.saveToDatabase = saveToDatabase;

var updateDataBase = function updateDataBase(Table, where, data) {
  var a;
  return regeneratorRuntime.async(function updateDataBase$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Table.update(data, where));

        case 3:
          a = _context3.sent;
          return _context3.abrupt("return", a);

        case 7:
          _context3.prev = 7;
          _context3.t0 = _context3["catch"](0);
          throw _context3.t0;

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.updateDataBase = updateDataBase;

var findTable = function findTable(Table, where, include) {
  var query, a;
  return regeneratorRuntime.async(function findTable$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          query = include === undefined ? {
            where: where
          } : {
            where: where,
            include: [include]
          };
          console.log(Table, query);
          _context4.next = 5;
          return regeneratorRuntime.awrap(Table.findAll(query));

        case 5:
          a = _context4.sent;
          return _context4.abrupt("return", a);

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);
          throw _context4.t0;

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.findTable = findTable;