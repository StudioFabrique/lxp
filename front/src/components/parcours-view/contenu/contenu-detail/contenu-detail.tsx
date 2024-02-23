/* eslint-disable @typescript-eslint/no-explicit-any */
import SubWrapper from "../../../UI/sub-wrapper/sub-wrapper.component";
import Can from "../../../UI/can/can.component";
import BookIcon from "../../../UI/svg/book-icon";
import useHttp from "../../../../hooks/use-http";
import { FC, useEffect, useState } from "react";
import Course from "../../../../utils/interfaces/course";
import EditIcon from "../../../UI/svg/edit-icon";
import { Link, useLocation } from "react-router-dom";

const ContenuDetail: FC<{ moduleId: number }> = ({ moduleId }) => {
  const { sendRequest, isLoading } = useHttp(true);
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  const [courses, setCourses] = useState<Course[]>([]);

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
        <Link
          to={`/${currentRoute[0]}/parcours/module/${moduleId}`}
          state={{
            lessonId: course.lessons.length > 0 ? course.lessons[0].id : null,
          }}
          key={course?.id}
          className="flex justify-between items-center bg-secondary text-secondary-content p-4 rounded-lg"
        >
          <span className="w-14 h-14 mx-4">
            <BookIcon />
          </span>
          <div className="flex flex-col items-center w-full px-2">
            <p className="self-start">{`Cours ${i + 1}`}</p>
            <div className="flex justify-between w-full">
              <p className="self-start text-xl font-bold">{course.title}</p>
            </div>
          </div>
          <Can action="update" object="course">
            <Link
              to={`/${currentRoute[0]}/course/edit/${course.id}`}
              className="h-8 w-8"
            >
              <EditIcon />
            </Link>
          </Can>
        </Link>
      ))
    ) : (
      <p>Aucun cours</p>
    );

  return (
    <SubWrapper>
      <span className="flex justify-between">
        <h2 className="text-xl font-bold text-primary">Contenu du module</h2>
        <Can action="write" object="course">
          <Link
            to="/admin/course/add"
            className="btn btn-primary btn-sm normal-case"
          >
            Ajouter un cours
          </Link>
        </Can>
      </span>
      <div className="flex flex-col gap-y-5">{contentsList}</div>
    </SubWrapper>
  );
};

export default ContenuDetail;
