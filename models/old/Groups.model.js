import { Op, Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";
class Groups extends Model {}

Groups.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
    },
    name: {
      allowNull: true,
      type: DataTypes.STRING(250),
      // validate: {
      //   notNull: {
      //     msg: "Group name is null",
      //   },
      //   customValidator(value) {
      //     if (value === null || value === "") {
      //       throw "Group name is required";
      //     }

      //     if (value.toString().length > 250) {
      //       throw "Group name length is greater than 250";
      //     }
      //   },
      // },
    },
    code: { allowNull: true, type: DataTypes.STRING(250), defaultValue: "" },
    organization_id: { allowNull: false, type: DataTypes.INTEGER },

    group_id: {
      allowNull: true,
      type: DataTypes.INTEGER(11),
      defaultValue: null,
    },
    createdAt: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
      // defaultValue: parseInt(moment().format("X")),
    },
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "Groups",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_groups",
  }
);
export default Groups;
