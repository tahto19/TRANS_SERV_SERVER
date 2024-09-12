import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";

import Intents from "./Intents.model.js";
import OrgIntentsConf from "./OrgIntentsConf.model.js";

class OrgHighConfig extends Model {}
OrgHighConfig.init(
  {
    id: {
      type: DataTypes.INTEGER(255),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    intent_id: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
      references: {
        model: OrgIntentsConf,
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
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "OrgHighConfig",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_org_highlight_config",
  }
);
export default OrgHighConfig;
