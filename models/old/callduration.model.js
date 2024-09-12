import { Model, DataTypes, Sequelize } from "sequelize";
import Connection from "../configDatabase/conn.js";
import Transcripts from "./Transcripts.model.js";
import Agents from "./Agents.model.js";
import Groups from "./Groups.model.js";

class callDuration extends Model {}
callDuration.init(
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
    agent_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: Agents,
        key: "id",
      },
    },
    group_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: Groups,
        key: "id",
      },
    },
    call_duration: {
      type: DataTypes.INTEGER(11),
    },
  },
  {
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "call_duration",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_call_duration",
  }
);
export default callDuration;
