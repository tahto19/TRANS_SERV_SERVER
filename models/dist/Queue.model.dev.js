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

var Queue =
/*#__PURE__*/
function (_Model) {
  _inherits(Queue, _Model);

  function Queue() {
    _classCallCheck(this, Queue);

    return _possibleConstructorReturn(this, _getPrototypeOf(Queue).apply(this, arguments));
  }

  return Queue;
}(_sequelize.Model);

Queue.init({
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: _sequelize.DataTypes.INTEGER(11)
  },
  account_code: {
    allowNull: true,
    type: _sequelize.DataTypes.TEXT
  },
  queue_id: {
    allowNull: false,
    type: _sequelize.DataTypes.INTEGER(11)
  },
  user_id: {
    allowNull: false,
    type: _sequelize.DataTypes.INTEGER(11)
  },
  user_group_id: {
    allowNull: false,
    type: _sequelize.DataTypes.INTEGER(11)
  },
  queue_date: {
    allowNull: false,
    type: _sequelize.DataTypes.DATE
  },
  callerid: {
    type: _sequelize.DataTypes.STRING(11),
    allowNull: true
  },
  call_id: {
    type: _sequelize.DataTypes.STRING(11),
    allowNull: true
  },
  call_type: {
    type: _sequelize.DataTypes.STRING(11),
    allowNull: true
  },
  filepath: {
    allowNull: true,
    type: _sequelize.DataTypes.TEXT
  },
  status: {
    allowNull: false,
    type: _sequelize.DataTypes.STRING(11),
    defaultValue: "Created"
  },
  createdAt: {
    type: "TIMESTAMP",
    defaultValue: _sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false // defaultValue: parseInt(moment().format("X")),

  }
}, {
  timestamps: false,
  sequelize: _conn["default"].sequelize,
  modelName: "Queue",
  paranoid: true,
  tableName: process.env.DB_PREFIX + "_queue"
});
var _default = Queue;
exports["default"] = _default;