import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import IntentDetails from "./IntentDetails.model.js";
import Transcripts from "./Transcripts.model.js";

class IntentResult extends Model {}

IntentResult.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    main_intent_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: IntentDetails,
        key: "id",
      },
      defaultValue: null,
    },
    sub_intent_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: IntentDetails,
        key: "id",
      },
      defaultValue: null,
    },
    transcript_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: Transcripts,
        key: "id",
      },
    },
    setup_id: { type: DataTypes.INTEGER(11), allowNull: false },
    createdAt: {
      type: "TIMESTAMP",
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      // defaultValue: parseInt(moment().format("X")),
    },
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "IntentResult",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_intent_result",
    indexes: [
      { name: "transcript_id_idx", fields: ["transcript_id"] },
      { name: "main_intent_id_idx", fields: ["main_intent_id"] },
      { name: "sub_intent_id_idx", fields: ["sub_intent_id"] },
    ],
  }
);

export default IntentResult;
