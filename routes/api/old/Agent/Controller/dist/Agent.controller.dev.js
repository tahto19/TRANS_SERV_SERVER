"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateNewAgentList = exports.getNewAgentList = exports.getAgent = exports.getAgentsList = exports.updateNewAgent = exports.addNewAgent = exports.totalAgent = exports.getUserId = exports.autoComplete = exports.getAllAgent = exports.updateAgent = exports.createAgent = exports.getAgentsWithNoGroup = exports.getAgents = void 0;

var _sequelize = require("sequelize");

var _toSend = require("../../../../helper/toSend.js");

var _AgentsModel = _interopRequireDefault(require("../../../../models/Agents.model.js"));

var _GroupsModel = _interopRequireDefault(require("../../../../models/Groups.model.js"));

var _QueueModel = _interopRequireDefault(require("../../../../models/Queue.model.js"));

var _process = require("../processAI/process.js");

var _AgentListsModel = _interopRequireDefault(require("../../../../models/AgentLists.model.js"));

var _axios = _interopRequireDefault(require("axios"));

var _helpersHere = require("../../../../helper/helpersHere.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getAgents = function getAgents(req, res) {
  var id, query, r;
  return regeneratorRuntime.async(function getAgents$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          id = req.query.id;

          if (!(id === undefined)) {
            _context.next = 4;
            break;
          }

          throw new Error("No id");

        case 4:
          query = id === undefined || id === "" ? {} : {
            organization_id: parseInt(id)
          };
          _context.next = 7;
          return regeneratorRuntime.awrap(_AgentListsModel["default"].findAll({
            where: query
          }));

        case 7:
          r = _context.sent;
          res.send((0, _toSend.changeSend)(r));
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

exports.getAgents = getAgents;

var getAgentsWithNoGroup = function getAgentsWithNoGroup(req, res) {
  var _req$query, id, organization_id, query, r;

  return regeneratorRuntime.async(function getAgentsWithNoGroup$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$query = req.query, id = _req$query.id, organization_id = _req$query.organization_id;
          query = organization_id === undefined || organization_id === "" ? {} : {
            organization_id: organization_id
          };
          _context2.next = 5;
          return regeneratorRuntime.awrap(_AgentListsModel["default"].findAll({
            where: query,
            raw: true,
            include: [{
              model: _AgentsModel["default"],
              require: false
            }],
            attributes: ["contact_details", "createdAt", "fullname", "organization_id", "user_id", [_sequelize.Sequelize.col("Agents.active"), "active"], [_sequelize.Sequelize.col("Agents.agent_group_id"), "group_id"]],
            group: ["id"]
          }));

        case 5:
          r = _context2.sent;
          res.send((0, _toSend.changeSend)(r));
          _context2.next = 12;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          throw _context2.t0;

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getAgentsWithNoGroup = getAgentsWithNoGroup;

var createAgent = function createAgent(req, res) {
  var _req$body, fullname, contact_details, agent_group_id, user_id, r, getTotalAgent, sendToClientside;

  return regeneratorRuntime.async(function createAgent$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, fullname = _req$body.fullname, contact_details = _req$body.contact_details, agent_group_id = _req$body.agent_group_id, user_id = _req$body.user_id;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_AgentsModel["default"].create({
            fullname: fullname,
            contact_details: contact_details,
            agent_group_id: agent_group_id,
            user_id: user_id
          }));

        case 4:
          r = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(_AgentsModel["default"].findAll({
            where: {
              agent_group_id: agent_group_id
            },
            include: {
              model: _GroupsModel["default"],
              attributes: []
            },
            attributes: [[_sequelize.Sequelize.fn("COUNT", _sequelize.Sequelize.col("Agents.id")), "counts"], // "orgnazation_id",
            [_sequelize.Sequelize.col("Group.organization_id"), "organization_id"]],
            group: ["Group.organization_id"]
          }));

        case 7:
          getTotalAgent = _context3.sent;
          sendToClientside = (0, _axios["default"])({
            method: "POST",
            url: "".concat(process.env.OUTER_IP_ADDRESS, "/report/client/create/logs"),
            body: getTotalAgent
          });
          res.send((0, _toSend.changeSend)(r));
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0);
          throw _context3.t0;

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

exports.createAgent = createAgent;

var updateAgent = function updateAgent(req, res) {
  var _req$body2, fullname, contact_details, agent_group_id, id, user_id, r;

  return regeneratorRuntime.async(function updateAgent$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body2 = req.body, fullname = _req$body2.fullname, contact_details = _req$body2.contact_details, agent_group_id = _req$body2.agent_group_id, id = _req$body2.id, user_id = _req$body2.user_id;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_AgentsModel["default"].update({
            fullname: fullname,
            contact_details: contact_details,
            agent_group_id: agent_group_id,
            user_id: user_id
          }, {
            where: {
              id: id
            }
          }));

        case 4:
          r = _context4.sent;
          res.send((0, _toSend.changeSend)(r));
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          throw _context4.t0;

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.updateAgent = updateAgent;

var getAllAgent = function getAllAgent(req, res) {
  var id, r;
  return regeneratorRuntime.async(function getAllAgent$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          id = req.query.id;
          _context5.next = 4;
          return regeneratorRuntime.awrap(_AgentsModel["default"].findAll({
            include: [{
              attributes: [],
              model: _GroupsModel["default"],
              require: false,
              where: {
                organization_id: id
              }
            }],
            attributes: ["fullname", "user_id", "id"],
            group: ["fullname"]
          }));

        case 4:
          r = _context5.sent;
          res.send((0, _toSend.changeSend)(r));
          _context5.next = 12;
          break;

        case 8:
          _context5.prev = 8;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);
          throw _context5.t0;

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getAllAgent = getAllAgent;

var autoComplete = function autoComplete(req, res) {
  var user_id, getID;
  return regeneratorRuntime.async(function autoComplete$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          user_id = req.body.user_id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(_AgentListsModel["default"].findOne({
            where: {
              user_id: user_id
            }
          }));

        case 4:
          getID = _context6.sent;
          res.send((0, _toSend.changeSend)(getID));
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

exports.autoComplete = autoComplete;

var getUserId = function getUserId(req, res) {
  var getID;
  return regeneratorRuntime.async(function getUserId$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(_QueueModel["default"].findAll({
            group: ["user_id"],
            attributes: ["user_id"]
          }));

        case 3:
          getID = _context7.sent;
          res.send((0, _toSend.changeSend)(getID));
          _context7.next = 10;
          break;

        case 7:
          _context7.prev = 7;
          _context7.t0 = _context7["catch"](0);
          throw _context7.t0;

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.getUserId = getUserId;

var totalAgent = function totalAgent(req, res) {
  var r;
  return regeneratorRuntime.async(function totalAgent$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(_AgentsModel["default"].findAll({
            include: {
              model: _GroupsModel["default"],
              attributes: []
            },
            attributes: [[_sequelize.Sequelize.col("Agents.agent_group_id"), "group_id"], [_sequelize.Sequelize.fn("COUNT", _sequelize.Sequelize.col("Agents.id")), "counts"], // "orgnazation_id",
            [_sequelize.Sequelize.col("Group.organization_id"), "organization_id"]],
            group: ["agent_group_id", "organization_id"]
          }));

        case 3:
          r = _context8.sent;
          res.send((0, _toSend.changeSend)(r));
          _context8.next = 11;
          break;

        case 7:
          _context8.prev = 7;
          _context8.t0 = _context8["catch"](0);
          console.log(_context8.t0);
          throw _context8.t0;

        case 11:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.totalAgent = totalAgent;

var addNewAgent = function addNewAgent(req, res) {
  var _req$body3, fullname, contact_details, user_id, organization_id, checkAgent, r, getTotalAgent, re;

  return regeneratorRuntime.async(function addNewAgent$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _req$body3 = req.body, fullname = _req$body3.fullname, contact_details = _req$body3.contact_details, user_id = _req$body3.user_id, organization_id = _req$body3.organization_id;
          _context9.next = 4;
          return regeneratorRuntime.awrap(_AgentListsModel["default"].findAll({
            where: {
              user_id: user_id
            }
          }));

        case 4:
          checkAgent = _context9.sent;
          console.log(checkAgent);

          if (!(checkAgent.length !== 0)) {
            _context9.next = 8;
            break;
          }

          throw new Error("UserId is already in the System");

        case 8:
          _context9.next = 10;
          return regeneratorRuntime.awrap(_AgentListsModel["default"].create({
            fullname: fullname,
            contact_details: contact_details,
            user_id: user_id,
            organization_id: organization_id
          }));

        case 10:
          r = _context9.sent;
          _context9.next = 13;
          return regeneratorRuntime.awrap(_AgentListsModel["default"].findAll({
            where: {
              organization_id: organization_id
            },
            attributes: [[_sequelize.Sequelize.fn("COUNT", _sequelize.Sequelize.col("user_id")), "counts"] // "orgnazation_id",
            ],
            group: ["organization_id"]
          }));

        case 13:
          getTotalAgent = _context9.sent;
          _context9.next = 16;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "POST",
            url: "".concat(process.env.OUTER_IP_ADDRESS, "/report/client/create/logs"),
            data: {
              counts: 1,
              organization_id: organization_id
            },
            headers: {
              "Content-Type": "application/json"
            }
          }));

        case 16:
          re = _context9.sent;
          console.log(re.data);
          res.send((0, _toSend.changeSend)({
            r: r,
            data: re.data
          }));
          _context9.next = 25;
          break;

        case 21:
          _context9.prev = 21;
          _context9.t0 = _context9["catch"](0);
          console.log(_context9.t0);
          throw _context9.t0;

        case 25:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

exports.addNewAgent = addNewAgent;

var updateNewAgent = function updateNewAgent(req, res) {
  var _req$body4, fullname, contact_details, user_id, organization_id;

  return regeneratorRuntime.async(function updateNewAgent$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          _req$body4 = req.body, fullname = _req$body4.fullname, contact_details = _req$body4.contact_details, user_id = _req$body4.user_id, organization_id = _req$body4.organization_id;
          _context10.next = 4;
          return regeneratorRuntime.awrap(_AgentListsModel["default"].update({
            fullname: fullname,
            contact_details: contact_details,
            organization_id: organization_id
          }, {
            where: {
              user_id: user_id
            }
          }));

        case 4:
          _context10.next = 6;
          return regeneratorRuntime.awrap(_AgentsModel["default"].update({
            fullname: fullname,
            contact_details: contact_details
          }, {
            where: {
              user_id: user_id
            }
          }));

        case 6:
          _context10.next = 12;
          break;

        case 8:
          _context10.prev = 8;
          _context10.t0 = _context10["catch"](0);
          console.log(_context10.t0);
          throw _context10.t0;

        case 12:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.updateNewAgent = updateNewAgent;

var getAgentsList = function getAgentsList(req, res) {
  var client_id, r;
  return regeneratorRuntime.async(function getAgentsList$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          client_id = req.body.client_id;
          _context11.next = 4;
          return regeneratorRuntime.awrap(_AgentListsModel["default"].findAll({
            where: {
              organization_id: client_id
            }
          }));

        case 4:
          r = _context11.sent;
          res.send((0, _toSend.changeSend)(r));
          _context11.next = 12;
          break;

        case 8:
          _context11.prev = 8;
          _context11.t0 = _context11["catch"](0);
          console.log(_context11.t0);
          throw _context11.t0;

        case 12:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

exports.getAgentsList = getAgentsList;

var getAgent = function getAgent(req, res) {
  var user_id, r;
  return regeneratorRuntime.async(function getAgent$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          user_id = req.body.user_id;
          console.log(user_id);
          _context12.next = 5;
          return regeneratorRuntime.awrap(_AgentListsModel["default"].findAll({
            where: {
              user_id: user_id
            }
          }));

        case 5:
          r = _context12.sent;
          res.send((0, _toSend.changeSend)(r));
          _context12.next = 13;
          break;

        case 9:
          _context12.prev = 9;
          _context12.t0 = _context12["catch"](0);
          console.log(_context12.t0);
          throw _context12.t0;

        case 13:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getAgent = getAgent;

var getNewAgentList = function getNewAgentList(req, res) {
  var _req$body5, account_code, organization_id, getID, AgentList, groupList, _loop, i;

  return regeneratorRuntime.async(function getNewAgentList$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.prev = 0;
          _req$body5 = req.body, account_code = _req$body5.account_code, organization_id = _req$body5.organization_id;
          _context14.next = 4;
          return regeneratorRuntime.awrap(_QueueModel["default"].findAll({
            where: {
              account_code: account_code
            },
            group: ["user_id", "user_group_id"],
            attributes: ["user_id", "user_group_id"]
          }));

        case 4:
          getID = _context14.sent;
          AgentList = [];
          groupList = [];

          _loop = function _loop(i) {
            var val, user_id, findAgentInList, findgroup, getuser_id_info, user;
            return regeneratorRuntime.async(function _loop$(_context13) {
              while (1) {
                switch (_context13.prev = _context13.next) {
                  case 0:
                    val = (0, _helpersHere.changeToJson)(getID[i]);
                    user_id = val.user_id;
                    findAgentInList = -1;
                    if (AgentList.length !== 0) findAgentInList = AgentList.findIndex(function (x) {
                      return parseInt(x.user_id) === parseInt(val.user_id);
                    });
                    findgroup = groupList.findIndex(function (x) {
                      return x === val.user_group_id;
                    });
                    if (findgroup === -1) groupList.push(val.user_group_id);

                    if (!(findAgentInList === -1)) {
                      _context13.next = 16;
                      break;
                    }

                    _context13.next = 9;
                    return regeneratorRuntime.awrap(_AgentListsModel["default"].findOne({
                      where: {
                        user_id: user_id
                      }
                    }));

                  case 9:
                    getuser_id_info = _context13.sent;
                    user = {};
                    if (getuser_id_info !== null) user = (0, _helpersHere.changeToJson)(getuser_id_info);
                    user["Groups"] = [val.user_group_id];
                    AgentList.push({
                      user_id: user_id,
                      user_details: user
                    });
                    _context13.next = 17;
                    break;

                  case 16:
                    AgentList[findAgentInList].user_details.Groups.push(val.user_group_id);

                  case 17:
                  case "end":
                    return _context13.stop();
                }
              }
            });
          };

          i = 0;

        case 9:
          if (!(i < getID.length)) {
            _context14.next = 15;
            break;
          }

          _context14.next = 12;
          return regeneratorRuntime.awrap(_loop(i));

        case 12:
          i++;
          _context14.next = 9;
          break;

        case 15:
          _context14.next = 21;
          break;

        case 17:
          _context14.prev = 17;
          _context14.t0 = _context14["catch"](0);
          console.log(_context14.t0);
          throw _context14.t0;

        case 21:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

exports.getNewAgentList = getNewAgentList;

var updateNewAgentList = function updateNewAgentList(req, res) {
  var _req$body6, fullname, contact_details, user_id, organization_id, account_code, _getID, findAgentInList, re;

  return regeneratorRuntime.async(function updateNewAgentList$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.prev = 0;
          _req$body6 = req.body, fullname = _req$body6.fullname, contact_details = _req$body6.contact_details, user_id = _req$body6.user_id, organization_id = _req$body6.organization_id, account_code = _req$body6.account_code;
          console.log();
          _context15.next = 5;
          return regeneratorRuntime.awrap(_QueueModel["default"].findAll({
            where: {
              account_code: account_code,
              user_id: user_id
            },
            group: ["user_id", "user_group_id"] // attributes: ["user_id"],

          }));

        case 5:
          _getID = _context15.sent;

          if (!(_getID.length === 0)) {
            _context15.next = 8;
            break;
          }

          throw new Error("No User ID Found");

        case 8:
          _context15.next = 10;
          return regeneratorRuntime.awrap(_AgentListsModel["default"].findOne({
            where: {
              user_id: user_id
            }
          }));

        case 10:
          findAgentInList = _context15.sent;

          if (!(findAgentInList === null)) {
            _context15.next = 16;
            break;
          }

          _AgentListsModel["default"].create({
            user_id: user_id,
            fullname: fullname,
            contact_details: contact_details,
            organization_id: organization_id
          });

          _context15.next = 15;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "POST",
            url: "".concat(process.env.OUTER_IP_ADDRESS, "/report/client/create/logs"),
            data: {
              counts: 1,
              organization_id: organization_id
            },
            headers: {
              "Content-Type": "application/json"
            }
          }));

        case 15:
          re = _context15.sent;

        case 16:
          _context15.next = 22;
          break;

        case 18:
          _context15.prev = 18;
          _context15.t0 = _context15["catch"](0);
          console.log(_context15.t0);
          throw _context15.t0;

        case 22:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

exports.updateNewAgentList = updateNewAgentList;