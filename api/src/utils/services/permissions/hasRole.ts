import { IRole } from "../../interfaces/db/role";

export const hasRole = (rank: number, userRoles: Array<IRole>) => {
  const roleFound = userRoles.find((role) => role.rank === rank);
  if (roleFound) {
    return true;
  } else {
    return false;
  }
};
