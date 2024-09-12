"use strict";

require("dotenv/config");

var _fastify = _interopRequireDefault(require("fastify"));

var _helmet = _interopRequireDefault(require("@fastify/helmet"));

var _compress = _interopRequireDefault(require("@fastify/compress"));

var _circuitBreaker = _interopRequireDefault(require("@fastify/circuit-breaker"));

var _csrfProtection = _interopRequireDefault(require("@fastify/csrf-protection"));

var _conn = _interopRequireDefault(require("./configDatabase/conn.js"));

var _configOfSystem = require("./routes/api/Config/configOfSystem.js");

var _auth = _interopRequireDefault(require("./auth/auth.js"));

var _index = _interopRequireDefault(require("./models/association/index.js"));

var _cors = _interopRequireDefault(require("@fastify/cors"));

var _Group = require("./routes/api/Group/Group.js");

var _Organization = require("./routes/api/Organization/Organization.js");

var _Agent = require("./routes/api/Agent/Agent.js");

var _CallAI = require("./routes/api/CallAI/CallAI.js");

var _Result = _interopRequireDefault(require("./routes/api/Result/Result.js"));

var _multipart = _interopRequireDefault(require("@fastify/multipart"));

var _Notes = _interopRequireDefault(require("./routes/api/Notes/Notes.js"));

var _Callback = _interopRequireDefault(require("./routes/api/Callback/Callback.js"));

var _Convert = _interopRequireDefault(require("./routes/api/Convert/Convert.js"));

var _Listener = _interopRequireDefault(require("./routes/api/Listener/Listener.js"));

var _Notif = _interopRequireDefault(require("./routes/api/Notif/Notif.js"));

var _ConfigNotif = require("./routes/api/ConfigNotif/ConfigNotif.js");

var _creatingSentimentList = require("./configDatabase/creatingSentimentList.js");

var _TranscriptDetails = _interopRequireDefault(require("./routes/api/TranscriptDetails/TranscriptDetails.js"));

var _Fastify;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fastify = (0, _fastify["default"])((_Fastify = {
  logger: {
    transport: {
      target: "pino-pretty"
    }
  }
}, _defineProperty(_Fastify, "logger", true), _defineProperty(_Fastify, "trustProxy", true), _defineProperty(_Fastify, "disableRequestLogging", true), _defineProperty(_Fastify, "level", "debug"), _Fastify)); // const { errorCodes } = fastify;

var start = function start() {
  return regeneratorRuntime.async(function start$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(fastify.register(_circuitBreaker["default"], {
            threshold: 5,
            // default 5
            timeout: 5000,
            // default 10000
            resetTimeout: 5000,
            // default 10000
            onCircuitOpen: function onCircuitOpen(req, reply) {
              return regeneratorRuntime.async(function onCircuitOpen$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      throw new Error("Open circuit");

                    case 1:
                    case "end":
                      return _context.stop();
                  }
                }
              });
            },
            onTimeout: function onTimeout(req, reply) {
              return regeneratorRuntime.async(function onTimeout$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      throw new Error("Timeout");

                    case 1:
                    case "end":
                      return _context2.stop();
                  }
                }
              });
            }
          }));

        case 3:
          _context3.next = 5;
          return regeneratorRuntime.awrap(fastify.register(_multipart["default"], {
            limits: {
              fieldNameSize: 100,
              // Max field name size in bytes
              fieldSize: 100,
              // Max field value size in bytes
              fields: 10,
              // Max number of non-file fields
              fileSize: 100000000,
              // For multipart forms, the max file size in bytes
              files: 1,
              // Max number of file fields
              headerPairs: 2000,
              // Max number of header key=>value pairs
              parts: 1000 // For multipart forms, the max number of parts (fields + files)

            }
          }));

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(fastify.register(_cors["default"], {}));

        case 7:
          // await fastify.register(require("@fastify/jwt"), {
          //   secret: process.env.SECRET,
          // });
          fastify.addHook("preHandler", function (req, reply, done) {
            if (!req.url.includes("callai") || !req.url.includes("getAudio")) {
              fastify.circuitBreaker();
            }

            done();
          });
          fastify.addHook("preHandler", _auth["default"]);
          fastify.register(_configOfSystem.configOfSystemFunction, {
            prefix: "/config"
          });
          fastify.register(_Group.Group, {
            prefix: "/groups"
          });
          fastify.register(_Organization.Organization, {
            prefix: "/organization"
          });
          fastify.register(_Agent.Agent, {
            prefix: "/agent"
          });
          fastify.register(_CallAI.CallAI, {
            prefix: "/callai"
          });
          fastify.register(_Result["default"], {
            prefix: "/result"
          });
          fastify.register(_Notes["default"], {
            prefix: "/notes"
          });
          fastify.register(_Notif["default"], {
            prefix: "/notif"
          });
          fastify.register(_Callback["default"], {
            prefix: "/callback"
          });
          fastify.register(_Convert["default"], {
            prefix: "/convert"
          });
          fastify.register(_ConfigNotif.configNotif, {
            prefix: "/config-notif"
          });
          fastify.register(_TranscriptDetails["default"], {
            prefix: "/transcript-details"
          });
          fastify.register(_Listener["default"], {
            prefix: "/listener"
          });
          fastify.setErrorHandler(function (err, req, res) {
            console.log(err);

            if (err.code === undefined) {
              res.status(400).send({
                result: "error",
                message: err.message
              });
            } else res.status(err.code).send({
              result: "error",
              message: err.message,
              err: err
            });
          });
          fastify.listen(process.env.PORT, function (err, address) {
            console.log(address);
          });
          _context3.next = 26;
          return regeneratorRuntime.awrap(_conn["default"].auth());

        case 26:
          _context3.next = 28;
          return regeneratorRuntime.awrap((0, _index["default"])());

        case 28:
          _context3.next = 30;
          return regeneratorRuntime.awrap(_conn["default"].sync());

        case 30:
          _context3.next = 32;
          return regeneratorRuntime.awrap(createDefault());

        case 32:
          _context3.next = 37;
          break;

        case 34:
          _context3.prev = 34;
          _context3.t0 = _context3["catch"](0);
          console.log(_context3.t0); // process.exit(1);

        case 37:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 34]]);
};

var listenToetbx = function listenToetbx() {
  console.log("here");
};

listenToetbx();
start();

var createDefault = function createDefault() {
  return regeneratorRuntime.async(function createDefault$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap((0, _creatingSentimentList.creatingSentiment)());

        case 2:
          _context4.next = 4;
          return regeneratorRuntime.awrap((0, _creatingSentimentList.creatingDefaultPii)());

        case 4:
          _context4.next = 6;
          return regeneratorRuntime.awrap((0, _creatingSentimentList.creatingDefaultNotesDefault)());

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
};