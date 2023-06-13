import Role, { IRole } from "../../utils/interfaces/db/role";

async function getRoles(userRole: IRole) {
  return await Role.find({ rank: { $gt: userRole.rank - 1 } });
}

export default getRoles;
