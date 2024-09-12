import { Sequelize } from "sequelize";
import logger from "./logger.js";
import "dotenv/config";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.SEQUELIZE_DIALECT,
    logging: false,
    // logging: (sql) => logger.info(sql),
  }
);

const auth = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connection has been established successfully.");
  } catch (error) {
    console.log(error);
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
