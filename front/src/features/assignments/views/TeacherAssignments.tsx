import { useQuery } from "@tanstack/react-query";
import { CalendarClock, SquareArrowRightEnter, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import Header from "../../../components/headers/Header";
import EmptyStatePlaceholder from "../../../components/UI/empty-state-placeholder";
import HierarchicalListCard from "../../../components/UI/hierarchical-list-card/HierarchicalListCard";
import MultiCriteriaSearch from "../../../components/UI/multi-criteria-search";
import ParcoursFilterBadges from "../../../components/UI/parcours-filter-badges";
import Loader from "../../../components/loaders/Loader";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import { getTeacherUpcomingAssignments } from "../api/teacher-assignments.api";
import {
  filterTeacherAssignments,
  teacherAssignmentStudentStatus,
} from "../teacher-assignments.utils";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

const statusClassName = {
  "À remettre": "badge-ghost",
  "À évaluer": "badge-warning",
  Évalué: "badge-success",
} as const;

export default function TeacherAssignments() {
  const [search, setSearch] = useState("");
  const [selectedParcours, setSelectedParcours] = useState<string | null>(null);
  const query = useQuery({
    queryKey: ["teacher-assignments", "upcoming"],
    queryFn: getTeacherUpcomingAssignments,
  });
  const parcours = useMemo(
    () =>
      (query.data ?? []).map(
        (assignment) => assignment.course.module.parcours.title,
      ),
    [query.data],
  );
  const assignments = useMemo(
    () => filterTeacherAssignments(query.data ?? [], selectedParcours, search),
    [query.data, search, selectedParcours],
  );

  return (
    <PageWrapper as="main">
      <Header
        title="Évaluations"
        description="Suivez les évaluations à venir et les remises de vos étudiants."
      />

      <ParcoursFilterBadges
        parcours={parcours}
        selectedParcours={selectedParcours}
        onSelect={setSelectedParcours}
      />

      <MultiCriteriaSearch
        value={search}
        onChange={setSearch}
        criteria={["cours", "module", "parcours", "étudiant", "statut"]}
        placeholder="Rechercher une évaluation ou un étudiant..."
      />

      {query.isPending ? (
        <Loader />
      ) : query.isError ? (
        <div className="alert alert-error" role="alert">
          Impossible de charger les évaluations à venir.
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => void query.refetch()}
          >
            Réessayer
          </button>
        </div>
      ) : assignments.length === 0 ? (
        <EmptyStatePlaceholder
          title={
            search || selectedParcours
              ? "Aucune évaluation ne correspond à vos filtres"
              : "Aucune évaluation à venir"
          }
        />
      ) : (
        <section
          className="grid items-start gap-5 lg:grid-cols-2 2xl:grid-cols-3"
          aria-label={`${assignments.length} évaluation${assignments.length > 1 ? "s" : ""} à venir`}
        >
          {assignments.map((assignment) => {
            const module = assignment.course.module;
            const evaluationLink = `/admin/parcours/module/${module.id}`;

            return (
              <HierarchicalListCard
                key={assignment.id}
                label="Évaluation à venir"
                title={assignment.course.title}
                truncateTitle
                description={
                  <span className="flex flex-col gap-x-2 gap-2">
                    <span>{module.title}</span>
                    <span className="flex items-center gap-1">
                      <CalendarClock className="size-3.5" aria-hidden />
                      {dateFormatter.format(new Date(assignment.dueAt))}
                    </span>
                  </span>
                }
                action={
                  <Link
                    className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
                    data-tip="Ouvrir l’évaluation"
                    to={evaluationLink}
                    state={{
                      courseId: assignment.course.id,
                      assignmentCourseId: assignment.course.id,
                    }}
                    aria-label={`Ouvrir l’évaluation ${assignment.course.title}`}
                  >
                    <SquareArrowRightEnter className="size-[1.2em]" />
                  </Link>
                }
                items={assignment.students.map((student) => {
                  const status = teacherAssignmentStudentStatus(student);
                  const fullName =
                    [student.firstname, student.lastname]
                      .filter(Boolean)
                      .join(" ") || "Étudiant";
                  const canOpenSubmission = Boolean(
                    student.submission?.submittedAt,
                  );

                  return {
                    id: student.id,
                    title: fullName,
                    titleAccessory: (
                      <span
                        className={`badge badge-xs ${statusClassName[status]}`}
                      >
                        {status}
                      </span>
                    ),
                    image: student.avatar
                      ? { src: student.avatar, alt: `Avatar de ${fullName}` }
                      : undefined,
                    icon: student.avatar ? undefined : <UserRound />,
                    to: canOpenSubmission ? evaluationLink : undefined,
                    state: canOpenSubmission
                      ? {
                          courseId: assignment.course.id,
                          assignmentCourseId: assignment.course.id,
                          assignmentSubmissionId: student.submission?.id,
                        }
                      : undefined,
                    ariaLabel: canOpenSubmission
                      ? `Évaluer le devoir de ${fullName}`
                      : undefined,
                  };
                })}
                maxItemsShown={5}
                emptyMessage="Aucun étudiant inscrit à ce parcours"
                moreItemsLabel={(count) =>
                  `Afficher plus d’étudiants (${count})`
                }
                overflowTitle={`Autres étudiants — ${assignment.course.title}`}
              />
            );
          })}
        </section>
      )}
    </PageWrapper>
  );
}
