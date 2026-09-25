import { useQuery } from "@tanstack/react-query";
import type { CSSProperties } from "react";
import { TriangleAlert, Users } from "lucide-react";
import { Link, useLocation, useParams } from "react-router";
import Header from "../../../components/headers/Header";
import LoadingSkeleton from "../../../components/loaders/LoadingSkeleton";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import { dashboardIAApi, type DropoutStudent } from "../api/dashboardIA.api";
import { toTitleCase } from "../../../utils/helpers/text-helpers";

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function Indicator({ label, value, detail, reverse = false }: {
  label: string; value: number | null; detail: string; reverse?: boolean;
}) {
  const percent = value === null || !Number.isFinite(value) ? null : clamp(value);
  const color = percent === null ? "text-base-content/40"
    : reverse ? percent >= 70 ? "text-error" : percent >= 40 ? "text-warning" : "text-success"
      : percent < 40 ? "text-error" : percent < 70 ? "text-warning" : "text-success";
  return <div className="flex min-w-24 flex-col items-center gap-2 text-center">
    <div className={`radial-progress ${color}`}
      style={{ "--value": percent ?? 0, "--size": "4.5rem", "--thickness": "5px" } as React.CSSProperties}
      role="progressbar" aria-label={label} aria-valuenow={percent ?? undefined} aria-valuemin={0} aria-valuemax={100}>
      <span className="text-sm font-semibold">{percent === null ? "—" : `${percent}%`}</span>
    </div>
    <div><p className="text-sm font-medium">{label}</p><p className="text-xs text-base-content/65">{detail}</p></div>
  </div>;
}

function StudentAnalysis({ student }: { student: DropoutStudent }) {
  const indicators = student.indicators;
  const passRate = indicators?.pass_rate == null ? null : indicators.pass_rate * 100;
  const connections = indicators?.monthly_connection_days == null ? null : indicators.monthly_connection_days / 30 * 100;
  const inactivity = indicators?.days_since_last_activity == null ? null : indicators.days_since_last_activity / 30 * 100;
  const coverage = student.coverage?.total ? student.coverage.available / student.coverage.total * 100 : null;
  const hasIndicators = indicators !== null || student.coverage !== null;
  const status = student.critical ? "Critique" : student.effectiveLevel === 2 ? "À surveiller" : "Stable";
  const statusColor = student.critical ? "var(--color-error)" : student.effectiveLevel === 2 ? "var(--color-warning)" : "var(--color-success)";
  const statusStyle: CSSProperties = {
    backgroundColor: `color-mix(in srgb, ${statusColor} 35%, var(--color-base-100))`,
    color: "var(--color-base-content)",
  };
  return <li><BoxWrapper className="h-auto gap-4 p-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-base font-semibold">{toTitleCase(student.name)}</h3>
      <span className="inline-flex min-h-8 items-center rounded-lg border border-black/10 px-4 py-1 text-sm font-bold leading-5" style={statusStyle}>
        {status}
      </span>
    </div>
    {hasIndicators ? <div className="grid grid-cols-2 justify-items-center gap-5 border-t border-base-300 pt-5 sm:grid-cols-4">
      <Indicator label="Réussite" value={passRate} detail={passRate === null ? "Donnée absente" : "Évaluations réussies"} />
      <Indicator label="Connexions" value={connections} detail={connections === null ? "Donnée absente" : `${indicators!.monthly_connection_days} j / 30 j`} />
      <Indicator label="Inactivité" value={inactivity} reverse detail={inactivity === null ? "Donnée absente" : `${indicators!.days_since_last_activity} jour(s) / 30 j`} />
      <Indicator label="Données disponibles" value={coverage} detail={student.coverage ? `${student.coverage.available} / ${student.coverage.total} indicateurs` : "Donnée absente"} />
    </div> : <p className="border-t border-base-300 pt-4 text-sm text-base-content/65">
      Indicateurs non enregistrés pour ce traitement.
    </p>}
  </BoxWrapper></li>;
}

export default function GroupDropoutAnalysis() {
  const { groupId } = useParams();
  const location = useLocation();
  const groupName = (location.state as { groupName?: string } | null)?.groupName;
  const query = useQuery({
    queryKey: ["dropout-group", groupId],
    queryFn: () => dashboardIAApi.queries.getGroupDropoutAnalysis(groupId!),
    enabled: Boolean(groupId),
  });
  const summary = query.data;
  return <PageWrapper as="main" className="min-h-screen items-center">
    <Header title={summary?.name ?? (groupName && toTitleCase(groupName)) ?? "Analyse du décrochage"}
      description="Dernier traitement IA terminé pour ce groupe">
      <Link to="/admin/group" className="btn btn-outline md:w-32 normal-case">Retour</Link>
    </Header>
    <section className="flex w-full flex-col gap-8" aria-label="Analyse IA du groupe">
      {query.isPending ? <LoadingSkeleton variant="rows" label="Chargement de l’analyse" />
        : query.isError && query.error && "status" in query.error && query.error.status === 404 ?
          <BoxWrapper className="h-auto"><p>Aucun traitement terminé pour ce groupe.</p></BoxWrapper>
        : query.isError ? <BoxWrapper className="h-auto"><p role="alert">Impossible de charger l’analyse de ce groupe.</p></BoxWrapper>
        : summary ? <>
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <BoxWrapper className="h-auto"><Users className="size-6 text-primary" aria-hidden="true" /><p className="text-sm">Apprenants analysés</p><strong className="text-3xl">{summary.analyzed}</strong></BoxWrapper>
              <BoxWrapper className="h-auto"><TriangleAlert className="size-6 text-error" aria-hidden="true" /><p className="text-sm">Cas critiques</p><strong className="text-3xl">{summary.critical}</strong></BoxWrapper>
            </div>
            <p className="text-sm text-base-content/70">Traitement terminé le {new Date(summary.completedAt).toLocaleString("fr-FR")}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Étudiants concernés</h2>
            {summary.students.length ? <ul className="grid gap-4 lg:grid-cols-2">{summary.students.map((student) => <StudentAnalysis key={student.userId} student={student} />)}</ul>
              : <BoxWrapper className="h-auto"><p>Aucun détail individuel disponible pour ce traitement.</p></BoxWrapper>}
          </div>
        </> : null}
    </section>
  </PageWrapper>;
}
