"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var getOrg =
/*#__PURE__*/
function () {
  function getOrg() {
    _classCallCheck(this, getOrg);

    this.bundles;
    this.apiKey;
    this.name;
    this.error = false;
    this.orgDetails;
    this.access;
    this.service;
    this.defaultCallBack = "http://localhost:4118/gateway/mock/callback";
  }

  _createClass(getOrg, [{
    key: "start",
    value: function start(id) {
      var getAccess;
      return regeneratorRuntime.async(function start$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(_axios["default"].get("https://ai-insight.etpbx.com/general-info/organization/complete-details/" + id));

            case 2:
              getAccess = _context.sent;
              if (!getAccess.data.response) this.error = true;
              this.orgDetails = getAccess.data.details;
              return _context.abrupt("return", this.orgDetails);

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getApiByCallback",
    value: function getApiByCallback(data) {
      var _this = this;

      if (this.error) return "error";else if (data !== undefined) {
        this.access = this.orgDetails.ApiKeys[data];
        return this.access.api_key;
      } else {
        this.access = this.orgDetails.ApiKeys.find(function (x) {
          return x.callback_url === _this.defaultCallBack;
        });
      }
    }
  }, {
    key: "getOrgDetails",
    value: function getOrgDetails() {
      if (this.error) return "error";
      return this.orgDetails;
    }
  }, {
    key: "getOrgServices",
    value: function getOrgServices() {
      if (this.error) return "error";
      this.service = this.orgDetails.OrganizationSubscription.Subscription.SubscriptionServices;
      return this.service;
    }
  }, {
    key: "getOrgServices",
    value: function getOrgServices(data) {
      if (this.error) return "error";
      if (this.error) return "error";else if (data !== undefined) {
        this.access = this.orgDetails.ApiKeys.find(function (x) {
          return x.callback_url === data;
        });
        var service_id = this.access.service_id;
        this.service = this.orgDetails.OrganizationSubscription.Subscription.SubscriptionServices.find(function (x) {
          return x.service_id === service_id;
        });
        return this.service;
      } else {
        var _service_id = this.access.service_id;
        this.service = this.orgDetails.OrganizationSubscription.Subscription.SubscriptionServices.find(function (x) {
          return x.service_id === _service_id;
        });
        return this.service;
      }
    }
  }, {
    key: "getOrgServiceBundles",
    value: function getOrgServiceBundles(data) {
      if (this.error) return "error";
      console.log();
      this.bundles = this.service.Service.ServiceBundles;
      return this.service.Service.ServiceBundles;
    }
  }, {
    key: "getAccess",
    value: function getAccess(data) {
      if (this.error) return "error";
      if (data === undefined) return this.access;else {
        this.access = this.orgDetails.ApiKeys.find(function (x) {
          return x.callback_url === data;
        });
        return this.access;
      }
    }
  }, {
    key: "findBundles",
    value: function findBundles(toFind) {
      console.log(toFind);
      return this.bundles.find(function (x) {
        return x.AiModule.name.toLowerCase() === toFind.toLowerCase();
      });
    }
  }]);

  return getOrg;
}();

var _default = getOrg;
exports["default"] = _default;