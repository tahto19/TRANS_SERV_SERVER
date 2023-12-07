import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
import moment from "moment/moment.js";

class GroupServiceConfig extends Model {}

GroupServiceConfig.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    groupId: {
      type: DataTypes.STRING(250),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name is null",
        },
        customValidator(value) {
          if (value === null) {
            throw "groupId is null";
          }

          if (value.toString().length > 250) {
            throw "groupId length is greater than 250";
          }
        },
      },
    },
    createdAt: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      // defaultValue: parseInt(moment().format("X")),
    },
    metricRange: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },

    /**
     * in milliseconds
     * - 1000 (1 second)
     */
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "GroupServiceConfig",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_group_service_config",
  }
);

export default GroupServiceConfig;
