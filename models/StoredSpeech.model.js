import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import Groups from "./Groups.model.js";
import Transcripts from "./Transcripts.model.js";

class StoredSpeech extends Model {}

StoredSpeech.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    path: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    transcript_id: {
      allowNull: false,
      type: DataTypes.INTEGER(11),
      allowNull: false,
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
    modelName: "StoredSpeech",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_stored_speech",
  }
);
export default StoredSpeech;
