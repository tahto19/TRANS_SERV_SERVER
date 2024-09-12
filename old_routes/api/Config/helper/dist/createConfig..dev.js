"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addIntent = exports.createConfig = void 0;

var _helpersHere = require("../../../../helper/helpersHere.js");

var _GroupServiceConfigModel = _interopRequireDefault(require("../../../../models/GroupServiceConfig.model.js"));

var _GroupsModel = _interopRequireDefault(require("../../../../models/Groups.model.js"));

var _IntentsModel = _interopRequireDefault(require("../../../../models/Intents.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var createConfig = function createConfig(groupId, organization_id, metricRange, IntentsL) {
  var IntentsLists, saveConfigService, findConfig, config, i, v;
  return regeneratorRuntime.async(function createConfig$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          IntentsLists = [];
          saveConfigService = null;

          if (!(metricRange === null)) {
            _context.next = 17;
            break;
          }

          _context.next = 6;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findOne({
            where: {
              organization_id: organization_id
            },
            include: [{
              required: false,
              model: _IntentsModel["default"],
              attributes: ["id", "intent", "desc", "script", "data"],
              where: {
                active: true
              }
            }]
          }));

        case 6:
          findConfig = _context.sent;
          console.log(findConfig);

          if (!(findConfig.length === 0)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return");

        case 10:
          config = (0, _helpersHere.changeToJson)(findConfig);
          _context.next = 13;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].create({
            metricRange: config.metricRange,
            organization_id: organization_id,
            groupId: groupId
          }));

        case 13:
          saveConfigService = _context.sent;
          IntentsLists = config.Intents;
          _context.next = 21;
          break;

        case 17:
          _context.next = 19;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].create({
            metricRange: metricRange,
            organization_id: organization_id,
            groupId: groupId
          }));

        case 19:
          saveConfigService = _context.sent;
          IntentsLists = IntentsL;

        case 21:
          i = 0;

        case 22:
          if (!(i < IntentsLists.length)) {
            _context.next = 29;
            break;
          }

          v = IntentsLists[i];
          _context.next = 26;
          return regeneratorRuntime.awrap(_IntentsModel["default"].create({
            GroupServicePKey: saveConfigService.id,
            intent: v.intent,
            desc: v.desc,
            script: v.script,
            data: v.data
          }));

        case 26:
          i++;
          _context.next = 22;
          break;

        case 29:
          return _context.abrupt("return", "done");

        case 32:
          _context.prev = 32;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          throw _context.t0;

        case 36:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 32]]);
};

exports.createConfig = createConfig;

var addIntent = function addIntent(organization_id, intentsData) {
  var getGroups, data, desc, intent, script;
  return regeneratorRuntime.async(function addIntent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_GroupsModel["default"].findAll({
            where: {
              organization_id: organization_id
            }
          }));

        case 3:
          getGroups = _context3.sent;
          data = intentsData.data, desc = intentsData.desc, intent = intentsData.intent, script = intentsData.script;
          getGroups.forEach(function _callee(v) {
            var val, getConfig, config;
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    val = (0, _helpersHere.changeToJson)(v);
                    _context2.next = 3;
                    return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findOne({
                      where: {
                        groupId: val.id
                      },
                      include: [{
                        model: _IntentsModel["default"]
                      }]
                    }));

                  case 3:
                    getConfig = _context2.sent;
                    config = (0, _helpersHere.changeToJson)(getConfig);
                    console.log(config);
                    _context2.next = 8;
                    return regeneratorRuntime.awrap(_IntentsModel["default"].create({
                      data: data,
                      desc: desc,
                      intent: intent,
                      script: script,
                      GroupServicePKey: config.id,
                      organization_id: organization_id
                    }));

                  case 8:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          });
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

exports.addIntent = addIntent;