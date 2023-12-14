import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import Groups from "./Groups.model.js";

class Agents extends Model {}

Agents.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER(11),
    },
    fullname: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    contact_details: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    agent_group_id: {
      allowNull: false,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: Groups,
        key: "id",
      },
    },
    createdAt: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      // defaultValue: parseInt(moment().format("X")),
    },
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "Agents",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_agents",
  }
);
export default Agents;
