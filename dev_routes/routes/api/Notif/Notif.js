import {
  getNotifSchema,
  seenNotifSchema,
  NewgetNotifSchema,
} from "./Schema/Notif.Schema.js";
const Notif = async (app, opts, done) => {
  try {
    app.get("/", getNotifSchema);

    app.get("/seen", seenNotifSchema);
    app.post("/", NewgetNotifSchema);
    done();
  } catch (err) {
    console.log(err);
  }
};
export default Notif;
