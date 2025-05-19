import "dotenv/config";
import Fastify from "fastify";
import helmet from "@fastify/helmet";
import compress from "@fastify/compress";
import cBreaker from "@fastify/circuit-breaker";
import csrf from "@fastify/csrf-protection";
import Connection from "./configDatabase/conn.js";
import { configOfSystemFunction } from "./routes/api/Config/configOfSystem.js";
import auth from "./auth/auth.js";
import Associations from "./models/association/index.js";
import cors from "@fastify/cors";
import { Group } from "./routes/api/Group/Group.js";
import cron from "node-cron";
import { Organization } from "./routes/api/Organization/Organization.js";
import { Agent } from "./routes/api/Agent/Agent.js";
import { CallAI } from "./routes/api/CallAI/CallAI.js";
import Result from "./routes/api/Result/Result.js";
import fastifyMultipart from "@fastify/multipart";
import Notes from "./routes/api/Notes/Notes.js";
import Callback from "./routes/api/Callback/Callback.js";
import Convert from "./routes/api/Convert/Convert.js";
import Listener from "./routes/api/Listener/Listener.js";
import Notif from "./routes/api/Notif/Notif.js";
import { configNotif } from "./routes/api/ConfigNotif/ConfigNotif.js";
import {
  creatingDefaultNotesDefault,
  creatingDefaultPii,
  creatingSentiment,
} from "./configDatabase/creatingSentimentList.js";

import TranscriptDetails from "./routes/api/TranscriptDetails/TranscriptDetails.js";
import moment from "moment";
import checker from "./checker.js";
import Report from "./routes/api/report/report.js";
// import { deleteData } from "./routes/api/DeleteData/DeleteData.js";
const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
  logger: true,
  trustProxy: true,
  disableRequestLogging: true,
  level: "debug",
});
// const { errorCodes } = fastify;
const start = async () => {
  console.log("hereeeee");
  try {
    // await fastify.register(csrf);
    await fastify.register(cBreaker, {
      threshold: 5, // default 5
      timeout: 5000, // default 10000
      resetTimeout: 5000, // default 10000
      onCircuitOpen: async (req, reply) => {
        throw new Error("Open circuit");
      },
      onTimeout: async (req, reply) => {
        throw new Error("Timeout");
      },
    });
    await fastify.register(fastifyMultipart, {
      limits: {
        fieldNameSize: 100, // Max field name size in bytes
        fieldSize: 100, // Max field value size in bytes
        fields: 10, // Max number of non-file fields
        fileSize: 100000000, // For multipart forms, the max file size in bytes
        files: 1, // Max number of file fields
        headerPairs: 2000, // Max number of header key=>value pairs
        parts: 1000, // For multipart forms, the max number of parts (fields + files)
      },
    });

    // await fastify.register(compress, { threshold: 2048 });
    // await fastify.register(helmet);
    await fastify.register(cors, {});

    // await fastify.register(require("@fastify/jwt"), {
    //   secret: process.env.SECRET,
    // });
    fastify.addHook("preHandler", (req, reply, done) => {
      if (!req.url.includes("callai") || !req.url.includes("getAudio")) {
        fastify.circuitBreaker();
      }
      done();
    });
    fastify.addHook("preHandler", auth);

    fastify.register(configOfSystemFunction, {
      prefix: "/config",
    });
    fastify.register(Group, {
      prefix: "/groups",
    });
    fastify.register(Organization, {
      prefix: "/organization",
    });
    fastify.register(Agent, {
      prefix: "/agent",
    });
    fastify.register(CallAI, {
      prefix: "/callai",
    });
    fastify.register(Result, {
      prefix: "/result",
    });
    fastify.register(Notes, {
      prefix: "/notes",
    });
    fastify.register(Notif, {
      prefix: "/notif",
    });
    fastify.register(Callback, {
      prefix: "/callback",
    });
    fastify.register(Convert, {
      prefix: "/convert",
    });
    fastify.register(configNotif, {
      prefix: "/config-notif",
    });
    fastify.register(TranscriptDetails, {
      prefix: "/transcript-details",
    });
    fastify.register(Listener, {
      prefix: "/listener",
    });
    fastify.register(Report, {
      prefix: "report",
    });
    // fastify.register(deleteData, {
    //   prefix: "/deleteData",
    // });
    fastify.setErrorHandler((err, req, res) => {
      console.log(err);
      if (err.code === undefined) {
        res.status(400).send({ result: "error", message: err.message });
      } else
        res
          .status(err.code)
          .send({ result: "error", message: err.message, err });
    });

    fastify.listen(process.env.PORT, (err, address) => {
      console.log(err, process.env.PORT);
    });
    await Connection.auth();
    await Associations();
    await Connection.sync();
    // await createDefault();
  } catch (err) {
    console.log(err);
    // process.exit(1);
  }
};
cron.schedule("*/10 * * * * *", () => {
  // console.log("Running checker if the system is runnig fine");
  let getDate = moment();
  let getHours = parseInt(getDate.format("H"));
  let getDay = parseInt(getDate.format("d"));
  // console.log(getHours, getDay);
  if (getHours >= 9 && getHours <= 20 && getDay !== 7) {
    // console.log(getDate.format("MM-DD-YYYY"));
    // checker(getDate);
  }
});
start();
