import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";

class NotesFilterD extends Model {}
NotesFilterD.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    default_prompt: { type: DataTypes.TEXT, allowNull: false },
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
  },
  {
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "NotesFilterD",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_notes_filterD",
  }
);
export default NotesFilterD;
