import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import Transcripts from "./Transcripts.model.js";

class Compliance extends Model {}
Compliance.init(
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
    score: {
      type: DataTypes.STRING(11),
      allowNull: false,
    },
    explaination: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    indexes: [{ name: "transcript_id_idx", fields: ["transcript_id"] }],
    timestamps: false,
    sequelize: Connection.sequelize,
    modelName: "Compliance",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_compliance",
  }
);
export default Compliance;
