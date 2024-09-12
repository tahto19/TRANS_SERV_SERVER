import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";

import Intents from "./Intents.model.js";

class PiiFilterDefault extends Model {}
PiiFilterDefault.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
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
    modelName: "piifilterD",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_pii_filterD",
  }
);
export default PiiFilterDefault;
