import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";

import Transcripts from "./Transcripts.model.js";
import Queue from "./Queue.model.js";

class Query extends Model {}

Query.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER(11),
    },
    priority: { allowNull: true, type: DataTypes.BOOLEAN, default: false },
    type: { allowNull: false, type: DataTypes.TEXT },
    code: { allowNull: false, type: DataTypes.TEXT },
    setup_id: { allowNull: false, type: DataTypes.INTEGER(11) },
    status: {
      allowNull: false,
      type: DataTypes.STRING(250),
      defaultValue: "Created",
    },

    queue_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: Queue,
        key: "id",
      },
    },
    transcript_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: Transcripts,
        key: "id",
      },
    },
    createdAt: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      // defaultValue: parseInt(moment().format("X")),
    },
    query: {
      type: DataTypes.STRING(11),
      allowNull: true,
      defaultValue: 1,
    },
    other_details: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "Query",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_query",
    indexes: [
      { name: "queue_id_idx", fields: ["queue_id"] },
      { name: "transcript_id_idx", fields: ["transcript_id"] },
    ],
  }
);

export default Query;
