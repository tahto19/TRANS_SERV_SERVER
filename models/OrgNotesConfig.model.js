import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";

import OrgIntentsConf from "./OrgIntentsConf.model.js";

class OrgNotesConfig extends Model {}
OrgNotesConfig.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    intent_id: {
      type: DataTypes.INTEGER(11),
      references: {
        model: OrgIntentsConf,
        key: "id",
      },
    },

    initial_prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: false,
    },
    filters: {
      type: DataTypes.TEXT,
      allowNull: true,
      get: function () {
        if (this.getDataValue("filters") !== undefined)
          return JSON.parse(this.getDataValue("filters"));
      },
      set: function (val) {
        return this.setDataValue("filters", JSON.stringify(val));
      },
    },
  },
  {
    indexes: [{ name: "intent_id_idx", fields: ["intent_id"] }],
    sequelize: Connection.sequelize,
    modelName: "OrgNotesConfig",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_org_notes_config",
  }
);
export default OrgNotesConfig;
