import { History } from "lucide-react";
import type { ActivityUser } from "../api/observability.api";

type Props = {
  /** `null` si le compte n'existe plus : il n'y a alors rien à consulter. */
  user: ActivityUser | null;
  onSelectUser: (user: ActivityUser) => void;
};

/** Bouton icône des colonnes « Actions » (même format que la liste d'utilisateurs). */
export default function UserActivityButton({ user, onSelectUser }: Readonly<Props>) {
  if (!user) return null;

  return (
    <button
      type="button"
      className="btn btn-ghost btn-xs btn-square tooltip text-primary"
      data-tip="Voir l'activité"
      aria-label={`Voir l'activité de ${user.name}`}
      onClick={() => onSelectUser(user)}
    >
      <History className="size-4" aria-hidden="true" />
    </button>
  );
}
