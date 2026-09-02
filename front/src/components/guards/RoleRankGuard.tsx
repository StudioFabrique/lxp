import { type PropsWithChildren, type ReactNode, useContext } from "react";
import { AuthContext } from "../../store/AuthProvider";
import { hasRoleRank } from "../../utils/helpers/user-role";

type Props = {
  ranks: readonly number[];
  fallback?: ReactNode;
};

/** Affichage propre à un type d'utilisateur, sans ajouter de permission RBAC. */
export default function RoleRankGuard({
  children,
  ranks,
  fallback = null,
}: PropsWithChildren<Props>) {
  const { user } = useContext(AuthContext);
  return hasRoleRank(user, ranks) ? <>{children}</> : fallback;
}
