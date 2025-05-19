import { getInt } from "../../Type/type.js";
import {
  NewgetNotif,
  getNotif,
  seenNotif,
} from "../Controller/Notif.controller.js";

export const getNotifSchema = {
  handler: getNotif,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
export const NewgetNotifSchema = {
  handler: NewgetNotif,
  // body: {
  //   type: "object",
  //   properties: { id: getInt, offset: getInt, limit: getInt },
  // },
};

export const seenNotifSchema = {
  handler: seenNotif,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
