"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.speechTotextFromListener = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var speechTotextFromListener = function speechTotextFromListener(req, res) {
  var _req$body, user_id, queue_id, file, group_id, client_id, account_code, createdAt, getQuery, _getQuery, agent, queueId;

  return regeneratorRuntime.async(function speechTotextFromListener$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, user_id = _req$body.user_id, queue_id = _req$body.queue_id, file = _req$body.file, group_id = _req$body.group_id, client_id = _req$body.client_id, account_code = _req$body.account_code, createdAt = _req$body.createdAt;
          _context.next = 4;
          return regeneratorRuntime.awrap(Queue.findAll({
            where: {
              queue_id: queue_id,
              status: _defineProperty({}, Op.not, "Error")
            }
          }));

        case 4:
          getQuery = _context.sent;

          if (!(getQuery.length > 0)) {
            _context.next = 20;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(Queue.findAll({
            where: {
              queue_id: queue_id,
              user_id: user_id,
              status: _defineProperty({}, Op.not, "Error")
            }
          }));

        case 8:
          _getQuery = _context.sent;

          if (!(_getQuery.length > 0)) {
            _context.next = 13;
            break;
          }

          throw new error("already in the database");

        case 13:
          console.log("adding queue_id agent");
          _context.next = 16;
          return regeneratorRuntime.awrap(saveToDatabase(Queue, {
            user_id: user_id,
            queue_id: queue_id,
            user_group_id: group_id,
            queue_date: createdAt,
            account_code: account_code
          }));

        case 16:
          queueId = _context.sent;
          res.send({
            result: "success"
          });

        case 18:
          _context.next = 26;
          break;

        case 20:
          if (!(user_id !== "")) {
            _context.next = 26;
            break;
          }

          _context.next = 23;
          return regeneratorRuntime.awrap(findAgent(user_id, {
            required: true,
            model: Groups,
            where: {
              id: parseInt(group_id)
            },
            include: {
              model: GroupServiceConfig,
              include: [{
                model: Intents,
                attributes: ["intent", "desc", "data", "script"],
                where: {
                  active: true
                }
              }]
            }
          }));

        case 23:
          agent = _context.sent;

          if (!(agent.length > 0)) {
            _context.next = 26;
            break;
          }

          throw new Error("Agent is not on group:" + group_id);

        case 26:
          _context.next = 32;
          break;

        case 28:
          _context.prev = 28;
          _context.t0 = _context["catch"](0);
          res.send({
            result: "error",
            message: _context.t0.message
          });
          console.log(_context.t0);

        case 32:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 28]]);
};

exports.speechTotextFromListener = speechTotextFromListener;