"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _conn = _interopRequireDefault(require("../configDatabase/conn.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// import Transcripts from "./Transcripts.model.js";
var sentimentLists =
/*#__PURE__*/
function (_Model) {
  _inherits(sentimentLists, _Model);

  function sentimentLists() {
    _classCallCheck(this, sentimentLists);

    return _possibleConstructorReturn(this, _getPrototypeOf(sentimentLists).apply(this, arguments));
  }

  return sentimentLists;
}(_sequelize.Model);

sentimentLists.init({
  id: {
    type: _sequelize.DataTypes.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: true
  },
  list: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: false,
  sequelize: _conn["default"].sequelize,
  modelName: "SentiLists",
  paranoid: true,
  tableName: process.env.DB_PREFIX + "_sentiments_list"
});
var _default = sentimentLists;
exports["default"] = _default;