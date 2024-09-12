import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";

import Intents from "./Intents.model.js";
import Transcripts from "./Transcripts.model.js";

class PiiResult extends Model {}
PiiResult.init(
  {
    transcript_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: Transcripts,
        key: "id",
      },
    },
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    intent_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: Intents,
        key: "id",
      },
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
      get: function () {
        if (this.getDataValue("data") !== undefined)
          return JSON.parse(this.getDataValue("data"));
      },
      set: function (val) {
        return this.setDataValue("data", JSON.stringify(val));
      },
    },
  },
  {
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "piiResult",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_pii_result",
  }
);
export default PiiResult;
