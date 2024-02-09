import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Course from "../../../utils/interfaces/course";
import { ArrowUpRightSquare } from "lucide-react";
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
    <div className="flex flex-col items-center justify-between bg-secondary rounded-lg p-5 gap-5">
      <p className="font-bold self-start">Les cours les plus consultés</p>
      {courses && courses?.length > 0 ? (
        courses?.map((course) => (
          <span
            key={course.id}
            className="w-full flex justify-between gap-5 bg-indigo-200 rounded-lg p-2"
          >
            <p>{course.title}</p>
            <Link
              to={`/${currentRoute}/parcours/module/${course.module.id}`}
              state={{ lessonId: course.lessons[0].id }}
              className="self-end"
            >
              <ArrowUpRightSquare />
            </Link>
          </span>
        ))
      ) : (
        <p>Aucun cours disponibles</p>
      )}
    </div>
  );
};

export default MostReadCourses;
