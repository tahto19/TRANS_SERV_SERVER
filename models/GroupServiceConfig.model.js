import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import moment from "moment/moment.js";
import Groups from "./Groups.model.js";

class GroupServiceConfig extends Model {}

GroupServiceConfig.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER(11),
    },
    groupId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null,
      references: {
        model: Groups,
        key: "id",
      },
    },
    organization_id: { type: DataTypes.INTEGER(11), allowNull: false },

    // createdAt: {
    //   type: "TIMESTAMP",
    //   defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    //   allowNull: false,
    //   // defaultValue: parseInt(moment().format("X")),
    // },
    metricRange: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    chatgpt_version: { type: DataTypes.TEXT, allowNull: true },
    forDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    /**
     * in milliseconds
     * - 1000 (1 second)
     */
  },
  {
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "GroupServiceConfig",
    paranoid: false,
    tableName: process.env.DB_PREFIX + "_group_service_config",
  }
);

export default GroupServiceConfig;
