import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import Transcripts from "./Transcripts.model.js";

class Notes extends Model {}
Notes.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    transcript_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: Transcripts,
        key: "id",
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
    createdAt: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "notes",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_transcript_notes",
    indexes: [{ name: "transcript_id_idx", fields: ["transcript_id"] }],
  }
);
export default Notes;
