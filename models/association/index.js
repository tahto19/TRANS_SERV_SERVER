import GroupServiceConfig from "../GroupServiceConfig.model.js";
import Intents from "../Intents.model.js";

export default async function Associations() {
  GroupServiceConfig.hasMany(Intents, {
    foreignKey: "GroupServicePKey",
    sourceKey: "id",
    constraints: false,
  });
}
