/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";
import useHttp from "../../hooks/use-http";

import Loader from "../../components/UI/loader";
import { localeDate } from "../../helpers/locale-date";
import Can from "../../components/UI/can/can.component";
import EditIcon from "../../components/UI/svg/edit-icon";
import DeleteIcon from "../../components/UI/svg/delete-icon.component";
import { useNavigate } from "react-router-dom";
import { sortArray } from "../../utils/sortArray";

const CourseHome = () => {
  const { sendRequest, isLoading } = useHttp();
  const [coursesList, setCoursesList] = useState<any[] | null>(null);
  const nav = useNavigate();

  /**
   * navigue jusU'à la vue d'édition du cours identifié par son id
   * @param id number
   */
  const handleEditCourse = useCallback(
    (id: number) => {
      nav(`/admin/course/edit/${id}`);
    },
    [nav]
  );

  /**
   * récupère la liste des cours depuis la bdd
   */
  useEffect(() => {
    const applyData = (data: any) => {
      console.log({ data });

      setCoursesList(sortArray(data, "title"));
    };
    sendRequest(
      {
        path: "/course",
      },
      applyData
    );
  }, [sendRequest]);

  const getModuleTitle = (course: any) => {
    let title = "";
    if (course.modules.length > 0) {
      title = course.modules[0].title;
      if (course.modules.length > 1) {
        title += " ...";
      }
    } else {
      title = "nd";
    }
    return title;
  };

  const content = useMemo(() => {
    return (
      <>
        {coursesList?.map((course) => (
          <tr
            className="cursor-pointer hover:bg-secondary/20 hover:text-base-content"
            key={course.id}
            onClick={() => {}}
          >
            <td>{course.id}</td>
            <td>{course.title}</td>
            <td>{getModuleTitle(course)}</td>
            <td>
              {course.modules.length > 0
                ? course.modules[0].parcours.title
                : "nd"}
            </td>
            <td>{localeDate(course.createdAt!)}</td>
            <td>{localeDate(course.updatedAt!)}</td>
            <td>
              {/*   <Can action="update" object="cours"> */}
              <div
                className="w-6 h-6"
                onClick={() => handleEditCourse(course.id!)}
              >
                <EditIcon />
              </div>
              {/*    </Can> */}
            </td>
            <td>
              <Can action="delete" object="cours">
                <div className="w-6 h-6 text-error" onClick={() => {}}>
                  <DeleteIcon />
                </div>
              </Can>
            </td>
          </tr>
        ))}
      </>
    );
  }, [coursesList, handleEditCourse]);

  return (
    <div className="w-full min-h-[50%] flex justify-center items-center">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {coursesList && coursesList.length > 0 ? (
            <div className="w-4/6">
              <table className="table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Titre</th>
                    <th>Modules</th>
                    <th>Parcours</th>
                    <th>Crée le</th>
                    <th>Mis à jour le</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{content}</tbody>
              </table>
            </div>
          ) : (
            <p>Aucun cours n'a été créé à ce jour</p>
          )}
        </>
      )}
    </div>
  );
};

export default CourseHome;
