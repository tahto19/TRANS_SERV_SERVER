import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import Groups from "./Groups.model.js";
import AgentLists from "./AgentLists.model.js";

class Agents extends Model {}

Agents.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER(11),
    },
    user_conn: {
      allowNull: true,
      type: DataTypes.INTEGER(250),
      references: {
        model: AgentLists,
        key: "id",
      },
    },
    user_id: {
      allowNull: false,
      type: DataTypes.INTEGER(11),
    },
    fullname: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    contact_details: {
      allowNull: true,
      type: DataTypes.STRING(50),
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
    updatedAt: { type: Sequelize.DATE, field: "updated_at" },
    deletedAt: { type: Sequelize.DATE, field: "deleted_at" },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "Agents",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_agents",
    indexes: [
      { name: "user_conn_idx", fields: ["user_conn"] },
      { name: "agent_group_id_idx", fields: ["agent_group_id"] },
    ],
  }
);
export default Agents;
