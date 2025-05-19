import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";

class AgentLists extends Model {}

AgentLists.init(
  {
    user_id: {
      allowNull: true,
      type: DataTypes.INTEGER(11),
    },
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER(11),
    },
    fullname: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    contact_details: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    organization_id: {
      allowNull: false,
      type: DataTypes.INTEGER(11),
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
    modelName: "AgentLists",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_agent_lists",
    indexes: [{ name: "fullname_idx", fields: ["fullname"] }],
  }
);
export default AgentLists;
