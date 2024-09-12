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

var NotesFilterD =
/*#__PURE__*/
function (_Model) {
  _inherits(NotesFilterD, _Model);

  function NotesFilterD() {
    _classCallCheck(this, NotesFilterD);

    return _possibleConstructorReturn(this, _getPrototypeOf(NotesFilterD).apply(this, arguments));
  }

  return NotesFilterD;
}(_sequelize.Model);

NotesFilterD.init({
  id: {
    type: _sequelize.DataTypes.INTEGER(11),
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  default_prompt: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: false
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
  }
}, {
  timestamps: true,
  sequelize: _conn["default"].sequelize,
  modelName: "NotesFilterD",
  paranoid: true,
  tableName: process.env.DB_PREFIX + "_notes_filterD"
});
var _default = NotesFilterD;
exports["default"] = _default;