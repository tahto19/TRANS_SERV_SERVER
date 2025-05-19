import { getInt, getObject } from "../../Type/type.js";
import { getNotes, postNotes } from "../Controller/Notes.controller.js";

export const getNotesSchema = {
  handler: getNotes,
  schema: {
    queryString: {
      id: getObject,
    },
  },
};
export const postNotesSchema = {
  handler: postNotes,
  schema: {
    body: {
      id: getInt,
      notes: { type: "string" },
    },
  },
};
