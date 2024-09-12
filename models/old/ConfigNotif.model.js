import { DataTypes, Model } from "sequelize";
import Connection from "../configDatabase/conn.js";
class ConfigNotif extends Model {}
ConfigNotif.init(
  {
    id: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    high: { type: DataTypes.INTEGER(11), allowNull: false },
    low: { type: DataTypes.INTEGER(11), allowNull: false },
    organization_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    sequelize: Connection.sequelize,
    modelName: "ConfigNotif",
    paranoid: true,
    tableName: process.env.DB_PREFIX + "_config_notif",
  }
);

export default ConfigNotif;
