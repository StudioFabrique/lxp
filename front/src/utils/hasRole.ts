import Role from "./interfaces/role";

export const hasRole = (role: string, userRoles: Array<Role>) => {
  const roleFound = userRoles.find((item) => item.role === role);
  if (roleFound) {
    return true;
  } else {
    return false;
  }
};
