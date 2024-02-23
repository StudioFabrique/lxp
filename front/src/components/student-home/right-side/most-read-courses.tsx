import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Course from "../../../utils/interfaces/course";
import { ArrowUpRightIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MostReadCourses = () => {
  const { sendRequest } = useHttp(true);
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  const [courses, setCourses] = useState<Course[]>();

  useEffect(() => {
    const applyData = (data: { data: Course[] }) => {
      setCourses(data.data);
    };

    sendRequest({ path: "/course/most-read" }, applyData);
  }, [sendRequest]);

  return (
    <div
      className={`flex flex-col items-center bg-secondary text-secondary-content rounded-lg p-5 gap-5 ${
        courses && courses?.length < 3 && "h-[300px]"
      }`}
    >
      <p className="font-bold self-start">Les cours les plus consultés</p>
      {courses && courses?.length > 0 ? (
        courses?.map((course) => (
          <div
            key={course.id}
            className="w-full flex justify-between gap-5 bg-primary text-primary-content rounded-lg p-2 px-4"
          >
            <span className="flex flex-col w-full overflow-clip">
              <p className="font-semibold truncate">{course.title}</p>
              <p className="text-sm truncate">{`Module ${course.module.title}`}</p>
            </span>
            <Link
              to={`/${currentRoute}/parcours/module/${course.module.id}`}
              state={{ lessonId: course.lessons[0].id }}
              className="self-end"
            >
              <ArrowUpRightIcon />
            </Link>
          </div>
        ))
      ) : (
        <p>Aucun cours disponibles</p>
      )}
    </div>
  );
};

export default MostReadCourses;
