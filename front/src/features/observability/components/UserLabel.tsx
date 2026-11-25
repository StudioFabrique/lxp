import type { ActivityUser } from "../api/observability.api";

type Props = {
  /** Vrai pour un visiteur non connecté (aucun identifiant dans le journal). */
  anonymous?: boolean;
  /** `null` si le compte n'existe plus. */
  user: ActivityUser | null;
  /** Ligne qui ne vient d'aucune requête (worker, tâche planifiée). */
  system?: boolean;
};

const mutedClassName = "whitespace-nowrap text-sm italic text-base-content/70";

/** Rattache une ligne de journal à une personne, à un visiteur anonyme ou à un compte supprimé. */
export default function UserLabel({ anonymous = false, system = false, user }: Readonly<Props>) {
  if (system) {
    return <span className={mutedClassName}>Système</span>;
  }
  if (anonymous) {
    return <span className={mutedClassName}>Visiteur non connecté</span>;
  }
  if (!user) {
    return <span className={mutedClassName}>Compte supprimé</span>;
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-sm">
      <span className="font-medium capitalize">{user.name}</span>
      {user.role && (
        <span className="badge badge-ghost badge-sm">{user.role}</span>
      )}
    </span>
  );
}
