import { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../store/AuthProvider";
import { queries } from "../api/user.api";

export function useUserRoleOptions(requiredRoleRank?: number) {
  const { user } = useContext(AuthContext);
  const actorRank = user?.roles[0]?.rank ?? 4;
  const query = useQuery({
    queryKey: ["permission-roles"],
    queryFn: queries.roles,
    // Les rôles se gèrent dans un autre onglet (« Gérer les rôles ») : rechargement au retour.
    refetchOnWindowFocus: true,
  });
  const roles = useMemo(
    () => (query.data?.data ?? []).filter(
      (role) => role.rank > actorRank &&
        (requiredRoleRank === undefined || role.rank === requiredRoleRank),
    ),
    [actorRank, query.data, requiredRoleRank],
  );

  return { ...query, roles };
}
