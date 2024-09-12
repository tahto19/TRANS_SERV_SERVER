import { getInt } from "../../Type/type.js";
import { getNotif, seenNotif } from "../Controller/Notif.controller.js";

export const getNotifSchema = {
  handler: getNotif,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
export const seenNotifSchema = {
  handler: seenNotif,
  schema: {
    queryString: {
      id: getInt,
    },
  },
};
