"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = require("sequelize");

var _conn = _interopRequireDefault(require("../configDatabase/conn.js"));

var _TranscriptsModel = _interopRequireDefault(require("./Transcripts.model.js"));

var _NotesModel = _interopRequireDefault(require("./Notes.model.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var NotesDetails =
/*#__PURE__*/
function (_Model) {
  _inherits(NotesDetails, _Model);

  function NotesDetails() {
    _classCallCheck(this, NotesDetails);

    return _possibleConstructorReturn(this, _getPrototypeOf(NotesDetails).apply(this, arguments));
  }

  return NotesDetails;
}(_sequelize.Model);

NotesDetails.init({
  id: {
    type: _sequelize.DataTypes.INTEGER(24),
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  notes_id: {
    type: _sequelize.DataTypes.INTEGER(11),
    references: {
      model: _NotesModel["default"],
      key: "id"
    }
  },
  type: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: false
  },
  result: {
    type: _sequelize.DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize: _conn["default"].sequelize,
  modelName: "notesDetails",
  paranoid: true,
  tableName: process.env.DB_PREFIX + "_transcript_notes_details"
});
var _default = NotesDetails;
exports["default"] = _default;