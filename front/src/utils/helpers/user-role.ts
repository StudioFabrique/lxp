import type User from "../interfaces/user";

export type AppArea = "staff" | "student";

export const hasRoleRank = (
  user: Pick<User, "roles"> | null | undefined,
  ranks: readonly number[],
) => user?.roles.some((role) => ranks.includes(role.rank)) ?? false;

export const isTeacherUser = (
  user: Pick<User, "roles"> | null | undefined,
) =>
  user?.roles.length
    ? Math.min(...user.roles.map(({ rank }) => rank), 4) === 2
    : false;

export const getModulesLabel = (
  user: Pick<User, "roles"> | null | undefined,
  defaultLabel = "Modules",
) => (isTeacherUser(user) ? "Mes modules" : defaultLabel);

export const getUserArea = (
  user: Pick<User, "roles"> | null | undefined,
): AppArea | null => {
  if (hasRoleRank(user, [0, 1, 2])) return "staff";
  if (hasRoleRank(user, [3])) return "student";
  return null;
};

export const getUserHomePath = (
  user: Pick<User, "roles"> | null | undefined,
) => {
  const area = getUserArea(user);
  if (area === "staff") return "/admin";
  if (area === "student") return "/student";
  return null;
};
