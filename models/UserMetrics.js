import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
class UserMetrics extends Model {}
UserMetrics.init({
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: { type: DataTypes.STRING, allowNull: false },
});
