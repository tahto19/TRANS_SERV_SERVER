"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _TranscriptSchema = require("./Schema/Transcript.Schema.js");

var TranscriptDetails = function TranscriptDetails(app, opts, done) {
  try {
    app.get("/getSeperation", _TranscriptSchema.getSeperationSchema);
    done();
  } catch (err) {
    throw err;
  }
};

var _default = TranscriptDetails;
exports["default"] = _default;