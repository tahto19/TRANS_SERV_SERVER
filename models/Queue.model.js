import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import "dotenv/config";

class Queue extends Model {}

Queue.init(
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER(11),
    },
    account_code: { allowNull: true, type: DataTypes.TEXT },

    queue_id: { allowNull: false, type: DataTypes.INTEGER(11) },
    user_id: { allowNull: true, type: DataTypes.INTEGER(11) },
    user_group_id: { allowNull: false, type: DataTypes.INTEGER(11) },
    queue_date: { allowNull: false, type: DataTypes.DATE },
    callerid: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    call_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    call_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    number_dialled: { type: DataTypes.STRING(255), allowNull: true },
    filepath: { allowNull: true, type: DataTypes.TEXT },
    status: {
      allowNull: false,
      type: DataTypes.STRING(11),
      defaultValue: "Created",
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
    modelName: "Queue",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_queue",
  }
);

export default Queue;
