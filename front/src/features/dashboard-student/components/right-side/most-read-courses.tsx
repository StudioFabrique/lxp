import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import { dashboardStudentApi } from "../../api/dashboard-student.api";

const MostReadCourses = () => {
  const { data: courses } = useQuery({
    queryKey: ["most-read-courses"],
    queryFn: dashboardStudentApi.queries.getMostReadCourses,
  });
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  return (
    <div
      className={`flex flex-col items-center bg-secondary text-secondary-content rounded-lg p-5 gap-5 ${
        courses && courses?.length < 3 && "h-75"
      }`}
    >
      <p className="font-bold self-start">Les cours les plus consultés</p>
      {courses && courses?.length > 0 ? (
        courses?.map((course) => (
          <Link
            key={course.id}
            to={`/${currentRoute[0]}/parcours/module/${course.module.id}`}
            state={{ lessonId: course.lessons[0].id }}
            className="w-full flex justify-between gap-5 bg-primary text-base-100 rounded-lg p-2 px-4"
          >
            <div className="flex flex-col w-[70%]">
              <span data-tip={`${course.title}`} className="tooltip flex">
                <p className="font-semibold truncate">{course.title}</p>
              </span>
              <span
                data-tip={`${course.module.title}`}
                className="tooltip flex"
              >
                <p className="text-sm truncate">{`Module ${course.module.title}`}</p>
              </span>
            </div>

            <ArrowUpRightIcon className="self-end" />
          </Link>
        ))
      ) : (
        <p>Aucun cours disponibles</p>
      )}
    </div>
  );
};

export default MostReadCourses;
