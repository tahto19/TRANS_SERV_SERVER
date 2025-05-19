"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seenNotifSchema = exports.NewgetNotifSchema = exports.getNotifSchema = void 0;

var _type = require("../../Type/type.js");

var _NotifController = require("../Controller/Notif.controller.js");

var getNotifSchema = {
  handler: _NotifController.getNotif,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.getNotifSchema = getNotifSchema;
var NewgetNotifSchema = {
  handler: _NotifController.NewgetNotif // body: {
  //   type: "object",
  //   properties: { id: getInt, offset: getInt, limit: getInt },
  // },

};
exports.NewgetNotifSchema = NewgetNotifSchema;
var seenNotifSchema = {
  handler: _NotifController.seenNotif,
  schema: {
    queryString: {
      id: _type.getInt
    }
  }
};
exports.seenNotifSchema = seenNotifSchema;