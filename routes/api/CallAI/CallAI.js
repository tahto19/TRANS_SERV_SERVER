import {
  getIntentAlysisByUserOrByGroupSchema,
  getIntentAlysisSchema,
  intentAnylsisSchema,
} from "./schema/CallAI.schema.js";

// import { intentAnylsisSchema } from "./schema/CallAI.schema.js";
export const CallAI = (app, opts, done) => {
  app.get("/", {
    handler: function () {
      console.log("here");
    },
  });
  app.post("/intentAnylsis", intentAnylsisSchema);
  app.get("/intentAnylsis", getIntentAlysisSchema);
  app.get("/getByUser", getIntentAlysisByUserOrByGroupSchema);
  app.get("/getByGroup", getIntentAlysisByUserOrByGroupSchema);
  done();
};
// intentAnylsisSchema