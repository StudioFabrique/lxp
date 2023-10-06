import Role from "../../utils/interfaces/db/role";

export async function postRole(role: string, rank?: number) {
  try {
    const existingRole = await Role.findOne({ role: role });
    if (!!existingRole) {
      const roleCreated = await Role.create({
        role: `${role}_copy`,
        label: role,
        rank: existingRole.rank,
      });

      return roleCreated;
    }

    const roleCreated = await Role.create({
      role,
      label: role,
      rank,
    });

    return roleCreated;
  } catch (error) {
    return null;
  }
}
