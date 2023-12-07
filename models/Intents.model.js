import { Op, Model, DataTypes, Sequelize, json } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import moment from "moment/moment.js";
import GroupServiceConfig from "./GroupServiceConfig.model.js";

class Intents extends Model {}

Intents.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    GroupServicePKey: {
      type: DataTypes.INTEGER,
      references: {
        model: GroupServiceConfig,
        key: "id",
      },
    },
    intent: {
      type: DataTypes.TEXT,
      allowNull: false,
      customValidator(value) {
        if (value === "" || value === undefined || value === null) {
          throw "Intent need NAME";
        }
      },
    },
    desc: { type: DataTypes.TEXT, allowNull: true, defaultValue: "" },
    script: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    data: {
      type: Sequelize.TEXT,
      allowNull: false,
      get: function () {
        if (this.getDataValue("data") !== undefined)
          return JSON.parse(this.getDataValue("data"));
      },
      set: function (val) {
        return this.setDataValue("data", JSON.stringify(val));
      },
    },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    /**
     * in milliseconds
     * - 1000 (1 second)
     */
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "Intents",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_intents",
  }
);

export default Intents;
