import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type CSSProperties } from "react";
import { BellOff, BellRing, CalendarDays, ChartNoAxesCombined, CheckCheck, TriangleAlert, UserRound, Users } from "lucide-react";
import { Link, useLocation, useParams } from "react-router";
import Header from "../../../components/headers/Header";
import LoadingSkeleton from "../../../components/loaders/LoadingSkeleton";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import { dashboardIAApi, type DropoutStudent } from "../api/dashboardIA.api";
import { toTitleCase } from "../../../utils/helpers/text-helpers";
import { groupAnalysisNameLines } from "../helpers/group-analysis-name";

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function Indicator({ label, value, detail, reverse = false }: {
  label: string; value: number | null; detail: string; reverse?: boolean;
}) {
  const percent = value === null || !Number.isFinite(value) ? null : clamp(value);
  const color = percent === null ? "text-base-content/40"
    : reverse ? percent >= 70 ? "text-error" : percent >= 40 ? "text-warning" : "text-success"
      : percent < 40 ? "text-error" : percent < 70 ? "text-warning" : "text-success";
  return <div className="flex w-full min-w-0 flex-col items-center gap-2 text-center">
    <div className={`radial-progress ${color}`}
      style={{ "--value": percent ?? 0, "--size": "4.5rem", "--thickness": "5px" } as React.CSSProperties}
      role="progressbar" aria-label={label} aria-valuenow={percent ?? undefined} aria-valuemin={0} aria-valuemax={100}>
      <span className="text-sm font-semibold">{percent === null ? "—" : `${percent}%`}</span>
    </div>
    <div className="flex min-h-10 flex-col items-center justify-start"><p className="text-sm font-medium">{label}</p><p className="text-xs text-base-content/65">{detail}</p></div>
  </div>;
}

