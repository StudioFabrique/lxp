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
    // Tri explicite : l'ordre renvoyé par l'API n'est pas garanti d'un chargement à l'autre.
    () => (query.data?.data ?? []).filter(
      (role) => role.rank > actorRank &&
        (requiredRoleRank === undefined || role.rank === requiredRoleRank),
    ).sort((a, b) => a.rank - b.rank || a.label.localeCompare(b.label, "fr")),
    [actorRank, query.data, requiredRoleRank],
  );

  return { ...query, roles };
}
