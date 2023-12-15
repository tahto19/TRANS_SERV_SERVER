import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import Transcripts from "./Transcripts.model.js";

class KpiAnylsis extends Model {}

KpiAnylsis.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    kpi: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    rating: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    anaylsis: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    getWeight: { type: DataTypes.STRING(250), allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    setup_id: { type: DataTypes.INTEGER(11), allowNull: false },
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "KpiAnylsis",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_kpi_anylsis",
  }
);

export default KpiAnylsis;
