import {
  callbackv2,
  postCallBack,
  callBackForPrompt,

  // getCallBack,
} from "../Controller/Callback.controller.js";

export const postCallBackSchema = { handler: postCallBack };
export const postCallBackv2Schema = { handler: callbackv2 };
export const callBackForPromptSchema = { handler: callBackForPrompt };

// export const getCallBackSchema = { handler: getCallBack };
