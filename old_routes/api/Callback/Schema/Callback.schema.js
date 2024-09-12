import {
  callbackv2,
  postCallBack,
  // getCallBack,
} from "../Controller/Callback.controller.js";

export const postCallBackSchema = { handler: postCallBack };
export const postCallBackv2Schema = { handler: callbackv2 };
// export const getCallBackSchema = { handler: getCallBack };
