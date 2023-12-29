import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import Transcripts from "./Transcripts.model.js";

class SentimentAnylsis extends Model {}

SentimentAnylsis.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    sentiment_score: { type: DataTypes.INTEGER(11), allowNull: true },
    sentiment_name: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    transcript_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: Transcripts,
        key: "id",
      },
    },
    createdAt: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    setup_id: { type: DataTypes.INTEGER(11), allowNull: false },
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "SentiAnylsis",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_sentiments_result",
  }
);
export default SentimentAnylsis;
