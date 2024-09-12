import { Model, DataTypes } from "sequelize";
import Connection from "../configDatabase/conn.js";
// import Transcripts from "./Transcripts.model.js";

class sentimentLists extends Model {}

sentimentLists.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    list: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "SentiLists",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_sentiments_list",
  }
);
export default sentimentLists;
