"use strict";

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var oldExecuteRequests =
/*#__PURE__*/
function () {
  function oldExecuteRequests() {
    _classCallCheck(this, oldExecuteRequests);

    this.data = {};
    this.id;
    this.apikey = null;
  }

  _createClass(oldExecuteRequests, [{
    key: "start",
    value: function start(data) {
      return regeneratorRuntime.async(function start$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.getData = data;

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "create",
    value: function create() {
      var r;
      return regeneratorRuntime.async(function create$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              console.log("herer", this.apikey);
              _context2.next = 4;
              return regeneratorRuntime.awrap((0, _axios["default"])({
                method: "POST",
                url: "https://ai-insight.etpbx.com/api-gateway/gateway/start",
                data: this.getData,
                headers: {
                  AuthorizationCode: this.apikey
                }
              }));

            case 4:
              r = _context2.sent;

              if (!(r.data.response === false)) {
                _context2.next = 7;
                break;
              }

              throw new Error("Something wrong 9995");

            case 7:
              if (!(r.data.details === undefined)) {
                _context2.next = 9;
                break;
              }

              return _context2.abrupt("return", null);

            case 9:
              this.id = r.data.details.id;
              return _context2.abrupt("return", r.data.details);

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2["catch"](0);
              throw _context2.t0;

            case 16:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[0, 13]]);
    }
  }, {
    key: "execute",
    value: function execute(id) {
      var getId, r;
      return regeneratorRuntime.async(function execute$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              console.log("execute running");
              getId = id !== undefined ? id : this.id;

              if (!(getId === undefined)) {
                _context3.next = 5;
                break;
              }

              throw "Something went wrong code AI-9999";

            case 5:
              _context3.next = 7;
              return regeneratorRuntime.awrap(_axios["default"].get("".concat(process.env.EXTERNAL_SERVICE_API_ENDPOINT, "/request/mock/execute/") + getId));

            case 7:
              r = _context3.sent;
              console.log("execute done");
              console.log(r.data);

              if (!(r.data.details === undefined)) {
                _context3.next = 14;
                break;
              }

              return _context3.abrupt("return", null);

            case 14:
              if (!(r.data.details.choices === undefined)) {
                _context3.next = 18;
                break;
              }

              return _context3.abrupt("return", r.data.details.text);

            case 18:
              return _context3.abrupt("return", r.data.details.choices[0].message.tool_calls[0]["function"].arguments);

            case 19:
              _context3.next = 25;
              break;

            case 21:
              _context3.prev = 21;
              _context3.t0 = _context3["catch"](0);
              console.log(_context3.t0);
              return _context3.abrupt("return", null);

            case 25:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[0, 21]]);
    }
  }, {
    key: "details",
    value: function details(id) {
      var getId, r;
      return regeneratorRuntime.async(function details$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              console.log("details");
              getId = id !== undefined ? id : this.id;
              console.log(getId);

              if (!(getId === undefined)) {
                _context4.next = 6;
                break;
              }

              throw "Something went wrong code AI-9998";

            case 6:
              _context4.next = 8;
              return regeneratorRuntime.awrap(_axios["default"].get("".concat(process.env.EXTERNAL_SERVICE_API_ENDPOINT, "/request/details/") + getId));

            case 8:
              r = _context4.sent;
              console.log(r.data.details);

              if (!(r.data.details === undefined)) {
                _context4.next = 14;
                break;
              }

              return _context4.abrupt("return", null);

            case 14:
              return _context4.abrupt("return", r.data.details.details.RequestData[3].value_array);

            case 15:
              _context4.next = 21;
              break;

            case 17:
              _context4.prev = 17;
              _context4.t0 = _context4["catch"](0);
              console.log(_context4.t0);
              return _context4.abrupt("return", null);

            case 21:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this, [[0, 17]]);
    }
  }, {
    key: "callback",
    value: function callback() {
      var r;
      return regeneratorRuntime.async(function callback$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return regeneratorRuntime.awrap(_axios["default"].get("".concat(process.env.EXTERNAL_SERVICE_API_ENDPOINT, "/request/mock/callback-url")));

            case 3:
              r = _context5.sent;
              console.log(r.data);

              if (!(r.data.details === undefined)) {
                _context5.next = 9;
                break;
              }

              return _context5.abrupt("return", null);

            case 9:
              return _context5.abrupt("return", r.data.details.details.RequestData[3].value_array);

            case 10:
              _context5.next = 16;
              break;

            case 12:
              _context5.prev = 12;
              _context5.t0 = _context5["catch"](0);
              console.log(_context5.t0);
              return _context5.abrupt("return", null);

            case 16:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 12]]);
    }
  }]);

  return oldExecuteRequests;
}();