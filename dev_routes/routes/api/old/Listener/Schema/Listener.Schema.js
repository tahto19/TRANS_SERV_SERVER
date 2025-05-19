import {
  getListener,
  testListener,
} from "../Controller/Listener.Controller.js";

export const getListenerSchema = {
  handler: getListener,
};
export const TestSchema = {
  handler: testListener,
};
