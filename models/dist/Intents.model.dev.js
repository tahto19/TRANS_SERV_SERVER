"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _conn = _interopRequireDefault(require("../configDatabase/conn.js"));

require("dotenv/config");

var _moment = _interopRequireDefault(require("moment/moment.js"));

var _GroupServiceConfigModel = _interopRequireDefault(require("./GroupServiceConfig.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Intents =
/*#__PURE__*/
function (_Model) {
  _inherits(Intents, _Model);

  function Intents() {
    _classCallCheck(this, Intents);

    return _possibleConstructorReturn(this, _getPrototypeOf(Intents).apply(this, arguments));
  }

  return Intents;
}(_sequelize.Model);

Intents.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: _sequelize.DataTypes.INTEGER(11)
  },
  GroupServicePKey: {
    type: _sequelize.DataTypes.INTEGER(11),
    references: {
      model: _GroupServiceConfigModel["default"],
      key: "id"
    }
  },
  intent: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: false,
    customValidator: function customValidator(value) {
      if (value === "" || value === undefined || value === null) {
        throw "Intent need NAME";
      }
    }
  },
  desc: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: true,
    defaultValue: ""
  },
  script: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: true,
    defaultValue: ""
  },
  data: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: false,
    get: function get() {
      if (this.getDataValue("data") !== undefined) return JSON.parse(this.getDataValue("data"));
    },
    set: function set(val) {
      return this.setDataValue("data", JSON.stringify(val));
    }
  },
  active: {
    type: _sequelize.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  "default": {
    type: _sequelize.DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },

  /**
   * in milliseconds
   * - 1000 (1 second)
   */
  createdAt: {
    type: "TIMESTAMP",
    defaultValue: _sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false // defaultValue: parseInt(moment().format("X")),

  },
  updatedAt: {
    type: _sequelize.Sequelize.DATE,
    field: "updated_at"
  },
  deletedAt: {
    type: _sequelize.Sequelize.DATE,
    field: "deleted_at"
  }
}, {
  timestamps: true,
  sequelize: _conn["default"].sequelize,
  modelName: "Intents",
  paranoid: true,
  tableName: process.env.DB_PREFIX + "_intents"
});
var _default = Intents;
exports["default"] = _default;