function StudentAnalysis({ student, editing, disabled, onToggle }: {
  student: DropoutStudent; editing: boolean; disabled: boolean; onToggle: () => void;
}) {
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
    <div className="flex min-h-9 flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {!editing && <span className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg border ${disabled
          ? "border-warning/50 bg-warning/20 text-warning" : "border-base-300 bg-base-100 text-base-content/60"}`}
          title={disabled ? "Alertes désactivées" : "Alertes activées"}
          role="img" aria-label={disabled ? "Alertes désactivées" : "Alertes activées"}>
          {disabled ? <BellOff className="size-4" aria-hidden="true" />
            : <BellRing className="size-4" aria-hidden="true" />}
        </span>}
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <UserRound className="size-4 shrink-0 text-base-content/60" aria-hidden="true" />
          {toTitleCase(student.name)}
        </h3>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-28 items-center justify-center rounded-lg border border-black/10 px-2 text-center text-sm font-bold leading-none" style={statusStyle}>
          {status}
        </span>
        {editing ? <button type="button" aria-pressed={disabled}
          aria-label={`${disabled ? "Réactiver" : "Désactiver"} l’alerte pour ${toTitleCase(student.name)}`}
          className={`btn btn-sm inline-flex h-9 w-44 items-center justify-center gap-2 normal-case ${disabled ? "btn-error btn-soft" : "btn-outline"}`}
          onClick={onToggle}>
          <BellOff className="size-4 shrink-0" aria-hidden="true" />
          <span className="leading-none">{disabled ? "Alerte désactivée" : "Désactiver l’alerte"}</span>
        </button> : <>
        <Link to={`/admin/user/data/${student.userId}`} className="btn btn-outline flex h-9 min-h-0 w-28 items-center justify-center px-2 text-sm font-bold leading-none normal-case"
          aria-label={`Voir les détails et analyses de ${toTitleCase(student.name)}`}>
          Voir le détail
        </Link>
        </>}
      </div>
    </div>
    {hasIndicators ? <div className="grid grid-cols-2 gap-x-2 gap-y-5 border-t border-base-300 pt-5 sm:grid-cols-4">
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
  const queryClient = useQueryClient();
  const [editingAlerts, setEditingAlerts] = useState(false);
  const [disabledStudentIds, setDisabledStudentIds] = useState<string[]>([]);
  const query = useQuery({
    queryKey: ["dropout-group", groupId],
    queryFn: () => dashboardIAApi.queries.getGroupDropoutAnalysis(groupId!),
    enabled: Boolean(groupId),
  });
  const summary = query.data;
  const nameLines = groupAnalysisNameLines(summary?.name ?? groupName ?? "Analyse du décrochage");
  const review = useMutation({
    mutationFn: () => dashboardIAApi.reviewGroupDropoutAlert(groupId!, summary!.weekKey),
    onSuccess: async () => {
      queryClient.setQueryData(["dropout-group", groupId], (current: typeof summary) => current && { ...current, reviewed: true });
      await queryClient.invalidateQueries({ queryKey: ["dropout-summaries"] });
    },
  });
  const saveAlerts = useMutation({
    mutationFn: () => dashboardIAApi.updateGroupDropoutAlertSettings(groupId!, disabledStudentIds),
    onSuccess: async ({ disabledStudentIds: saved }) => {
      queryClient.setQueryData(["dropout-group", groupId], (current: typeof summary) => current && {
        ...current, disabledStudentIds: saved,
      });
      setEditingAlerts(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dropout-summaries"] }),
        queryClient.invalidateQueries({ queryKey: ["dropout-group", groupId] }),
      ]);
    },
  });
  const toggleStudent = (studentId: string) => setDisabledStudentIds((ids) => ids.includes(studentId)
    ? ids.filter((id) => id !== studentId) : [...ids, studentId]);
  return <PageWrapper as="main">
    <Header icon={ChartNoAxesCombined} title={nameLines[0]} description={nameLines.slice(1).join(" · ")}>
      <Link to="/admin/group" className="btn btn-outline md:w-32 normal-case">Retour</Link>
      {summary?.canReview && summary.alertCritical > 0 && (summary.reviewed ?
        <span className="inline-flex items-center gap-2 text-sm text-success"><CheckCheck className="size-4" aria-hidden="true" /> Alerte prise en compte</span>
        : <button type="button" className="btn btn-primary normal-case" disabled={review.isPending}
          onClick={() => review.mutate()}><CheckCheck className="size-4" aria-hidden="true" /> Prendre en compte l’alerte</button>)}
    </Header>
    {review.isError && <p role="alert" className="w-full text-sm text-error">Impossible de prendre en compte cette alerte.</p>}
    {saveAlerts.isError && <p role="alert" className="w-full text-sm text-error">Impossible d’enregistrer les alertes des étudiants.</p>}
    <section className="flex w-full flex-col gap-8" aria-label="Analyse IA du groupe">
      {query.isPending ? <LoadingSkeleton variant="rows" label="Chargement de l’analyse" />
        : query.isError && query.error && "status" in query.error && query.error.status === 404 ?
          <BoxWrapper className="h-auto"><p>Aucun traitement terminé pour ce groupe.</p></BoxWrapper>
        : query.isError ? <BoxWrapper className="h-auto"><p role="alert">Impossible de charger l’analyse de ce groupe.</p></BoxWrapper>
        : summary ? <>
          <div className="grid gap-4 md:grid-cols-3">
              <BoxWrapper className="h-auto">
                <div className="flex items-center gap-2"><Users className="size-6 text-primary" aria-hidden="true" /><p className="text-sm">Apprenants analysés</p></div>
                <strong className="text-3xl">{summary.analyzed}</strong>
              </BoxWrapper>
              <BoxWrapper className="h-auto">
                <div className="flex items-center gap-2"><TriangleAlert className="size-6 text-error" aria-hidden="true" /><p className="text-sm">Cas critiques</p></div>
                <strong className="text-3xl">{summary.critical}</strong>
              </BoxWrapper>
              <BoxWrapper className="h-auto">
                <div className="flex items-center gap-2"><CalendarDays className="size-6 text-primary" aria-hidden="true" /><p className="text-sm">Date de la dernière analyse</p></div>
                <strong className="text-xl">{new Date(summary.completedAt).toLocaleString("fr-FR")}</strong>
              </BoxWrapper>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Étudiants concernés</h2>
              {summary.canManageAlerts && (editingAlerts ? <div className="flex gap-2">
                <button type="button" className="btn btn-ghost btn-sm normal-case" disabled={saveAlerts.isPending}
                  onClick={() => setEditingAlerts(false)}>Annuler</button>
                <button type="button" className="btn btn-primary btn-sm normal-case" disabled={saveAlerts.isPending}
                  onClick={() => saveAlerts.mutate()}>{saveAlerts.isPending ? "Enregistrement…" : "Enregistrer"}</button>
              </div> : <button type="button" className="btn btn-outline btn-sm normal-case"
                onClick={() => { setDisabledStudentIds(summary.disabledStudentIds); setEditingAlerts(true); }}>
                Modifier les alertes
              </button>)}
            </div>
            {summary.students.length ? <ul className="grid gap-4 lg:grid-cols-2">{summary.students.map((student) =>
              <StudentAnalysis key={student.userId} student={student} editing={editingAlerts}
                disabled={(editingAlerts ? disabledStudentIds : summary.disabledStudentIds).includes(student.userId)}
                onToggle={() => toggleStudent(student.userId)} />)}</ul>
              : <BoxWrapper className="h-auto"><p>Aucun détail individuel disponible pour ce traitement.</p></BoxWrapper>}
          </div>
        </> : null}
    </section>
  </PageWrapper>;
}
