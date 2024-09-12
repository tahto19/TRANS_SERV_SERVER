import { Sequelize } from "sequelize";
import logger from "./logger.js";
import "dotenv/config";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_SERVER,

    dialect: process.env.SEQUELIZE_DIALECT,
    logging: false,
  }
);

const auth = async () => {
  try {
    console.log(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS);
    await sequelize.authenticate();
    logger.info("Connection has been established successfully.");
  } catch (error) {
    logger.info("Unable to connect to the database:", error);
  }
};

const sync = async () => {
  await sequelize.sync({ force: false, alter: true });
  logger.info("Sync was successful");
};

export default {
  sequelize,
  sync,
  auth,
};
