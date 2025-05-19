import { deleteDataSchema } from "./Schema/DeletaData.schema.js";

export const deleteData = (app, opts, done) => {
  app.post("/", deleteDataSchema);
  done();
};
