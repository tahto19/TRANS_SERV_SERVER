"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrganizationShema = void 0;

var _type = require("../../Type/type.js");

var _OrganizationController = require("../Controller/Organization.controller.js");

var getOrganizationShema = {
  handler: _OrganizationController.getOrganization,
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          result: _type.getString,
          data: _type.getArray
        }
      }
    }
  }
};
exports.getOrganizationShema = getOrganizationShema;