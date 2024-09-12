import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import Transcripts from "./Transcripts.model.js";

class averageTotal extends Model {}
averageTotal.init(
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
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    complianceScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: { type: DataTypes.TEXT, allowNull: false, defaultValue: "created" },
    // createdAt: {
    //   type: "TIMESTAMP",
    //   allowNull: false,
    //   defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    // },
  },
  {
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "average_total",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_average_total",
  }
);
export default averageTotal;
