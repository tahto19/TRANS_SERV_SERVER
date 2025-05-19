import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import Groups from "./Groups.model.js";
import Agents from "./Agents.model.js";

class Transcripts extends Model {}

Transcripts.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    group_id: {
      allowNull: false,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: Groups,
        key: "id",
      },
    },
    agent_id: {
      allowNull: false,
      type: DataTypes.INTEGER(11),
      references: {
        model: Agents,
        key: "id",
      },
    },
    queue_date: { allowNull: false, type: DataTypes.DATE },

    createdAt: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      // defaultValue: parseInt(moment().format("X")),
    },
    number_dialled: { type: DataTypes.STRING(255), allowNull: true },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    callerid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    call_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    call_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    indexes: [
      // add a FULLTEXT index
      { type: "FULLTEXT", name: "text_idx", fields: ["content"] },
      { name: "queue_date_idx", fields: ["queue_date"] },
      { name: "agent_id_idx", fields: ["agent_id"] },
      { name: "group_id_idx", fields: ["group_id"] },
    ],
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "Transcripts",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_transcripts",
  }
);
export default Transcripts;
