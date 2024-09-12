import { Op, Model, DataTypes, Sequelize, json } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import moment from "moment/moment.js";
import GroupServiceConfig from "./GroupServiceConfig.model.js";

class OrgIntentsConf extends Model {}

OrgIntentsConf.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
    organization_id: {
      type: DataTypes.INTEGER(11),
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
    default: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },

    /**
     * in milliseconds
     * - 1000 (1 second)
     */
  },
  {
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "OrgIntentsConf",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_org_intents_conf",
  }
);

export default OrgIntentsConf;
