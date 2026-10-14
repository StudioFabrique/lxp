import { isAxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarDays, ChartNoAxesCombined, CheckCheck, TriangleAlert, Users } from "lucide-react";
import { Link, useLocation, useParams } from "react-router";
import Header from "../../../components/headers/Header";
import LoadingSkeleton from "../../../components/loaders/LoadingSkeleton";
import EmptyStatePlaceholder from "../../../components/UI/empty-state-placeholder";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import { dashboardIAApi } from "../api/dashboardIA.api";
import { groupAnalysisNameLines } from "../helpers/group-analysis-name";
import { StudentAnalysis } from "./StudentAnalysis";

export default function GroupDropoutAnalysis() {
  const { groupId } = useParams();
  const location = useLocation();
  const groupName = (location.state as { groupName?: string } | null)
    ?.groupName;
  const queryClient = useQueryClient();
  const [editingAlerts, setEditingAlerts] = useState(false);
  const [disabledStudentIds, setDisabledStudentIds] = useState<string[]>([]);
  const query = useQuery({
    queryKey: ["dropout-group", groupId],
    queryFn: () => dashboardIAApi.queries.getGroupDropoutAnalysis(groupId!),
    enabled: Boolean(groupId),
  });
  const summary = query.data;
  const nameLines = groupAnalysisNameLines(
    summary?.name ?? groupName ?? "Analyse du décrochage",
  );
  const review = useMutation({
    mutationFn: () =>
      dashboardIAApi.reviewGroupDropoutAlert(groupId!, summary!.weekKey),
    onSuccess: async () => {
      queryClient.setQueryData(
        ["dropout-group", groupId],
        (current: typeof summary) => current && { ...current, reviewed: true },
      );
      await queryClient.invalidateQueries({ queryKey: ["dropout-summaries"] });
    },
  });
  const saveAlerts = useMutation({
    mutationFn: () =>
      dashboardIAApi.updateGroupDropoutAlertSettings(
        groupId!,
        disabledStudentIds,
      ),
    onSuccess: async ({ disabledStudentIds: saved }) => {
      queryClient.setQueryData(
        ["dropout-group", groupId],
        (current: typeof summary) =>
          current && {
            ...current,
            disabledStudentIds: saved,
          },
      );
      setEditingAlerts(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["dropout-summaries"] }),
        queryClient.invalidateQueries({ queryKey: ["dropout-group", groupId] }),
      ]);
    },
  });
  const toggleStudent = (studentId: string) =>
    setDisabledStudentIds((ids) =>
      ids.includes(studentId)
        ? ids.filter((id) => id !== studentId)
        : [...ids, studentId],
    );
  return (
    <PageWrapper as="main">
      <Header
        icon={ChartNoAxesCombined}
        title={nameLines[0]}
        description={nameLines.slice(1).join(" / ")}
      >
        <Link to="/admin/group" className="btn btn-outline md:w-32 normal-case">
          Retour
        </Link>
        {summary?.canReview &&
          summary.alertCritical > 0 &&
          (summary.reviewed ? (
            <span className="inline-flex items-center gap-2 text-sm text-success">
              <CheckCheck className="size-4" aria-hidden="true" /> Alerte prise
              en compte
            </span>
          ) : (
            <button
              type="button"
              className="btn btn-primary normal-case"
              disabled={review.isPending}
              onClick={() => review.mutate()}
            >
              <CheckCheck className="size-4" aria-hidden="true" /> Prendre en
              compte l’alerte
            </button>
          ))}
      </Header>
      {review.isError && (
        <p role="alert" className="w-full text-sm text-error">
          Impossible de prendre en compte cette alerte.
        </p>
      )}
      {saveAlerts.isError && (
        <p role="alert" className="w-full text-sm text-error">
          Impossible d’enregistrer les alertes des étudiants.
        </p>
      )}
      <section
        className="flex w-full flex-col gap-8"
        aria-label="Analyse IA du groupe"
      >
        {query.isPending ? (
          <LoadingSkeleton variant="detail" label="Chargement de l’analyse" />
        ) : query.isError &&
          isAxiosError(query.error) &&
          query.error.response?.status === 404 ? (
          <EmptyStatePlaceholder title="Aucune analyse IA disponible pour ce groupe." />
        ) : query.isError ? (
          <BoxWrapper className="h-auto">
            <p role="alert">Impossible de charger l’analyse de ce groupe.</p>
          </BoxWrapper>
        ) : summary ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <BoxWrapper className="h-auto">
                <div className="flex items-center gap-2">
                  <Users className="size-6 text-primary" aria-hidden="true" />
                  <p className="text-sm">Apprenants analysés</p>
                </div>
                <strong className="text-3xl">{summary.analyzed}</strong>
              </BoxWrapper>
              <BoxWrapper className="h-auto">
                <div className="flex items-center gap-2">
                  <TriangleAlert
                    className="size-6 text-error"
                    aria-hidden="true"
                  />
                  <p className="text-sm">Cas critiques</p>
                </div>
                <strong className="text-3xl">{summary.critical}</strong>
              </BoxWrapper>
              <BoxWrapper className="h-auto">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    className="size-6 text-primary"
                    aria-hidden="true"
                  />
                  <p className="text-sm">Date de la dernière analyse</p>
                </div>
                <strong className="text-xl">
                  {new Date(summary.completedAt).toLocaleString("fr-FR")}
                </strong>
              </BoxWrapper>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Étudiants concernés</h2>
                {summary.canManageAlerts &&
                  (editingAlerts ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm normal-case"
                        disabled={saveAlerts.isPending}
                        onClick={() => setEditingAlerts(false)}
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm normal-case"
                        disabled={saveAlerts.isPending}
                        onClick={() => saveAlerts.mutate()}
                      >
                        {saveAlerts.isPending
                          ? "Enregistrement…"
                          : "Enregistrer"}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm normal-case"
                      onClick={() => {
                        setDisabledStudentIds(summary.disabledStudentIds);
                        setEditingAlerts(true);
                      }}
                    >
                      Modifier les alertes
                    </button>
                  ))}
              </div>
              {summary.students.length ? (
                <ul className="grid gap-4 lg:grid-cols-2">
                  {summary.students.map((student) => (
                    <StudentAnalysis
                      key={student.userId}
                      student={student}
                      editing={editingAlerts}
                      disabled={(editingAlerts
                        ? disabledStudentIds
                        : summary.disabledStudentIds
                      ).includes(student.userId)}
                      onToggle={() => toggleStudent(student.userId)}
                    />
                  ))}
                </ul>
              ) : (
                <EmptyStatePlaceholder title="Aucun détail individuel disponible pour ce traitement." />
              )}
            </div>
          </>
        ) : (
          <EmptyStatePlaceholder title="Aucune analyse IA disponible pour ce groupe." />
        )}
      </section>
    </PageWrapper>
  );
}
