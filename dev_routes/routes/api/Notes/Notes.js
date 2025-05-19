import { getNotesSchema, postNotesSchema } from "./Schema/Notes.schema.js";

const Notes = async (app, opts, done) => {
  try {
    app.get("/", getNotesSchema);
    app.post("/", postNotesSchema);
    done();
  } catch (err) {
    console.log(err);
  }
};
export default Notes;
