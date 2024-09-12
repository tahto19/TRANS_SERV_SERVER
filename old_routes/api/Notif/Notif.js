import { getNotifSchema, seenNotifSchema } from "./Schema/Notif.Schema.js";
const Notif = async (app, opts, done) => {
  try {
    app.get("/", getNotifSchema);
    app.get("/seen", seenNotifSchema);
    done();
  } catch (err) {
    console.log(err);
  }
};
export default Notif;
