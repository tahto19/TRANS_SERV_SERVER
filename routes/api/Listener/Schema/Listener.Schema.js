import {
  getListener,
  reprocessErrorStatus,
  testListener,
} from "../Controller/Listener.Controller.js";

export const getListenerSchema = {
  handler: getListener,
};
export const TestSchema = {
  handler: testListener,
};
export const reprocessErrorStatusSchema = {
  handler: reprocessErrorStatus,
};
