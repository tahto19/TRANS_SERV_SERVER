import fastifyCircuitBreaker from "@fastify/circuit-breaker";
import fastifyMultipart from "@fastify/multipart";
import Fastify from "fastify";
import cors from "@fastify/cors";
import getQueueInfo from "./routes/getQueueInfo/getQueueInfo.js";
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
const start = async () => {
  await fastify.register(fastifyCircuitBreaker, {
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
  fastify.register(getQueueInfo, { prefix: "/getQueueInfo" });
  fastify.setErrorHandler((err, req, res) => {
    console.log(err);
    if (err.code === undefined) {
      res.status(400).send({ result: "error", message: err.message });
    } else
      res.status(err.code).send({ result: "error", message: err.message, err });
  });
  await fastify.register(cors, {});
  fastify.listen("1236", (err, address) => {
    console.log(err, process.env.PORT);
  });
};
start();
