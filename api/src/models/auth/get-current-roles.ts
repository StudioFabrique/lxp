import Role, { type IRole } from "../../utils/interfaces/db/role.ts";

async function getCurrentRoles(userRole: IRole) {
  return await Role.find({ rank: { $gt: Math.max(userRole.rank, 0) } });
}

export default getCurrentRoles;
