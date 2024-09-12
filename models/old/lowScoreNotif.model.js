import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import Transcripts from "./Transcripts.model.js";

class lowScoreNotif extends Model {}
lowScoreNotif.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    transcript_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: Transcripts,
        key: "id",
      },
    },
    compliance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    csat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    csatScore: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    complianceScore: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    status: { type: DataTypes.TEXT, allowNull: false, defaultValue: "created" },
    createdAt: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "Notif",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_lowscore_Notif",
  }
);
export default lowScoreNotif;
