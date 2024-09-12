"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _NotifSchema = require("./Schema/Notif.Schema.js");

var Notif = function Notif(app, opts, done) {
  return regeneratorRuntime.async(function Notif$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            app.get("/", _NotifSchema.getNotifSchema);
            app.get("/seen", _NotifSchema.seenNotifSchema);
            app.post("/", _NotifSchema.NewgetNotifSchema);
            done();
          } catch (err) {
            console.log(err);
          }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

var _default = Notif;
exports["default"] = _default;