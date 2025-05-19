import { Op, Model, DataTypes, Sequelize, json } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";

import Intents from "./Intents.model.js";
import OrgIntentsConf from "./OrgIntentsConf.model.js";

class OrgIntentMetrics extends Model {}

OrgIntentMetrics.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
    intent_id: {
      allowNull: true,
      type: DataTypes.INTEGER(11),
      references: {
        model: OrgIntentsConf,
        key: "id",
      },
    },
    call_quality: {
      type: DataTypes.TEXT,
    },
    metric_desc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cust_sat_weight: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    default: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    /**
     * in milliseconds
     * - 1000 (1 second)
     */
  },
  {
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "OrgIntentMetrics",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_org_intent_metrics",
  }
);

export default OrgIntentMetrics;
