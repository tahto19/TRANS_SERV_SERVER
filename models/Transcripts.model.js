import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import Groups from "./Groups.model.js";

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
    },
    createdAt: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      // defaultValue: parseInt(moment().format("X")),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "Transcripts",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_transcripts",
  }
);
export default Transcripts;
