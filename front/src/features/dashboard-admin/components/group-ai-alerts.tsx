import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { dashboardIAApi } from "../../dashboard-ia/api/dashboardIA.api";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import CursorGlowCard from "../../../components/UI/cursor-glow-card";

export default function GroupAiAlerts() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["dropout-summaries"],
    queryFn: dashboardIAApi.queries.getDropoutSummaries,
  });
  const { data: preferences } = useQuery({
    queryKey: ["dropout-preferences"],
    queryFn: dashboardIAApi.queries.getDropoutPreferences,
  });
  const alerts = data?.filter((group) => group.critical >= (preferences?.minCritical ?? 1)) ?? [];

  return (
    <CursorGlowCard
      autoGlow
      glowColor={alerts.length ? "error" : "success"}
      glowSize={alerts.length ? 3.2 : 2}
      className="w-full rounded-lg 2xl:w-80 2xl:shrink-0"
    >
      <BoxWrapper className={`relative z-10 h-full ${alerts.length ? "border-error/25 bg-error/5" : "border-success/25 bg-success/5"}`} aria-label="Alertes de groupe">
      <h2 className="font-bold">Alertes</h2>
      {isPending ? (
        <p className="text-sm">Chargement des alertes…</p>
      ) : isError ? (
        <p role="alert" className="text-sm">Impossible de charger les alertes.</p>
      ) : alerts.length ? (
        <ul className="space-y-2">
          {alerts.map((group) => (
            <li key={group.groupId}>
              <Link
                to={`/admin/dashboard-ia/group/${group.groupId}`}
                state={{ groupName: group.name }}
                className="block rounded-lg border border-error/15 bg-base-100/80 p-3 transition-colors hover:bg-error/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className="flex items-start justify-between gap-2 font-semibold">
                  <span>{group.name}</span>
                  <ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
                </span>
                <span className="mt-1 block text-sm">
                  <span className="font-semibold text-error">{group.critical} {group.critical === 1 ? "cas critique" : "cas critiques"}</span> sur {group.analyzed} apprenants analysés
                </span>
                <span className="mt-1 block text-xs opacity-80">
                  Analyse du {new Date(group.completedAt).toLocaleDateString("fr-FR")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm">Aucune alerte pour vos groupes.</p>
      )}
      </BoxWrapper>
    </CursorGlowCard>
  );
}
