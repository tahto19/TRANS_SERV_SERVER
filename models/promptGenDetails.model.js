import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";

import Transcripts from "./Transcripts.model.js";
import Queue from "./Queue.model.js";

class promptGenDetails extends Model {}

promptGenDetails.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER(255),
    },
    results: { type: DataTypes.TEXT, allowNull: true },
    organization_id: { allowNull: false, type: DataTypes.INTEGER(255) },
    code: { allowNull: false, type: DataTypes.TEXT },
    setup_id: { allowNull: false, type: DataTypes.INTEGER(255) },
    status: {
      allowNull: false,
      type: DataTypes.STRING(55),
      defaultValue: "Created",
    },
  },
  {
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "promptGenDetails",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_prompt_gen_details",
  }
);

export default promptGenDetails;
