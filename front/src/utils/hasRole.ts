import Role from "./interfaces/role";

export const hasRole = (rank: number, userRoles: Array<Role>) => {
  const roleFound = userRoles.find((role) => role.rank === rank);
  if (roleFound) {
    return true;
  } else {
    return false;
  }
};
