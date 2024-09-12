"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListOfGroupsNotAdded = exports.createGroupV2 = exports.agentJoinGroup = exports.getUsersByGroupIdWithTranscripts = exports.updateGroup = exports.getGroups = exports.getUsersByGroupId = exports.getGroupInfo = exports.createGroup = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _GroupsModel = _interopRequireDefault(require("../../../../models/Groups.model.js"));

var _sequelize = require("sequelize");

var _toSend = require("../../../../helper/toSend.js");

var _AgentsModel = _interopRequireDefault(require("../../../../models/Agents.model.js"));

var _AgentListsModel = _interopRequireDefault(require("../../../../models/AgentLists.model.js"));

var _helpersHere = require("../../../../helper/helpersHere.js");

var _process = require("../../Agent/processAI/process.js");

var _createConfig = require("../../Config/helper/createConfig..js");

var _QueueModel = _interopRequireDefault(require("../../../../models/Queue.model.js"));

var _IntentsModel = _interopRequireDefault(require("../../../../models/Intents.model.js"));

var _GroupServiceConfigModel = _interopRequireDefault(require("../../../../models/GroupServiceConfig.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var createGroup = function createGroup(req, res) {
  var _req$body, name, organization_id, _id, r, error, create;

  return regeneratorRuntime.async(function createGroup$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, name = _req$body.name, organization_id = _req$body.organization_id, _id = _req$body.id;
          _context.next = 4;
          return regeneratorRuntime.awrap(_GroupsModel["default"].findAll({
            where: _defineProperty({}, _sequelize.Op.or, [{
              id: _id
            }])
          }));

        case 4:
          r = _context.sent;

          if (!(r.length !== 0)) {
            _context.next = 9;
            break;
          }

          error = new Error("Already in the System");
          error.statusCode = 400;
          throw error;

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(_GroupsModel["default"].create({
            id: _id,
            name: name,
            organization_id: organization_id
          }));

        case 11:
          create = _context.sent;
          res.send((0, _toSend.changeSend)(create));
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          res.status(200).send({
            result: "error",
            message: _context.t0.message
          });

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.createGroup = createGroup;

var getGroupInfo = function getGroupInfo(req, res) {
  var _id2, r;

  return regeneratorRuntime.async(function getGroupInfo$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _id2 = req.body.id;
          _context2.next = 4;
          return regeneratorRuntime.awrap(_GroupsModel["default"].findByPk(_id2));

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

exports.getGroupInfo = getGroupInfo;

var getUsersByGroupId = function getUsersByGroupId(req, res) {
  var agent_group_id, r;
  return regeneratorRuntime.async(function getUsersByGroupId$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          agent_group_id = req.body.agent_group_id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_GroupsModel["default"].findAll({
            where: {
              id: agent_group_id
            },
            include: [{
              model: _AgentsModel["default"],
              require: false,
              attributes: ["fullname", "contact_details", "id"]
            }]
          }));

        case 4:
          r = _context3.sent;
          res.send((0, _toSend.changeSend)(r));
          _context3.next = 11;
          break;

        case 8:
          _context3.prev = 8;
          _context3.t0 = _context3["catch"](0);
          throw _context3.t0;

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getUsersByGroupId = getUsersByGroupId;

var getGroups = function getGroups(req, res) {
  var organization_id, query, r;
  return regeneratorRuntime.async(function getGroups$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          organization_id = req.query.organization_id;
          query = organization_id === "" ? {} : {
            where: {
              organization_id: organization_id
            }
          };
          _context4.next = 5;
          return regeneratorRuntime.awrap(_GroupsModel["default"].findAll(query));

        case 5:
          r = _context4.sent;
          res.send((0, _toSend.changeSend)(r));
          _context4.next = 12;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          throw _context4.t0;

        case 12:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getGroups = getGroups;

var updateGroup = function updateGroup(req, res) {
  var _req$body2, name, _id3, r, grouC, g_d, g_dj, org, groupC, groupCj, getGroupInQueue;

  return regeneratorRuntime.async(function updateGroup$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _req$body2 = req.body, name = _req$body2.name, _id3 = _req$body2.id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(_GroupsModel["default"].update({
            name: name
          }, {
            where: {
              id: _id3
            }
          }));

        case 4:
          r = _context6.sent;
          _context6.next = 7;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findOne({
            where: {
              groupId: _id3
            }
          }));

        case 7:
          grouC = _context6.sent;

          if (!(grouC === null)) {
            _context6.next = 22;
            break;
          }

          _context6.next = 11;
          return regeneratorRuntime.awrap(_GroupsModel["default"].findOne({
            where: {
              id: _id3
            }
          }));

        case 11:
          g_d = _context6.sent;

          if (!(g_d !== null)) {
            _context6.next = 22;
            break;
          }

          g_dj = (0, _helpersHere.changeToJson)(g_d);
          org = g_dj.organization_id;
          _context6.next = 17;
          return regeneratorRuntime.awrap(_GroupServiceConfigModel["default"].findOne({
            where: {
              organization_id: org,
              active: true
            },
            include: {
              model: _IntentsModel["default"],
              require: true
            }
          }));

        case 17:
          groupC = _context6.sent;

          if (!(groupC !== null)) {
            _context6.next = 22;
            break;
          }

          groupCj = (0, _helpersHere.changeToJson)(groupC);
          _context6.next = 22;
          return regeneratorRuntime.awrap((0, _createConfig.createConfig)(_id3, org, groupCj.metricRange, groupCj.Intents));

        case 22:
          _context6.next = 24;
          return regeneratorRuntime.awrap(_QueueModel["default"].findAll({
            where: {
              user_group_id: _id3
            },
            group: ["user_id"]
          }));

        case 24:
          getGroupInQueue = _context6.sent;
          getGroupInQueue.forEach(function _callee(val) {
            var v, agentGroup, getAgentInfo, getAgentInfoj;
            return regeneratorRuntime.async(function _callee$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    v = (0, _helpersHere.changeToJson)(val); //  check if agenis already in the system

                    _context5.next = 3;
                    return regeneratorRuntime.awrap(_AgentsModel["default"].findOne({
                      where: {
                        user_id: v.user_id,
                        agent_group_id: _id3
                      }
                    }));

                  case 3:
                    agentGroup = _context5.sent;

                    if (!(agentGroup === null)) {
                      _context5.next = 9;
                      break;
                    }

                    _context5.next = 7;
                    return regeneratorRuntime.awrap(_AgentListsModel["default"].findOne({
                      user_id: v.user_id
                    }));

                  case 7:
                    getAgentInfo = _context5.sent;

                    if (getAgentInfo !== null) {
                      getAgentInfoj = (0, _helpersHere.changeToJson)(getAgentInfo);

                      _AgentsModel["default"].create({
                        user_id: user_id,
                        fullname: getAgentInfoj.fullname,
                        contact_details: getAgentInfoj.contact_details,
                        agent_group_id: _id3
                      });
                    }

                  case 9:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          });
          res.send((0, _toSend.changeSend)(r));
          _context6.next = 32;
          break;

        case 29:
          _context6.prev = 29;
          _context6.t0 = _context6["catch"](0);
          throw _context6.t0;

        case 32:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 29]]);
};

exports.updateGroup = updateGroup;

var getUsersByGroupIdWithTranscripts = function getUsersByGroupIdWithTranscripts(req, res) {
  var agent_group_id, queryFind, r;
  return regeneratorRuntime.async(function getUsersByGroupIdWithTranscripts$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          agent_group_id = req.body.agent_group_id;
          queryFind = req.url.includes("getByUser") ? {
            group_id: id
          } : {
            agent_id: id
          };
          _context7.next = 5;
          return regeneratorRuntime.awrap(Transcripts.findAll({
            where: queryFind,
            include: [{
              require: false,
              model: IntentResult,
              attributes: ["main_intent_id", "sub_intent_id", "id"],
              include: [{
                require: false,
                model: IntentDetails,
                attributes: ["intent_name", "desc", "score"],
                as: "main_intent"
              }]
            }, {
              require: false,
              model: KpiAnylsis,
              attributes: ["anaylsis", "kpi", "rating", "getWeight"]
            }, {
              require: false,
              model: SentimentAnylsis,
              attributes: ["sentiment_score", "explanation", "sentiment_name"]
            }]
          }));

        case 5:
          r = _context7.sent;
          res.send((0, _toSend.changeSend)(r));
          _context7.next = 12;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](0);
          throw _context7.t0;

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getUsersByGroupIdWithTranscripts = getUsersByGroupIdWithTranscripts;

var agentJoinGroup = function agentJoinGroup(req, res) {
  var _req$body3, _id4, organization_id, agents, action, name, group_id, getGroup, notIn, i, v, queryOfDeActive, a, changeDone, _createGroup, _i, _v, findAgent, agent;

  return regeneratorRuntime.async(function agentJoinGroup$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _req$body3 = req.body, _id4 = _req$body3.id, organization_id = _req$body3.organization_id, agents = _req$body3.agents, action = _req$body3.action, name = _req$body3.name;
          group_id = _id4;

          if (!(action === "Edit")) {
            _context8.next = 24;
            break;
          }

          _context8.next = 6;
          return regeneratorRuntime.awrap(_GroupsModel["default"].findAll({
            where: {
              id: _id4
            }
          }));

        case 6:
          getGroup = _context8.sent;

          if (!(getGroup.length === 0)) {
            _context8.next = 9;
            break;
          }

          throw new Error("No Group Found");

        case 9:
          if (!(agents !== undefined)) {
            _context8.next = 16;
            break;
          }

          notIn = [];

          for (i = 0; i < agents.length; i++) {
            v = agents[i];
            notIn.push(v.user_id);
          }

          queryOfDeActive = notIn.length === 0 ? {
            agent_group_id: _id4,
            active: true
          } : {
            user_id: _defineProperty({}, _sequelize.Op.notIn, notIn),
            agent_group_id: _id4,
            active: true
          }; // de activate users

          _context8.next = 15;
          return regeneratorRuntime.awrap(_AgentsModel["default"].update({
            active: false
          }, {
            where: queryOfDeActive
          }));

        case 15:
          a = _context8.sent;

        case 16:
          _context8.next = 18;
          return regeneratorRuntime.awrap(_GroupsModel["default"].findAll({
            where: {
              name: name,
              id: _id4
            }
          }));

        case 18:
          changeDone = _context8.sent;

          if (!(changeDone === 0)) {
            _context8.next = 22;
            break;
          }

          _context8.next = 22;
          return regeneratorRuntime.awrap(_GroupsModel["default"].update({
            name: name
          }, {
            where: {
              id: _id4
            }
          }));

        case 22:
          _context8.next = 31;
          break;

        case 24:
          if (!(action === "Add")) {
            _context8.next = 31;
            break;
          }

          _context8.next = 27;
          return regeneratorRuntime.awrap(_GroupsModel["default"].create({
            organization_id: organization_id,
            name: name,
            id: _id4 === "" ? null : _id4
          }));

        case 27:
          _createGroup = _context8.sent;
          group_id = _createGroup.id;
          _context8.next = 31;
          return regeneratorRuntime.awrap((0, _createConfig.createConfig)(_createGroup.id, organization_id, null, null));

        case 31:
          if (!(agents !== undefined)) {
            _context8.next = 55;
            break;
          }

          _i = 0;

        case 33:
          if (!(_i < agents.length)) {
            _context8.next = 55;
            break;
          }

          _v = agents[_i];
          _context8.next = 37;
          return regeneratorRuntime.awrap(_AgentsModel["default"].findOne({
            where: {
              user_id: _v.user_id,
              agent_group_id: group_id
            }
          }));

        case 37:
          findAgent = _context8.sent;
          console.log(findAgent);

          if (!findAgent) {
            _context8.next = 48;
            break;
          }

          agent = (0, _helpersHere.changeToJson)(findAgent);

          if (agent.active) {
            _context8.next = 46;
            break;
          }

          _context8.next = 44;
          return regeneratorRuntime.awrap(_AgentsModel["default"].update({
            active: true
          }, {
            where: {
              user_id: _v.user_id,
              agent_group_id: group_id
            }
          }));

        case 44:
          _context8.next = 46;
          return regeneratorRuntime.awrap((0, _process.generateUserTranscript)(_v.user_id, group_id));

        case 46:
          _context8.next = 52;
          break;

        case 48:
          _context8.next = 50;
          return regeneratorRuntime.awrap(_AgentsModel["default"].create({
            user_id: _v.user_id,
            fullname: _v.fullname,
            agent_group_id: group_id,
            contact_details: _v.contact_details
          }));

        case 50:
          _context8.next = 52;
          return regeneratorRuntime.awrap((0, _process.generateUserTranscript)(_v.user_id, group_id));

        case 52:
          _i++;
          _context8.next = 33;
          break;

        case 55:
          res.send((0, _toSend.changeSend)("a"));
          _context8.next = 62;
          break;

        case 58:
          _context8.prev = 58;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          throw _context8.t0.message;

        case 62:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 58]]);
};

exports.agentJoinGroup = agentJoinGroup;

var createGroupV2 = function createGroupV2(req, res) {
  var _req$body4, name, organization_id, create;

  return regeneratorRuntime.async(function createGroupV2$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _req$body4 = req.body, name = _req$body4.name, organization_id = _req$body4.organization_id; // let r = await Groups.findAll({
          //   where: { [Op.or]: [{ name }] },
          // });
          // if (r.length !== 0) {
          //   let error = new Error("Already in the System");
          //   error.statusCode = 400;
          //   throw error;
          // }

          _context9.next = 4;
          return regeneratorRuntime.awrap(_GroupsModel["default"].create({
            name: name,
            code: code,
            organization_id: organization_id
          }));

        case 4:
          create = _context9.sent;
          _context9.next = 7;
          return regeneratorRuntime.awrap((0, _createConfig.createConfig)(create.id, organization_id, null, null));

        case 7:
          res.send((0, _toSend.changeSend)(create));
          _context9.next = 14;
          break;

        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          throw _context9.t0;

        case 14:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.createGroupV2 = createGroupV2;

var getListOfGroupsNotAdded = function getListOfGroupsNotAdded(req, res) {
  var _req$body5, account_code, organization_id, getID, groups, a;

  return regeneratorRuntime.async(function getListOfGroupsNotAdded$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _req$body5 = req.body, account_code = _req$body5.account_code, organization_id = _req$body5.organization_id;
          _context10.next = 4;
          return regeneratorRuntime.awrap(_QueueModel["default"].findAll({
            where: {
              account_code: account_code
            },
            group: ["user_group_id"],
            attributes: ["user_group_id"]
          }));

        case 4:
          getID = _context10.sent;
          groups = [];
          getID.forEach(function (v) {
            var val = (0, _helpersHere.changeToJson)(v);
            groups.push(val);
          });
          a = _GroupsModel["default"].findAll({
            id: _defineProperty({}, _sequelize.Op.not, groups)
          });
          res.send((0, _toSend.changeSend)(a));
          _context10.next = 15;
          break;

        case 11:
          _context10.prev = 11;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);
          throw _context10.t0;

        case 15:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.getListOfGroupsNotAdded = getListOfGroupsNotAdded;