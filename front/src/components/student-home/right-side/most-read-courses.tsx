import { useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import Course from "../../../utils/interfaces/course";
import { ArrowUpRightSquare } from "lucide-react";

const MostReadCourses = () => {
  const { sendRequest } = useHttp(true);

  const [courses, setCourses] = useState<Course[]>();

  useEffect(() => {
    sendRequest({ path: "/course/most-read" });
  }, [sendRequest]);

  return (
    <div className="flex flex-col items-center justify-between bg-secondary rounded-lg p-5 gap-5">
      <p className="font-bold">Les cours les plus consultés</p>
      {courses && courses?.length > 0 ? (
        courses?.map((course) => (
          <span className="w-full bg-indigo-200 rounded-lg p-2">
            <p className="font-semibold"></p>
            <p>{course.title}</p>
            <ArrowUpRightSquare />
          </span>
        ))
      ) : (
        <p>Aucun cours disponibles</p>
      )}
    </div>
  );
};

export default MostReadCourses;
