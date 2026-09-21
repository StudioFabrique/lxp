import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon } from "lucide-react";
import { Link } from "react-router";
import { dashboardStudentApi } from "../../api/dashboard-student.api";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import CursorGlowCard from "../../../../components/UI/cursor-glow-card";

const MostReadCourses = () => {
  const { data: courses, isLoading, isError, refetch } = useQuery({
    queryKey: ["most-read-courses"],
    queryFn: dashboardStudentApi.queries.getMostReadCourses,
  });

  return (
    <BoxWrapper className="gap-5">
      <h2 className="font-bold">Les cours les plus consultés</h2>
      {isLoading ? (
        <div className="flex flex-col gap-3" aria-busy="true">
          {[0, 1, 2].map((index) => (
            <div key={index} className="skeleton h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-start gap-2">
          <p>Impossible de charger les cours.</p>
          <button
            type="button"
            className="btn btn-sm btn-outline btn-primary"
            onClick={() => void refetch()}
          >
            Réessayer
          </button>
        </div>
      ) : courses?.length ? (
        <div className="flex min-w-0 flex-col gap-3">
          {courses.map((course) => (
            <CursorGlowCard key={course.id}>
              <Link
                to={`/student/parcours/module/${course.module.id}`}
                state={{ lessonId: course.lessons?.[0]?.id }}
                className="group flex min-w-0 items-center justify-between gap-3 rounded-xl bg-secondary/10 p-3 transition-colors hover:bg-secondary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={`Ouvrir le cours ${course.title}, module ${course.module.title}`}
              >
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate font-semibold text-primary first-letter:uppercase" title={course.title}>
                    {course.title}
                  </span>
                  <span className="truncate text-sm text-base-content/70" title={course.module.title}>
                    Module {course.module.title}
                  </span>
                </span>
                <ArrowUpRightIcon className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            </CursorGlowCard>
          ))}
        </div>
      ) : (
        <p>Aucun cours disponible</p>
      )}
    </BoxWrapper>
  );
};

export default MostReadCourses;
