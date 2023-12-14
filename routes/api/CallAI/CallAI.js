import { intentAnylsisSchema } from "./schema/CallAI.schema.js";

// import { intentAnylsisSchema } from "./schema/CallAI.schema.js";
export const CallAI = (app, opts, done) => {
  app.get("/", {
    handler: function () {
      console.log("here");
    },
  });
  app.post("/intentAnylsis", intentAnylsisSchema);
  done();
};
// intentAnylsisSchema
