import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import Transcripts from "./Transcripts.model.js";

class TranscriptSeperation extends Model {}

TranscriptSeperation.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: true,
      get: function () {
        if (this.getDataValue("content") !== undefined)
          return JSON.parse(this.getDataValue("content"));
      },
      set: function (val) {
        return this.setDataValue("content", JSON.stringify(val));
      },
    },
    agent: { type: Sequelize.TEXT, allowNull: true },
    agentSegment: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
      get: function () {
        if (this.getDataValue("agentSegment") !== undefined)
          return JSON.parse(this.getDataValue("agentSegment"));
      },
      set: function (val) {
        return this.setDataValue("agentSegment", JSON.stringify(val));
      },
    },
    costumerSegment: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
      get: function () {
        if (this.getDataValue("costumerSegment") !== undefined)
          return JSON.parse(this.getDataValue("costumerSegment"));
      },
      set: function (val) {
        return this.setDataValue("costumerSegment", JSON.stringify(val));
      },
    },
    combineSegment: {
      type: Sequelize.TEXT("long"),
      allowNull: true,
      get: function () {
        if (this.getDataValue("combineSegment") !== undefined)
          return JSON.parse(this.getDataValue("combineSegment"));
      },
      set: function (val) {
        return this.setDataValue("combineSegment", JSON.stringify(val));
      },
    },
    costumer: { type: Sequelize.TEXT, allowNull: true },
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
    modelName: "TranscriptsSeperate",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_transcripts_seperate",
  }
);
export default TranscriptSeperation;
