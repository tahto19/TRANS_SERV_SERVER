"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _conn = _interopRequireDefault(require("../configDatabase/conn.js"));

require("dotenv/config");

var _TranscriptsModel = _interopRequireDefault(require("./Transcripts.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var TranscriptSeperation =
/*#__PURE__*/
function (_Model) {
  _inherits(TranscriptSeperation, _Model);

  function TranscriptSeperation() {
    _classCallCheck(this, TranscriptSeperation);

    return _possibleConstructorReturn(this, _getPrototypeOf(TranscriptSeperation).apply(this, arguments));
  }

  return TranscriptSeperation;
}(_sequelize.Model);

TranscriptSeperation.init({
  id: {
    type: _sequelize.DataTypes.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  content: {
    type: _sequelize.Sequelize.TEXT,
    allowNull: true,
    get: function get() {
      if (this.getDataValue("content") !== undefined) return JSON.parse(this.getDataValue("content"));
    },
    set: function set(val) {
      return this.setDataValue("content", JSON.stringify(val));
    }
  },
  agent: {
    type: _sequelize.Sequelize.TEXT,
    allowNull: true
  },
  agentSegment: {
    type: _sequelize.Sequelize.TEXT,
    allowNull: true,
    get: function get() {
      if (this.getDataValue("agentSegment") !== undefined) return JSON.parse(this.getDataValue("agentSegment"));
    },
    set: function set(val) {
      return this.setDataValue("agentSegment", JSON.stringify(val));
    }
  },
  costumerSegment: {
    type: _sequelize.Sequelize.TEXT,
    allowNull: true,
    get: function get() {
      if (this.getDataValue("costumerSegment") !== undefined) return JSON.parse(this.getDataValue("costumerSegment"));
    },
    set: function set(val) {
      return this.setDataValue("costumerSegment", JSON.stringify(val));
    }
  },
  combineSegment: {
    type: _sequelize.Sequelize.TEXT,
    allowNull: true,
    get: function get() {
      if (this.getDataValue("combineSegment") !== undefined) return JSON.parse(this.getDataValue("combineSegment"));
    },
    set: function set(val) {
      return this.setDataValue("combineSegment", JSON.stringify(val));
    }
  },
  costumer: {
    type: _sequelize.Sequelize.TEXT,
    allowNull: true
  },
  transcript_id: {
    type: _sequelize.DataTypes.INTEGER(11),
    allowNull: false,
    references: {
      model: _TranscriptsModel["default"],
      key: "id"
    }
  },
  createdAt: {
    type: "TIMESTAMP",
    defaultValue: _sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false // defaultValue: parseInt(moment().format("X")),

  },
  updatedAt: {
    type: _sequelize.DataTypes.DATE,
    allowNull: true
  },
  deletedAt: {
    type: _sequelize.DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: false,
  sequelize: _conn["default"].sequelize,
  modelName: "TranscriptsSeperate",
  paranoid: true,
  tableName: process.env.DB_PREFIX + "_transcripts_seperate"
});
var _default = TranscriptSeperation;
exports["default"] = _default;