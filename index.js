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
    await fastify.register(csrf);
    await fastify.register(cBreaker);
    await fastify.register(compress);
    await fastify.register(helmet);
    await fastify.register(cors, {});

    // await fastify.register(require("@fastify/jwt"), {
    //   secret: process.env.SECRET,
    // });
    fastify.addHook("preHandler", fastify.circuitBreaker());
    fastify.addHook("preHandler", auth);

    fastify.register(configOfSystemFunction, {
      prefix: "/config",
    });

    fastify.setErrorHandler((err, req, res) => {
      res
        .status(err.statusCode)
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
    process.exit(1);
  }
};

start();
