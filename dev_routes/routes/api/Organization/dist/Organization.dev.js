"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Organization = void 0;

var _OrganizationSchema = require("./Schema/Organization.schema.js");

var Organization = function Organization(app, opts, done) {
  try {
    app.get("/", _OrganizationSchema.getOrganizationShema);
    done();
  } catch (err) {
    console.log(err);
  }
};

exports.Organization = Organization;