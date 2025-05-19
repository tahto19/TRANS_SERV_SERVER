"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrganization = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getOrganization = function getOrganization(req, res) {
  var organization_id, r;
  return regeneratorRuntime.async(function getOrganization$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          organization_id = req.query.organization_id;
          _context.next = 4;
          return regeneratorRuntime.awrap(_axios["default"].post(process.env.OUTER_IP_ADDRESS + "/user/get", {
            organization_id: organization_id
          }));

        case 4:
          r = _context.sent;
          console.log(r.data.details);
          res.send({
            result: "success",
            data: r.data.details
          });
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          throw new Error(_context.t0);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getOrganization = getOrganization;