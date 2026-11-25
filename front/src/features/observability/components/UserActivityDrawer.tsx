import { useQuery } from "@tanstack/react-query";
import RightSideDrawer from "../../../components/UI/right-side-drawer/right-side-drawer";
import LoadingSkeleton from "../../../components/loaders/LoadingSkeleton";
import { toTitleCase } from "../../../utils/helpers/text-helpers";
import {
  observabilityApi,
  type ActivityUser,
} from "../api/observability.api";
import { observabilityKeys } from "../api/observability.keys";
import type { ActivityRange } from "../helpers/activity-range";
import { groupActionsByDay } from "../helpers/group-actions-by-day";
import UserActivityRow from "./UserActivityRow";
import UserActivityStat from "./UserActivityStat";

type Props = {
  user: ActivityUser;
  range: ActivityRange;
  onClose: () => void;
};

/**
 * Tiroir latéral des dernières actions d'une personne : l'en-tête et la synthèse
 * restent visibles, seule la liste défile.
 */
export default function UserActivityDrawer({ user, range, onClose }: Readonly<Props>) {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: observabilityKeys.userActivity(user.id, range),
    queryFn: () => observabilityApi.queries.getUserActivity(user.id, range),
    retry: false,
  });

  const actions = data?.actions ?? [];
  const errors = actions.filter(({ status }) => status >= 400).length;
  const averageMs = actions.length
    ? Math.round(actions.reduce((sum, { durationMs }) => sum + durationMs, 0) / actions.length)
    : 0;

  return (
    <RightSideDrawer
      id="user-activity-drawer"
      visible={false}
      isOpen
      panelClassName="sm:w-[44rem] sm:min-w-0"
      title={`Activité de ${toTitleCase(user.name)}`}
      onCloseDrawer={onClose}
    >
      <div className="flex flex-col gap-4 pb-4">
        {user.role && (
          <p className="text-sm text-base-content/70">
            Rôle : <span className="badge badge-ghost badge-sm">{user.role}</span>
          </p>
        )}

        {isPending ? (
          <LoadingSkeleton variant="rows" label="Chargement de l'activité" />
        ) : isError ? (
          <div role="alert" className="alert alert-error">
            <span>Impossible de charger l'activité. Réessayez dans un instant.</span>
            <button type="button" className="btn btn-sm" onClick={() => refetch()}>
              Réessayer
            </button>
          </div>
        ) : actions.length === 0 ? (
          <p>Aucune action sur cette période.</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              <UserActivityStat label="Actions affichées" value={actions.length} />
              <UserActivityStat
                label="Erreurs"
                value={errors}
                valueClassName={errors > 0 ? "text-warning" : undefined}
              />
              <UserActivityStat label="Durée moyenne" value={averageMs} unit="ms" />
            </div>
            {groupActionsByDay(actions).map((group) => (
              <section key={group.label} aria-label={group.label}>
                <h3 className="sticky top-0 z-10 bg-base-200 py-1 text-sm font-bold">
                  {group.label}
                </h3>
                <ul>
                  {group.actions.map((action) => (
                    <UserActivityRow
                      key={`${action.time}-${action.method}-${action.path}`}
                      action={action}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
      </div>
    </RightSideDrawer>
  );
}
