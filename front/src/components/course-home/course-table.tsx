import React, { useMemo } from "react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

import { localeDate } from "../../helpers/locale-date";
import Can from "../UI/can/can.component";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import CustomCourse from "./interfaces/custom-course";
import TableRowWrapper from "../UI/table-row-wrapper";
import ElementNotFound from "../UI/element-not-found";
import TableWrapper from "../UI/table-wrapper";

interface CourseTableProps {
  coursesList: CustomCourse[];
  fieldSort: string;
  direction: boolean;
  onSorting: (property: string) => void;
  onEditCourse: (id: number) => void;
  onDeleteCourse: (course: CustomCourse) => void;
  children: React.ReactNode;
}

export default function CourseTable({
  coursesList,
  fieldSort,
  direction,
  onSorting,
  onEditCourse,
  onDeleteCourse,
  children,
}: CourseTableProps) {
  const content = useMemo(() => {
    return (
      <>
        {coursesList?.map((course) => (
          <TableRowWrapper key={course.id}>
            <td className="bg-transparent rounded-l-lg">{course.title}</td>
            <td>{course.module}</td>
            <td>{course.parcours}</td>
            <td>{localeDate(course.createdAt!)}</td>
            <td>{localeDate(course.updatedAt!)}</td>
            <td>{course.author}</td>
            <td>{course.isPublished ? "Publié" : "Brouillon"}</td>
            <td>
              <div className="flex justify-center">
                {course.visibility ? (
                  <Eye
                    className="w-6 h-6"
                    aria-label="le cours est visible par les apprenants"
                  />
                ) : (
                  <EyeOff
                    className="w-6 h-6"
                    aria-label="le cours n'est pas visible par les apprenants"
                  />
                )}
              </div>
            </td>
            <td className="rounded-r-lg bg-transparent p-2 align-middle">
              <div className="flex items-center gap-x-4 justify-center">
                <div
                  className="tooltip tooltip-bottom"
                  data-tip="Modifier le cours."
                >
                  <Pencil
                    className="w-6 h-6 text-primary"
                    aria-label="éditer le cours"
                    onClick={() => onEditCourse(course.id!)}
                  />
                </div>
                <Can action="delete" object="course">
                  <div
                    className="tooltip tooltip-bottom"
                    data-tip="Supprimer le cours définitivement."
                    onClick={() => {
                      onDeleteCourse(course);
                    }}
                  >
                    <Trash2
                      className="w-6 h-6 text-error"
                      aria-label="supprimer le cours"
                    />
                  </div>
                </Can>
              </div>
            </td>
          </TableRowWrapper>
        ))}
      </>
    );
  }, [coursesList, onEditCourse, onDeleteCourse]);

  return (
    <>
      {children}
      {coursesList && coursesList.length > 0 ? (
        <div className="w-full">
          <TableWrapper>
            <thead>
              <tr className="text-xs xl:text-sm">
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
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </TableWrapper>
        </div>
      ) : (
        <ElementNotFound message="Aucun cours trouvé." />
      )}
    </>
  );
}
