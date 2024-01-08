import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import Groups from "./Groups.model.js";
import Transcripts from "./Transcripts.model.js";

class Query extends Model {}

Query.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER(11),
    },
    type: { allowNull: false, type: DataTypes.STRING(11) },
    code: { allowNull: false, type: DataTypes.INTEGER(11) },
    setup_id: { allowNull: false, type: DataTypes.INTEGER(11) },
    status: {
      allowNull: false,
      type: DataTypes.STRING(11),
      defaultValue: "Created",
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
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      // defaultValue: parseInt(moment().format("X")),
    },
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "Query",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_query",
  }
);

export default Query;
