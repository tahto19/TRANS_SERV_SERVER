import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";

import Intents from "./Intents.model.js";
import OrgIntentsConf from "./OrgIntentsConf.model.js";

class OrgPiiFilter extends Model {}
OrgPiiFilter.init(
  {
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
    indexes: [{ name: "intent_id_idx", fields: ["intent_id"] }],
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "OrgPiifilter",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_org_pii_filter",
  }
);
export default OrgPiiFilter;
