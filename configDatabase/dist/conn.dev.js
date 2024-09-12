"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _logger = _interopRequireDefault(require("./logger.js"));

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var sequelize = new _sequelize.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.SEQUELIZE_DIALECT,
  logging: false // logging: (sql) => logger.info(sql),

});

var auth = function auth() {
  return regeneratorRuntime.async(function auth$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(sequelize.authenticate());

        case 3:
          _logger["default"].info("Connection has been established successfully.");

          _context.next = 10;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

          _logger["default"].info("Unable to connect to the database:", _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

var sync = function sync() {
  return regeneratorRuntime.async(function sync$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(sequelize.sync({
            force: false,
            alter: true
          }));

        case 2:
          _logger["default"].info("Sync was successful");

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var _default = {
  sequelize: sequelize,
  sync: sync,
  auth: auth
};
exports["default"] = _default;