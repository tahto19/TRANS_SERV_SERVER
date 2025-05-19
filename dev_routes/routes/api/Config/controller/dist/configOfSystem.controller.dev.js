"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveNotesConfig = exports.getDefaultNotesFilter = exports.updatePiiFilter = exports.getDefaultPii = exports.defaultIntentConfig = exports.addIntentV2 = exports.getOrgConfig = exports.defaultConfig = exports.addConfi = exports.updateDataVersion2 = exports.createDataVersion2 = exports.metricsOnchange = exports.autoCompleteData = exports.updateData = exports.deleteData = exports.createData = exports.getData = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _toSend = require("../../../../helper/toSend.js");

var _GroupServiceConfigModel = _interopRequireDefault(require("../../../../models/GroupServiceConfig.model.js"));

var _IntentsModel = _interopRequireDefault(require("../../../../models/Intents.model.js"));

var _GroupsModel = _interopRequireDefault(require("../../../../models/Groups.model.js"));

var _helpersHere = require("../../../../helper/helpersHere.js");

var _createConfig2 = require("../helper/createConfig..js");

var _PiiFilterDefaultModel = _interopRequireDefault(require("../../../../models/PiiFilterDefault.model.js"));

var _PiiFilterModel = _interopRequireDefault(require("../../../../models/PiiFilter.model.js"));

var _NotesConfigModel = _interopRequireDefault(require("../../../../models/NotesConfig.model.js"));

var _NotesFilterDModel = _interopRequireDefault(require("../../../../models/NotesFilterD.model.js"));

