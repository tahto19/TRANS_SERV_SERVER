"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _NotesSchema = require("./Schema/Notes.schema.js");

var Notes = function Notes(app, opts, done) {
  return regeneratorRuntime.async(function Notes$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            app.get("/", _NotesSchema.getNotesSchema);
            app.post("/", _NotesSchema.postNotesSchema);
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

var _default = Notes;
exports["default"] = _default;