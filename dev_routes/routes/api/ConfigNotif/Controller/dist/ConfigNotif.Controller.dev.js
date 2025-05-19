"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateConfig = exports.postConfig = exports.getConfig = void 0;

var _toSend = require("../../../../helper/toSend.js");

var _ConfigNotifModel = _interopRequireDefault(require("../../../../models/ConfigNotif.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getConfig = function getConfig(req, res) {
  var organization_id, r;
  return regeneratorRuntime.async(function getConfig$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          organization_id = req.query.organization_id;
          _context.next = 4;
          return regeneratorRuntime.awrap(_ConfigNotifModel["default"].findAll({
            where: {
              organization_id: organization_id
            }
          }));

        case 4:
          r = _context.sent;
          res.send((0, _toSend.changeSend)(r));
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

exports.getConfig = getConfig;

var postConfig = function postConfig(req, res) {
  var _req$body, organization_id, high, low, ifExists, r;

  return regeneratorRuntime.async(function postConfig$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, organization_id = _req$body.organization_id, high = _req$body.high, low = _req$body.low;
          console.log(req.body);
          _context2.next = 5;
          return regeneratorRuntime.awrap(_ConfigNotifModel["default"].findOne({
            where: {
              organization_id: organization_id
            }
          }));

        case 5:
          ifExists = _context2.sent;

          if (!ifExists) {
            _context2.next = 8;
            break;
          }

          throw new Error("Already Exists");

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(_ConfigNotifModel["default"].create({
            organization_id: organization_id,
            high: high,
            low: low
          }));

        case 10:
          r = _context2.sent;
          res.send((0, _toSend.changeSend)(r));
          _context2.next = 18;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          throw _context2.t0;

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

exports.postConfig = postConfig;

var updateConfig = function updateConfig(req, res) {
  var _req$body2, organization_id, low, high, r;

  return regeneratorRuntime.async(function updateConfig$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body2 = req.body, organization_id = _req$body2.organization_id, low = _req$body2.low, high = _req$body2.high;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_ConfigNotifModel["default"].update({
            low: low,
            high: high
          }, {
            where: {
              organization_id: organization_id
            }
          }));

        case 4:
          r = _context3.sent;
          res.send((0, _toSend.changeSend)(r));
          _context3.next = 12;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          throw _context3.t0;

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.updateConfig = updateConfig;