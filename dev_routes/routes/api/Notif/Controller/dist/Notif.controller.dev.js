"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seenNotif = exports.NewgetNotif = exports.getNotif = void 0;

var _sequelize = require("sequelize");

var _toSend = require("../../../../helper/toSend.js");

var _AgentsModel = _interopRequireDefault(require("../../../../models/Agents.model.js"));

var _GroupsModel = _interopRequireDefault(require("../../../../models/Groups.model.js"));

var _NotesModel = _interopRequireDefault(require("../../../../models/Notes.model.js"));

var _TranscriptsModel = _interopRequireDefault(require("../../../../models/Transcripts.model.js"));

var _averageTotalModel = _interopRequireDefault(require("../../../../models/averageTotal.model.js"));

var _Group = require("../../Group/Group.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getNotif = function getNotif(req, res) {
  var id, _getNotif;

  return regeneratorRuntime.async(function getNotif$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          id = req.query.id;
          _context.next = 4;
          return regeneratorRuntime.awrap(_averageTotalModel["default"].count({
            where: {
              status: "Created"
            },
            include: [{
              required: true,
              model: _TranscriptsModel["default"],
              // attributes: ["Agents", "createdAt", "id"],
              include: [{
                model: _AgentsModel["default"],
                required: true
              }, {
                required: true,
                model: _GroupsModel["default"],
                where: {
                  organization_id: id
                } // attributes: [],

              }, {
                model: _NotesModel["default"],
                required: true
              }]
            }]
          }));

        case 4:
          _getNotif = _context.sent;
          res.send((0, _toSend.changeSend)({
            count: _getNotif
          }));
          _context.next = 12;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          throw _context.t0;

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getNotif = getNotif;

var NewgetNotif = function NewgetNotif(req, res) {
  var _req$body, id, offset, limit, _getNotif2;

  return regeneratorRuntime.async(function NewgetNotif$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, id = _req$body.id, offset = _req$body.offset, limit = _req$body.limit;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_averageTotalModel["default"].findAll({
            where: {
              status: "Created"
            },
            include: [{
              required: true,
              model: _TranscriptsModel["default"],
              // attributes: ["Agents", "createdAt", "id"],
              include: [{
                model: _AgentsModel["default"]
              }, {
                required: true,
                model: _GroupsModel["default"],
                where: {
                  organization_id: id
                } // attributes: [],

              }, {
                model: _NotesModel["default"],
                required: true
              }]
            }],
            limit: limit,
            offset: limit * offset
          }));

        case 4:
          _getNotif2 = _context2.sent;
          res.send((0, _toSend.changeSend)(_getNotif2));
          _context2.next = 12;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          throw _context2.t0;

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.NewgetNotif = NewgetNotif;

var seenNotif = function seenNotif(req, res) {
  var _req$query, id, organization_id, _getNotif3, _getNotif4, i, v;

  return regeneratorRuntime.async(function seenNotif$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$query = req.query, id = _req$query.id, organization_id = _req$query.organization_id;

          if (!(id !== undefined)) {
            _context3.next = 8;
            break;
          }

          _context3.next = 5;
          return regeneratorRuntime.awrap(_averageTotalModel["default"].update({
            status: "Seen"
          }, {
            where: {
              transcript_id: id,
              status: _defineProperty({}, _sequelize.Op.not, "Done")
            }
          }));

        case 5:
          _getNotif3 = _context3.sent;
          _context3.next = 19;
          break;

        case 8:
          _context3.next = 10;
          return regeneratorRuntime.awrap(_averageTotalModel["default"].findAll({
            where: {
              status: "Created"
            },
            include: [{
              required: true,
              model: _TranscriptsModel["default"],
              // attributes: ["Agents", "createdAt", "id"],
              include: [{
                model: _AgentsModel["default"]
              }, {
                required: true,
                model: _GroupsModel["default"],
                where: {
                  organization_id: organization_id
                },
                attributes: []
              }]
            }]
          }));

        case 10:
          _getNotif4 = _context3.sent;
          i = 0;

        case 12:
          if (!(i < _getNotif4.length)) {
            _context3.next = 19;
            break;
          }

          v = _getNotif4[i];
          _context3.next = 16;
          return regeneratorRuntime.awrap(_averageTotalModel["default"].update({
            status: "Seen"
          }, {
            where: {
              id: v.id
            }
          }));

        case 16:
          i++;
          _context3.next = 12;
          break;

        case 19:
          res.send((0, _toSend.changeSend)(_getNotif3));
          _context3.next = 26;
          break;

        case 22:
          _context3.prev = 22;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          throw _context3.t0;

        case 26:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

exports.seenNotif = seenNotif;