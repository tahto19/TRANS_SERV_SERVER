"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _conn = _interopRequireDefault(require("../configDatabase/conn.js"));

require("dotenv/config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AgentLists =
/*#__PURE__*/
function (_Model) {
  _inherits(AgentLists, _Model);

  function AgentLists() {
    _classCallCheck(this, AgentLists);

    return _possibleConstructorReturn(this, _getPrototypeOf(AgentLists).apply(this, arguments));
  }

  return AgentLists;
}(_sequelize.Model);

AgentLists.init({
  user_id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: _sequelize.DataTypes.INTEGER(11)
  },
  fullname: {
    allowNull: false,
    type: _sequelize.DataTypes.STRING(11)
  },
  contact_details: {
    allowNull: false,
    type: _sequelize.DataTypes.STRING(11)
  },
  organization_id: {
    allowNull: false,
    type: _sequelize.DataTypes.INTEGER(11)
  },
  createdAt: {
    type: "TIMESTAMP",
    defaultValue: _sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false // defaultValue: parseInt(moment().format("X")),

  }
}, {
  timestamps: false,
  sequelize: _conn["default"].sequelize,
  modelName: "AgentLists",
  paranoid: true,
  tableName: process.env.DB_PREFIX + "_agent_lists"
});
var _default = AgentLists;
exports["default"] = _default;