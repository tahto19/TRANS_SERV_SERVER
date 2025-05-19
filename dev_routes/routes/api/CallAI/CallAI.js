import {
  fromListenerSchema,
  getIntentAlysisByUserOrByGroupSchema,
  getIntentAlysisSchema,
  intentAnylsisSchema,
  newintentAnylsisSchema,
  speechTotextFromListenerSchema,
  speechTotextSchema,
  generatePromptSchema,
  getGeneratePromptSchema,
  reRunTranscriptSTTSchema,
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
  app.post("/speechTotext", speechTotextSchema);
  app.post("/speechTotextFromListener", speechTotextFromListenerSchema);
  app.post("/fromListener", fromListenerSchema);
  app.get("/getByUser", getIntentAlysisByUserOrByGroupSchema);
  app.get("/getByGroup", getIntentAlysisByUserOrByGroupSchema);
  app.post("/newintentAnylsis", newintentAnylsisSchema);
  app.post("/generatePromptSchema", generatePromptSchema);
  app.get("/generatePromptSchema", getGeneratePromptSchema);
  app.post("/reRunTranscript", reRunTranscriptSTTSchema);
  // app.post("/callback", newintentAnylsisSchema);
  done();
};
// intentAnylsisSchema
