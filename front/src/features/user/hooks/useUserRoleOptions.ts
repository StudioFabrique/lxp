import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../store/AuthProvider";
import { queries } from "../api/user.api";

export function useUserRoleOptions(requiredRoleRank?: number) {
  const { user } = useContext(AuthContext);
  const actorRank = user?.roles[0]?.rank ?? 4;
  const query = useQuery({
    queryKey: ["permission-roles"],
    queryFn: queries.roles,
  });
  const roles = (query.data?.data ?? []).filter(
    (role) => role.rank > actorRank &&
      (requiredRoleRank === undefined || role.rank === requiredRoleRank),
  );

  return { ...query, roles };
}
