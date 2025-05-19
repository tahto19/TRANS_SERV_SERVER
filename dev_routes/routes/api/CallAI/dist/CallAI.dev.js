"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CallAI = void 0;

var _CallAISchema = require("./schema/CallAI.schema.js");

// import { intentAnylsisSchema } from "./schema/CallAI.schema.js";
var CallAI = function CallAI(app, opts, done) {
  app.get("/", {
    handler: function handler() {
      console.log("here");
    }
  });
  app.post("/intentAnylsis", _CallAISchema.intentAnylsisSchema);
  app.get("/intentAnylsis", _CallAISchema.getIntentAlysisSchema);
  app.post("/speechTotext", _CallAISchema.speechTotextSchema);
  app.post("/speechTotextFromListener", _CallAISchema.speechTotextFromListenerSchema);
  app.post("/fromListener", _CallAISchema.fromListenerSchema);
  app.get("/getByUser", _CallAISchema.getIntentAlysisByUserOrByGroupSchema);
  app.get("/getByGroup", _CallAISchema.getIntentAlysisByUserOrByGroupSchema);
  app.post("/newintentAnylsis", _CallAISchema.newintentAnylsisSchema); // app.post("/callback", newintentAnylsisSchema);

  done();
}; // intentAnylsisSchema


exports.CallAI = CallAI;