import Agents from "../Agents.model.js";
import GroupServiceConfig from "../GroupServiceConfig.model.js";
import Groups from "../Groups.model.js";
import Intents from "../Intents.model.js";

export default async function Associations() {
  GroupServiceConfig.hasMany(Intents, {
    foreignKey: "GroupServicePKey",
    sourceKey: "id",
    constraints: false,
  });
  Groups.hasMany(Agents, {
    foreignKey: "agent_group_id",
    sourceKey: "id",
    constraints: false,
  });
}
