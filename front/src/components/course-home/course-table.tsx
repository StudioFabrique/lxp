import { useMemo } from "react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

import { localeDate } from "../../helpers/locale-date";
import Can from "../UI/can/can.component";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import CustomCourse from "./interfaces/custom-course";

interface CourseTableProps {
  coursesList: CustomCourse[];
  fieldSort: string;
  direction: boolean;
  onSorting: (property: string) => void;
  onEditCourse: (id: number) => void;
}

export default function CourseTable({
  coursesList,
  fieldSort,
  direction,
  onSorting,
  onEditCourse,
}: CourseTableProps) {
  const content = useMemo(() => {
    return (
      <>
        {coursesList?.map((course) => (
          <tr
            className="cursor-pointer hover:bg-secondary/20 hover:text-base-content"
            key={course.id}
            onClick={() => {}}
          >
            <td>{course.title}</td>
            <td>{course.module}</td>
            <td>{course.parcours}</td>
            <td>{localeDate(course.createdAt!)}</td>
            <td>{localeDate(course.updatedAt!)}</td>
            <td>{course.author}</td>
            <td>{course.isPublished ? "Publié" : "Brouillon"}</td>
            <td className="w-full h-full flex justify-center items-center">
              {course.visibility ? (
                <div
                  className="tooltip tooltip-bottom"
                  data-tip="La visibilité du cours pour les apprenants est activée."
                >
                  <Eye
                    className="w-4 h-4"
                    aria-label="le cours est visible par les apprenants"
                  />
                </div>
              ) : (
                <div
                  className="tooltip tooltip-bottom"
                  data-tip="La visibilité du cours pour les apprenants n'est pas activée."
                >
                  <EyeOff
                    className="w-4 h-4"
                    aria-label="le cours n'est pas visible par les apprenants"
                  />
                </div>
              )}
            </td>
            <td>
              {/*   <Can action="update" object="cours"> */}

              <div
                className="tooltip tooltip-bottom"
                data-tip="Modifier le cours."
              >
                <Pencil
                  className="w-4 h-4 text-primary"
                  aria-label="éditer le cours"
                  onClick={() => onEditCourse(course.id!)}
                />
              </div>

              {/*    </Can> */}
            </td>
            <td>
              <Can action="delete" object="course">
                <div
                  className="tooltip tooltip-bottom"
                  data-tip="Supprimer le cours définitivement."
                >
                  <Trash2
                    className="w-4 h-4 text-error"
                    aria-label="supprimer le cours"
                    onClick={() => {}}
                  />
                </div>
              </Can>
            </td>
          </tr>
        ))}
      </>
    );
  }, [coursesList, onEditCourse]);

  return (
    <>
      {coursesList && coursesList.length > 0 ? (
        <div className="w-5/6">
          <table className="table">
            <thead>
              <tr>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    onSorting("title");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Titre</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="title"
                      direction={direction}
                    />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    onSorting("module");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Module</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="module"
                      direction={direction}
                    />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    onSorting("parcours");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Parcours</p>{" "}
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="parcours"
                      direction={direction}
                    />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    onSorting("createdAt");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Créé le</p>{" "}
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="createdAt"
                      direction={direction}
                    />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    onSorting("updatedAt");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Màj le</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="updatedAt"
                      direction={direction}
                    />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    onSorting("author");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Auteur</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="author"
                      direction={direction}
                    />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    onSorting("isPublished");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Statut</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="isPublished"
                      direction={direction}
                    />
                  </div>
                </th>
                <th
                  className="cursor-pointer"
                  onClick={() => {
                    onSorting("visibility");
                  }}
                >
                  <div className="flex items-center gap-x-2">
                    <p>Visibilité</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="visibility"
                      direction={direction}
                    />
                  </div>
                </th>
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
  );
}
