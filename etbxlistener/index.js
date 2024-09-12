import cron from "node-cron";

import startProc from "./startProc.js";
import "dotenv/config";
let a = 0;
cron.schedule("*/10 * * * * *", () => {
  a++;
  console.log(a);
  try {
    console.log("proccessing");
    startProc();
  } catch (err) {
    console.log(err);
  }
});

startProc();

cron.schedule("*/10 * * * * *", () => {
  a++;
  console.log(a);
  try {
    console.log("proccessing");
    startProc();
  } catch (err) {
    console.log(err);
  }
});
