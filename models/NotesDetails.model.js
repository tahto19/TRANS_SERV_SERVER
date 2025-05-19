import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import Transcripts from "./Transcripts.model.js";

import Notes from "./Notes.model.js";

class NotesDetails extends Model {}
NotesDetails.init(
  {
    id: {
      type: DataTypes.INTEGER(24),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    notes_id: {
      type: DataTypes.INTEGER(11),
      references: {
        model: Notes,
        key: "id",
      },
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    result: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        name: "notes_id_idx",
        fields: ["notes_id"],
      },
    ],
    sequelize: Connection.sequelize,
    modelName: "notesDetails",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_transcript_notes_details",
  }
);
export default NotesDetails;
