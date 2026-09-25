import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { dashboardIAApi } from "../../dashboard-ia/api/dashboardIA.api";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import CursorGlowCard from "../../../components/UI/cursor-glow-card";
import { groupAnalysisNameLines } from "../../dashboard-ia/helpers/group-analysis-name";

export default function GroupAiAlerts() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["dropout-summaries"],
    queryFn: dashboardIAApi.queries.getDropoutSummaries,
  });
  const { data: preferences } = useQuery({
    queryKey: ["dropout-preferences"],
    queryFn: dashboardIAApi.queries.getDropoutPreferences,
  });
  const alerts = data?.filter((group) => !group.reviewed && group.alertCritical >= (preferences?.minCritical ?? 1)) ?? [];

  return (
    <CursorGlowCard
      glowColor={alerts.length ? "error" : "success"}
      glowSize={2}
      className="w-full self-start rounded-lg 2xl:w-80 2xl:shrink-0"
    >
      <BoxWrapper className={`relative z-10 h-auto gap-3 p-4 ${alerts.length ? "border-error/25 bg-error/5" : "border-success/25 bg-success/5"}`} aria-label="Alertes de groupe">
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
                className="flex items-start justify-between gap-2 rounded-lg border border-error/15 bg-base-100/80 px-3 py-2.5 transition-colors hover:bg-error/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span className="min-w-0">
                  <span className="block leading-snug">
                    {groupAnalysisNameLines(group.name).map((line, index) => <span key={index} className={`block ${index === 0 ? "text-base font-bold" : "text-xs font-normal text-base-content/65"}`}>{line}</span>)}
                  </span>
                  <span className="mt-1 block text-xs text-base-content/70">
                    <strong className="block text-error">{group.alertCritical} {group.alertCritical === 1 ? "cas critique" : "cas critiques"}</strong>
                    <span className="block">sur {group.analyzed} apprenants</span>
                  </span>
                </span>
                <ArrowUpRight className="size-4 shrink-0 text-base-content/60" aria-hidden="true" />
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
