import { Sequelize } from "sequelize";
import "dotenv/config";
const dbConn = async () => {
  return sequelize;
};

export default dbConn;
