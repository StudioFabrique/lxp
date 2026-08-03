import Role, { type IRole } from "../../utils/interfaces/db/role.ts";

async function getCurrentRoles(userRole: IRole) {
  return await Role.find({ rank: { $gt: userRole.rank - 1 } });
}

export default getCurrentRoles;
