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
import { Organization } from "./routes/api/Organization/Organization.js";
import { Agent } from "./routes/api/Agent/Agent.js";
import { CallAI } from "./routes/api/CallAI/CallAI.js";
const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
  logger: true,
  trustProxy: true,
  disableRequestLogging: false,
  level: "debug",
});
// const { errorCodes } = fastify;
const start = async () => {
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
    // await fastify.register(compress, { threshold: 2048 });
    // await fastify.register(helmet);
    await fastify.register(cors, {});

    // await fastify.register(require("@fastify/jwt"), {
    //   secret: process.env.SECRET,
    // });
    fastify.addHook("preHandler", (req, reply, done) => {
      if (!req.url.includes("callai")) {
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
    fastify.setErrorHandler((err, req, res) => {
      console.log(err, "herer");
      if (err.code === undefined) {
        console.log(err, "123");
      } else
        res
          .status(err.code)
          .send({ result: "error", message: err.message, err });
    });
    fastify.listen(process.env.PORT, (err, address) => {
      console.log(address);
    });
    await Connection.auth();
    await Associations();
    await Connection.sync();
  } catch (err) {
    console.log(err);
    // process.exit(1);
  }
};

start();
