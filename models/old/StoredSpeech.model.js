import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import Groups from "./Groups.model.js";
import Transcripts from "./Transcripts.model.js";
import Queue from "./Queue.model.js";

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
      allowNull: true,
      defaultValue: null,
      type: DataTypes.INTEGER(11),
      references: {
        model: Transcripts,
        key: "id",
      },
    },
    queueId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: Queue,
        key: "id",
      },
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "StoredSpeech",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_stored_speech",
  }
);
export default StoredSpeech;
