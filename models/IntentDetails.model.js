import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import Intents from "./Intents.model.js";

class IntentDetails extends Model {}

IntentDetails.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    intent_name: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: true,
      // defaultValue: parseInt(moment().format("X")),
    },
    score: { type: DataTypes.FLOAT, allowNull: true },
    conn: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: Intents,
        key: "id",
      },
    },
    createdAt: {
      type: "TIMESTAMP",
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      // defaultValue: parseInt(moment().format("X")),
    },
  },
  {
    indexes: [{ name: "conn_idx", fields: ["conn"] }],
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "IntentDetails",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_intent_details",
  }
);

export default IntentDetails;
