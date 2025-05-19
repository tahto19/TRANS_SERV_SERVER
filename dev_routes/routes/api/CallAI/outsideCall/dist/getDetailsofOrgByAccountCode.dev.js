"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDetailsofOrgByAccountCode = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _getDetailsofOrg = _interopRequireDefault(require("./getDetailsofOrg.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getDetailsofOrgByAccountCode = function getDetailsofOrgByAccountCode(ac, sequence) {
  var getIDOfOrg, id, org, a, apikey, getAccess, getOrgDetails, getOrgServices;
  return regeneratorRuntime.async(function getDetailsofOrgByAccountCode$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "GET",
            url: "https://ai-insight.etpbx.com/general-info/organization/account/" + ac
          }));

        case 3:
          getIDOfOrg = _context.sent;

          if (getIDOfOrg.data.response) {
            _context.next = 7;
            break;
          }

          console.log(getIDOfOrg.data);
          throw new Error("Something went wrong");

        case 7:
          id = getIDOfOrg.data.details.id;
          org = new _getDetailsofOrg["default"]();
          _context.next = 11;
          return regeneratorRuntime.awrap(org.start(id));

        case 11:
          a = _context.sent;
          apikey = org.getApiByCallback(sequence);

          if (!(apikey === undefined)) {
            _context.next = 15;
            break;
          }

          throw new Error("No API Found");

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(org.getAccess());

        case 17:
          getAccess = _context.sent;
          _context.next = 20;
          return regeneratorRuntime.awrap(org.getOrgDetails());

        case 20:
          getOrgDetails = _context.sent;
          _context.next = 23;
          return regeneratorRuntime.awrap(org.getOrgServices());

        case 23:
          getOrgServices = _context.sent;
          return _context.abrupt("return", {
            apikey: apikey,
            access: getAccess,
            details: getOrgDetails,
            service: getOrgServices
          });

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](0);
          throw {
            error: _context.t0.message
          };

        case 30:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 27]]);
};

exports.getDetailsofOrgByAccountCode = getDetailsofOrgByAccountCode;