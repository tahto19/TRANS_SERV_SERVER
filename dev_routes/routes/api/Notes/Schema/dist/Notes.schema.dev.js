"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postNotesSchema = exports.getNotesSchema = void 0;

var _type = require("../../Type/type.js");

var _NotesController = require("../Controller/Notes.controller.js");

var getNotesSchema = {
  handler: _NotesController.getNotes,
  schema: {
    queryString: {
      id: _type.getObject
    }
  }
};
exports.getNotesSchema = getNotesSchema;
var postNotesSchema = {
  handler: _NotesController.postNotes,
  schema: {
    body: {
      id: _type.getInt,
      notes: {
        type: "string"
      }
    }
  }
};
exports.postNotesSchema = postNotesSchema;