var _Query = require("../../CallAI/helper/Query.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getData = function getData(req, res) {
  var groupId, queryFind, r, toSend;
  return regeneratorRuntime.async(function getData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          groupId = req.query.groupId;
          queryFind = req.url.includes("getByOrg") ? {
            "$Group.organization_id$": groupId
          } : {
            groupId: groupId
          };
          _context.next = 5;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findAll({
            where: queryFind,
            include: [{
              model: _GroupsModel["default"],
              required: false
            }, {
              required: false,
              model: _IntentsModel["default"],
              attributes: ["id", "intent", "desc", "script", "data"],
              where: {
                active: true
              }
            }]
          }));

        case 5:
          r = _context.sent;
          toSend = r; // if (r.length === 0) {
          //   let getGroup = await Groups.findOne({ where: { id: groupId } });
          //   let group = changeToJson(getGroup);
          //   let getDefault = await GroupServiceConfig.findOne({
          //     where: { forDefault: true },
          //     include: [
          //       { model: Groups, required: false },
          //       {
          //         required: false,
          //         model: Intents,
          //         attributes: ["id", "intent", "desc", "script", "data"],
          //         where: { active: true },
          //       },
          //     ],
          //   });
          //   let defaultSettings = changeToJson(getDefault);
          //   console.log(defaultSettings);
          //   let createConfig = await GroupServiceConfig.create({
          //     groupId,
          //     organization_id: group.organization_id,
          //   });
          //   for (let i = 0; i < defaultSettings.Intents.length; i++) {
          //     let v = defaultSettings.Intents[i];
          //     let temp = {
          //       intent: v.intent,
          //       desc: v.desc,
          //       script: v.script,
          //       data: JSON.stringify(v.data),
          //       GroupServicePKey: createConfig.id,
          //     };
          //     await Intents.create(temp);
          //   }
          //   toSend = await GroupServiceConfig.findAll({
          //     where: queryFind,
          //     include: [
          //       { model: Groups, required: false },
          //       {
          //         required: false,
          //         model: Intents,
          //         attributes: ["id", "intent", "desc", "script", "data"],
          //         where: { active: true },
          //       },
          //     ],
          //   });
          // }

          res.send((0, _toSend.changeSend)(r));
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          throw _context.t0;

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getData = getData;

var createData = function createData(req, res) {
  var _req$body, groupId, intent, desc, script, data, findIfExists, createIntent;

  return regeneratorRuntime.async(function createData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, groupId = _req$body.groupId, intent = _req$body.intent, desc = _req$body.desc, script = _req$body.script, data = _req$body.data;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findOne({
            where: {
              groupId: groupId
            }
          }));

        case 4:
          findIfExists = _context2.sent;

          if (!(findIfExists === null)) {
            _context2.next = 7;
            break;
          }

          throw new Error("Something went wrong");

        case 7:
          _context2.next = 9;
          return regeneratorRuntime.awrap(_IntentsModel["default"].create({
            intent: intent,
            desc: desc,
            data: data,
            script: script,
            GroupServicePKey: findIfExists.id
          }));

        case 9:
          createIntent = _context2.sent;
          res.send((0, _toSend.changeSend)({
            createIntent: createIntent
          }));
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.code(406).send(_context2.t0.message);

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.createData = createData;

var deleteData = function deleteData(req, res) {
  var _req$body2, id, data, desc, intent, script, changeActive;

  return regeneratorRuntime.async(function deleteData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body2 = req.body, id = _req$body2.id, data = _req$body2.data, desc = _req$body2.desc, intent = _req$body2.intent, script = _req$body2.script;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_IntentsModel["default"].update({
            active: false
          }, {
            where: {
              id: id
            }
          }));

        case 4:
          changeActive = _context3.sent;
          console.log(changeActive);
          res.send((0, _toSend.changeSend)(changeActive));
          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          res.code(_context3.t0.code).send(_context3.t0.message);

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.deleteData = deleteData;

var updateData = function updateData(req, res) {
  var _req$body3, id, data, desc, intent, script, changeActive;

  return regeneratorRuntime.async(function updateData$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body3 = req.body, id = _req$body3.id, data = _req$body3.data, desc = _req$body3.desc, intent = _req$body3.intent, script = _req$body3.script;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_IntentsModel["default"].update({
            data: data,
            desc: desc,
            intent: intent,
            script: script
          }, {
            where: {
              id: id
            }
          }));

        case 4:
          changeActive = _context4.sent;
          res.send((0, _toSend.changeSend)(changeActive));
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          res.code(_context4.t0.code).send(_context4.t0.message);

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.updateData = updateData;

var autoCompleteData = function autoCompleteData(req, res) {
  var groupId, r, temp;
  return regeneratorRuntime.async(function autoCompleteData$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          groupId = req.query.groupId;
          console.log(groupId);
          _context5.next = 5;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findOne({
            where: {
              groupId: groupId
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

        case 5:
          r = _context5.sent;
          temp = [];
          r.Intents.forEach(function (x) {
            x.data.forEach(function (xx) {
              console.log(xx);
              var find = temp.find(function (xt) {
                console.log(xt, xx, "toFind", xt.call_quality.toUpperCase() === xx.call_quality.toUpperCase() && xt.metric_desc === xx.metric_desc);
                return xt.call_quality.toUpperCase() === xx.call_quality.toUpperCase() && xt.metric_desc.toUpperCase() === xx.metric_desc.toUpperCase() && parseInt(xt.cust_sat_weight) === parseInt(xx.cust_sat_weight);
              });
              if (find === undefined) temp.push(xx);
            });
          });
          res.send((0, _toSend.changeSend)(temp));
          _context5.next = 15;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0.code);
          res.code(400).send(_context5.t0.message);

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.autoCompleteData = autoCompleteData;

var metricsOnchange = function metricsOnchange(req, res) {
  var _req$body4, groupId, metricRange, r;

  return regeneratorRuntime.async(function metricsOnchange$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$body4 = req.body, groupId = _req$body4.groupId, metricRange = _req$body4.metricRange;
          _context6.next = 4;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].update({
            metricRange: metricRange
          }, {
            where: {
              groupId: groupId
            }
          }));

        case 4:
          r = _context6.sent;
          res.send((0, _toSend.changeSend)({
            updated: r,
            groupId: groupId,
            metricRange: metricRange
          }));
          _context6.next = 11;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](0);
          throw _context6.t0;

        case 11:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.metricsOnchange = metricsOnchange;

var createDataVersion2 = function createDataVersion2(req, res) {
  var _req$body5, organization_id, metricRange, _Intents, getIfGroup;

  return regeneratorRuntime.async(function createDataVersion2$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body5 = req.body, organization_id = _req$body5.organization_id, metricRange = _req$body5.metricRange, _Intents = _req$body5.Intents;

          if (!(organization_id === undefined || organization_id === "")) {
            _context8.next = 4;
            break;
          }

          throw new Error("No org id");

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(_GroupsModel["default"].findAll({
            where: {
              organization_id: organization_id
            }
          }));

        case 6:
          getIfGroup = _context8.sent;

          if (!(getIfGroup.length !== 0)) {
            _context8.next = 11;
            break;
          }

          getIfGroup.forEach(function _callee(v) {
            var a;
            return regeneratorRuntime.async(function _callee$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap((0, _createConfig2.createConfig)(v.id, organization_id, metricRange, _Intents));

                  case 2:
                    a = _context7.sent;

                  case 3:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          });
          _context8.next = 13;
          break;

        case 11:
          _context8.next = 13;
          return regeneratorRuntime.awrap((0, _createConfig2.createConfig)(null, organization_id, metricRange, _Intents));

        case 13:
          res.send((0, _toSend.changeSend)(getIfGroup));
          _context8.next = 20;
          break;

        case 16:
          _context8.prev = 16;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          res.code(406).send(_context8.t0.message);

        case 20:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

exports.createDataVersion2 = createDataVersion2;

var updateDataVersion2 = function updateDataVersion2(req, res) {
  var _req$body6, id, data, desc, intent, script, findIntent, intentDe, changeActive;

  return regeneratorRuntime.async(function updateDataVersion2$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _req$body6 = req.body, id = _req$body6.id, data = _req$body6.data, desc = _req$body6.desc, intent = _req$body6.intent, script = _req$body6.script;
          _context9.next = 4;
          return regeneratorRuntime.awrap(_IntentsModel["default"].findOne({
            where: {
              id: id,
              active: true
            },
            include: [{
              model: _GroupServiceConfigModel["default"],
              required: true
            }]
          }));

        case 4:
          findIntent = _context9.sent;

          if (!(findIntent === null)) {
            _context9.next = 7;
            break;
          }

          throw new Error("Cant find");

        case 7:
          intentDe = (0, _helpersHere.changeToJson)(findIntent);
          _context9.next = 10;
          return regeneratorRuntime.awrap(_IntentsModel["default"].update({
            active: false
          }, {
            where: {
              id: id
            }
          }));

        case 10:
          _context9.next = 12;
          return regeneratorRuntime.awrap(_IntentsModel["default"].create({
            data: data,
            desc: desc,
            intent: intent,
            script: script,
            GroupServicePKey: intentDe.GroupServicePKey
          }));

        case 12:
          changeActive = _context9.sent;
          res.send((0, _toSend.changeSend)(changeActive));
          _context9.next = 19;
          break;

        case 16:
          _context9.prev = 16;
          _context9.t0 = _context9["catch"](0);
          throw _context9.t0;

        case 19:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

exports.updateDataVersion2 = updateDataVersion2;

var addConfi = function addConfi(req, res) {
  var getDefault, defaultSettings, _createConfig, i, v, temp, getNewCreated;

  return regeneratorRuntime.async(function addConfi$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _context10.next = 3;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findOne({
            where: {
              forDefault: true
            },
            include: [{
              model: _GroupsModel["default"],
              required: false
            }, {
              required: false,
              model: _IntentsModel["default"],
              attributes: ["id", "intent", "desc", "script", "data"],
              where: {
                active: true
              }
            }]
          }));

        case 3:
          getDefault = _context10.sent;
          defaultSettings = (0, _helpersHere.changeToJson)(getDefault);
          _context10.next = 7;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].create({
            organization_id: group.organization_id
          }));

        case 7:
          _createConfig = _context10.sent;
          i = 0;

        case 9:
          if (!(i < defaultSettings.Intents.length)) {
            _context10.next = 17;
            break;
          }

          v = defaultSettings.Intents[i];
          temp = {
            intent: v.intent,
            desc: v.desc,
            script: v.script,
            data: JSON.stringify(v.data),
            GroupServicePKey: _createConfig.id
          };
          _context10.next = 14;
          return regeneratorRuntime.awrap(_IntentsModel["default"].create(temp));

        case 14:
          i++;
          _context10.next = 9;
          break;

        case 17:
          _context10.next = 19;
          return regeneratorRuntime.awrap(_createConfig.findOne({
            where: {
              organization_id: group.organization_id
            }
          }));

        case 19:
          getNewCreated = _context10.sent;
          res.send({
            getNewCreated: getNewCreated
          });
          _context10.next = 27;
          break;

        case 23:
          _context10.prev = 23;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);
          throw _context10.t0;

        case 27:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

exports.addConfi = addConfi;

var defaultConfig = function defaultConfig(req, res) {
  var getDefault;
  return regeneratorRuntime.async(function defaultConfig$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findOne({
            where: {
              forDefault: true
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

        case 3:
          getDefault = _context11.sent;
          res.send((0, _toSend.changeSend)(getDefault));
          _context11.next = 11;
          break;

        case 7:
          _context11.prev = 7;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0);
          throw _context11.t0;

        case 11:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.defaultConfig = defaultConfig;

var getOrgConfig = function getOrgConfig(req, res) {
  var organization_id, r;
  return regeneratorRuntime.async(function getOrgConfig$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          organization_id = req.query.organization_id;
          _context12.next = 4;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findOne({
            where: {
              organization_id: organization_id
            },
            include: [{
              required: false,
              model: _IntentsModel["default"],
              // attributes: ["id", "intent", "desc", "script", "data", "default"],
              where: {
                active: true
              }
            }, {
              required: false,
              model: _NotesConfigModel["default"]
            }]
          }));

        case 4:
          r = _context12.sent;
          res.send((0, _toSend.changeSend)(r));
          _context12.next = 12;
          break;

        case 8:
          _context12.prev = 8;
          _context12.t0 = _context12["catch"](0);
          console.log(_context12.t0);
          throw _context12.t0;

        case 12:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getOrgConfig = getOrgConfig;

var addIntentV2 = function addIntentV2(req, res) {
  var _req$body7, config_id, data, desc, intent, script, organization_id, changeActive;

  return regeneratorRuntime.async(function addIntentV2$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          _req$body7 = req.body, config_id = _req$body7.config_id, data = _req$body7.data, desc = _req$body7.desc, intent = _req$body7.intent, script = _req$body7.script, organization_id = _req$body7.organization_id; // Intents.forEach(async (v) => {
          //   if (v.action.toLowerCase() === "add") await addIntent(organization_id, v);
          //   else {
          //   }
          // });

          _context13.next = 4;
          return regeneratorRuntime.awrap(_IntentsModel["default"].create({
            data: data,
            desc: desc,
            intent: intent,
            script: script,
            GroupServicePKey: config_id
          }));

        case 4:
          changeActive = _context13.sent;
          res.send((0, _toSend.changeSend)(changeActive));
          _context13.next = 11;
          break;

        case 8:
          _context13.prev = 8;
          _context13.t0 = _context13["catch"](0);
          throw _context13.t0;

        case 11:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.addIntentV2 = addIntentV2;

var defaultIntentConfig = function defaultIntentConfig(req, res) {
  var _req$body8, id, intent, getListOfGroups, getIntentname, c_intentName, i, v, _i, v_i;

  return regeneratorRuntime.async(function defaultIntentConfig$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _req$body8 = req.body, id = _req$body8.id, intent = _req$body8.intent;
          _context14.next = 4;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findAll({
            where: {
              organization_id: id
            },
            include: [{
              model: _IntentsModel["default"],
              where: {
                active: true
              }
            }]
          }));

        case 4:
          getListOfGroups = _context14.sent;
          _context14.next = 7;
          return regeneratorRuntime.awrap(_IntentsModel["default"].findOne({
            where: {
              id: intent,
              active: true
            }
          }));

        case 7:
          getIntentname = _context14.sent;

          if (!(getIntentname === null)) {
            _context14.next = 10;
            break;
          }

          throw new Error("Error not found intent");

        case 10:
          c_intentName = (0, _helpersHere.changeToJson)(getIntentname).intent;
          i = 0;

        case 12:
          if (!(i < getListOfGroups.length)) {
            _context14.next = 29;
            break;
          }

          v = (0, _helpersHere.changeToJson)(getListOfGroups[i]);
          _i = 0;

        case 15:
          if (!(_i < v.Intents.length)) {
            _context14.next = 26;
            break;
          }

          v_i = v.Intents[_i];

          if (!(v_i.intent === c_intentName)) {
            _context14.next = 20;
            break;
          }

          _context14.next = 20;
          return regeneratorRuntime.awrap(_IntentsModel["default"].update({
            "default": true
          }, {
            where: {
              id: v_i.id
            }
          }));

        case 20:
          if (!v_i["default"]) {
            _context14.next = 23;
            break;
          }

          _context14.next = 23;
          return regeneratorRuntime.awrap(_IntentsModel["default"].update({
            "default": false
          }, {
            where: {
              id: v_i.id
            }
          }));

        case 23:
          _i++;
          _context14.next = 15;
          break;

        case 26:
          i++;
          _context14.next = 12;
          break;

        case 29:
          res.send((0, _toSend.changeSend)({
            message: "successfully change default"
          }));
          _context14.next = 36;
          break;

        case 32:
          _context14.prev = 32;
          _context14.t0 = _context14["catch"](0);
          console.log(_context14.t0);
          throw _context14.t0;

        case 36:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 32]]);
};

exports.defaultIntentConfig = defaultIntentConfig;

var getDefaultPii = function getDefaultPii(req, res) {
  var a;
  return regeneratorRuntime.async(function getDefaultPii$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _context15.next = 3;
          return regeneratorRuntime.awrap(_PiiFilterDefaultModel["default"].findOne({}));

        case 3:
          a = _context15.sent;
          res.send((0, _toSend.changeSend)(a));
          _context15.next = 11;
          break;

        case 7:
          _context15.prev = 7;
          _context15.t0 = _context15["catch"](0);
          console.log(_context15.t0);
          throw _context15.t0;

        case 11:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getDefaultPii = getDefaultPii;

var updatePiiFilter = function updatePiiFilter(req, res) {
  var _req$body9, intent_id, data, organization_id, a, action;

  return regeneratorRuntime.async(function updatePiiFilter$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          _req$body9 = req.body, intent_id = _req$body9.intent_id, data = _req$body9.data, organization_id = _req$body9.organization_id; // let a = await PiiFilter.findAll({ intent_id });

          _context16.next = 4;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findAll({
            where: {
              organization_id: organization_id
            },
            include: [{
              model: _IntentsModel["default"],
              where: {
                active: true
              },
              include: {
                model: _PiiFilterModel["default"]
              }
            }]
          }));

        case 4:
          a = _context16.sent;
          action = ""; // if (a === null) {
          //   let a = await PiiFilter.create({ intent_id, data });
          //   action = "Created";
          // } else {
          //   await PiiFilter.update({ data }, { where: { intent_id } });
          //   action = "Updated";
          // }

          res.send((0, _toSend.changeSend)({
            message: a
          }));
          _context16.next = 13;
          break;

        case 9:
          _context16.prev = 9;
          _context16.t0 = _context16["catch"](0);
          console.log(_context16.t0);
          throw _context16.t0;

        case 13:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.updatePiiFilter = updatePiiFilter;

var getDefaultNotesFilter = function getDefaultNotesFilter(req, res) {
  var a;
  return regeneratorRuntime.async(function getDefaultNotesFilter$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.prev = 0;
          _context17.next = 3;
          return regeneratorRuntime.awrap(_NotesFilterDModel["default"].findOne({}));

        case 3:
          a = _context17.sent;
          res.send((0, _toSend.changeSend)(a));
          _context17.next = 10;
          break;

        case 7:
          _context17.prev = 7;
          _context17.t0 = _context17["catch"](0);
          throw _context17.t0;

        case 10:
        case "end":
          return _context17.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getDefaultNotesFilter = getDefaultNotesFilter;

var saveNotesConfig = function saveNotesConfig(req, res) {
  var _req$body10, organization_id, intial_prompt, filters, action, getAllGroups, i, v;

  return regeneratorRuntime.async(function saveNotesConfig$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.prev = 0;
          _req$body10 = req.body, organization_id = _req$body10.organization_id, intial_prompt = _req$body10.intial_prompt, filters = _req$body10.filters;
          action = "";
          _context18.next = 5;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findAll({
            where: {
              organization_id: organization_id
            },
            include: [{
              model: _NotesConfigModel["default"],
              required: false
            }]
          }));

        case 5:
          getAllGroups = _context18.sent;
          i = 0;

        case 7:
          if (!(i < getAllGroups.length)) {
            _context18.next = 20;
            break;
          }

          v = (0, _helpersHere.changeToJson)(getAllGroups[i]);
          action = !v.notesConfig ? "Added" : "Updated"; // action += !v.notesConfig
          //   ? "Added" + `${i !== getAllGroups.length - 1 ? "," : ""}`
          //   : "Updated" + `${i !== getAllGroups.length - 1 ? "," : ""}`;

          if (v.notesConfig) {
            _context18.next = 15;
            break;
          }

          _context18.next = 13;
          return regeneratorRuntime.awrap(_NotesConfigModel["default"].create({
            GroupServicePKey: v.id,
            initial_prompt: initial_prompt,
            filters: filters
          }));

        case 13:
          _context18.next = 17;
          break;

        case 15:
          _context18.next = 17;
          return regeneratorRuntime.awrap(_NotesConfigModel["default"].update({
            initial_prompt: initial_prompt,
            filters: filters
          }, {
            where: {
              GroupServicePKey: v.id
            }
          }));

        case 17:
          i++;
          _context18.next = 7;
          break;

        case 20:
          res.send((0, _toSend.changeSend)({
            message: "Successfully " + action
          }));
          _context18.next = 27;
          break;

        case 23:
          _context18.prev = 23;
          _context18.t0 = _context18["catch"](0);
          console.log(_context18.t0);
          throw _context18.t0;

        case 27:
        case "end":
          return _context18.stop();
      }
    }
  }, null, null, [[0, 23]]);
};

exports.saveNotesConfig = saveNotesConfig;