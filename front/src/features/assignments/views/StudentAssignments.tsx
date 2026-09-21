import { useQuery } from "@tanstack/react-query";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
} from "lucide-react";
import { useMemo, useState } from "react";
import Header from "../../../components/headers/Header";
import HierarchicalListCard from "../../../components/UI/hierarchical-list-card/HierarchicalListCard";
import MultiCriteriaSearch from "../../../components/UI/multi-criteria-search";
import Loader from "../../../components/loaders/Loader";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import { cn } from "../../../utils/cn";
import { getStudentAssignments } from "../api/student-assignments.api";
import {
  assignmentStatus,
  filterStudentAssignments,
  type AssignmentPeriod,
} from "../student-assignments.utils";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

const statusClassName = {
  "À remettre": "badge-warning",
  Remis: "badge-info",
  Évalué: "badge-success",
  "Non remis": "badge-error",
} as const;

export default function StudentAssignments() {
  const [period, setPeriod] = useState<AssignmentPeriod>("upcoming");
  const [search, setSearch] = useState("");
  const [now] = useState(() => new Date());
  const query = useQuery({
    queryKey: ["student-assignments"],
    queryFn: getStudentAssignments,
  });
  const assignments = useMemo(
    () => filterStudentAssignments(query.data ?? [], period, search, now),
    [now, period, query.data, search],
  );

  return (
    <PageWrapper as="main">
      <Header
        title="Remises & évaluations"
        description="Retrouvez vos devoirs, leurs échéances et les évaluations reçues."
      />

      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filtrer les évaluations par période"
      >
        <button
          type="button"
          className={cn(
            "btn btn-sm cursor-pointer",
            period === "upcoming"
              ? "btn-primary"
              : "btn-outline",
          )}
          aria-pressed={period === "upcoming"}
          onClick={() => setPeriod("upcoming")}
        >
          À venir
        </button>
        <button
          type="button"
          className={cn(
            "btn btn-sm cursor-pointer",
            period === "past"
              ? "btn-primary"
              : "btn-outline",
          )}
          aria-pressed={period === "past"}
          onClick={() => setPeriod("past")}
        >
          Évaluations passées
        </button>
      </div>

      <MultiCriteriaSearch
        value={search}
        onChange={setSearch}
        criteria={["cours", "module", "parcours", "statut"]}
        placeholder="Rechercher une évaluation..."
      />

      {query.isPending ? (
        <Loader />
      ) : query.isError ? (
        <div className="alert alert-error" role="alert">
          Impossible de charger les remises et évaluations.
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => void query.refetch()}
          >
            Réessayer
          </button>
        </div>
      ) : (
        <HierarchicalListCard
          fullWidth
          showMore={false}
          maxItemsShown={assignments.length}
          label={`${assignments.length} évaluation${assignments.length > 1 ? "s" : ""}`}
          title={period === "upcoming" ? "À venir" : "Évaluations passées"}

          emptyMessage={
            search
              ? "Aucune évaluation ne correspond à votre recherche."
              : period === "upcoming"
                ? "Aucune évaluation à venir."
                : "Aucune évaluation passée."
          }
          items={assignments.map((assignment) => {
            const status = assignmentStatus(assignment, now);
            const deadline = `Échéance : ${dateFormatter.format(new Date(assignment.dueAt))}`;
            const grade = assignment.submissions[0]?.grade;

            return {
              id: assignment.id,
              title: assignment.course.title,
              titleAccessory: (
                <span
                  className={`badge mb-0.5 badge-xs ${statusClassName[status]}`}
                >
                  {status}
                </span>
              ),
              description: assignment.course.module.title,
              subDescription: (
                <div className="flex flex-col">
                  <span>{deadline}</span>
                  {grade !== null && grade !== undefined && (
                    <span>
                      Note attribuée : {grade}/{assignment.maxScore}
                    </span>
                  )}
                </div>
              ),
              icon:
                status === "Évalué" ? (
                  <CheckCircle2 />
                ) : status === "À remettre" ? (
                  <CalendarClock />
                ) : status === "Non remis" ? (
                  <Clock3 />
                ) : (
                  <ClipboardCheck />
                ),
              to: `/student/parcours/module/${assignment.course.module.id}`,
              state: {
                courseId: assignment.course.id,
                assignmentCourseId: assignment.course.id,
              },
              ariaLabel: `Ouvrir le devoir ${assignment.course.title}`,
            };
          })}
        />
      )}
    </PageWrapper>
  );
}
