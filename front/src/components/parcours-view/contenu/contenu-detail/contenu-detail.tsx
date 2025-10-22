/* eslint-disable @typescript-eslint/no-explicit-any */
import Can from "../../../UI/can/can.component";
import BookIcon from "../../../UI/svg/book-icon";
import useHttp from "../../../../hooks/use-http";
import { FC, useEffect, useState } from "react";
import Course from "../../../../utils/interfaces/course";
import EditIcon from "../../../UI/svg/edit-icon";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ContenuDetail: FC<{ parcoursId: number; moduleId: number }> = ({
  parcoursId,
  moduleId,
}) => {
  const { sendRequest, isLoading } = useHttp(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  const [courses, setCourses] = useState<Course[]>([]);

  const handleNavigate = (course: Course) => {
    navigate(`/${currentRoute[0]}/parcours/module/${moduleId}`, {
      state: {
        lessonId: course.lessons.length > 0 ? course.lessons[0].id : null,
      },
    });
  };

  /**
   * récupère la liste des cours depuis la bdd
   */
  useEffect(() => {
    const applyData = (data: any) => {
      const courses = data.response;
      setCourses(courses);
    };
    sendRequest(
      {
        path: `/course/${moduleId}`,
      },
      applyData
    );
  }, [sendRequest, moduleId]);

  const contentsList =
    !isLoading && courses.length > 0 ? (
      courses.map((course, i) => (
        <div
          onClick={() => handleNavigate(course)}
          key={course?.id}
          className="flex justify-between items-center bg-primary hover:bg-primary/80 text-base-100 p-4 rounded-lg"
        >
          <span className="w-12 h-12 flex-shrink-0">
            <BookIcon />
          </span>
          <div className="flex flex-col truncate w-full px-4">
            <span className="truncate">{`Cours ${i + 1}`}</span>
            <span className="text-sm font-bold truncate">{course.title}</span>
          </div>
          <Can action="update" object="course">
            <Link
              to={`/${currentRoute[0]}/course/edit/${course.id}`}
              className="h-6 w-6 flex-shrink-0"
            >
              <EditIcon />
            </Link>
          </Can>
        </div>
      ))
    ) : (
      <p className="ml-4">Aucun cours publié</p>
    );

  return (
    <div className="flex flex-col gap-y-4 mt-5">
      <span className="flex justify-between">
        <h2 className="text-xl font-bold text-primary">Contenu du module</h2>
        <Can action="write" object="course">
          <Link
            to="/admin/course/add"
            state={{ parcoursId, moduleId }}
            className="btn btn-primary btn-sm text-base-100"
          >
            Ajouter un cours
          </Link>
        </Can>
      </span>
      <div className="flex flex-col gap-y-2">{contentsList}</div>
    </div>
  );
};

export default ContenuDetail;
