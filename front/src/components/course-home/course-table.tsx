import { useMemo } from "react";

import { localeDate } from "../../helpers/locale-date";
import { Pencil, Trash2 } from "lucide-react";
import Can from "../UI/can/can.component";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";

interface CustomCourse {
  id: number;
  author: string;
  title: string;
  module: string;
  parcours: string;
  createdAt: string;
  updatedAt: string;
}

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
            <td>
              {/*   <Can action="update" object="cours"> */}

              <Pencil
                className="w-4 h-4 text-primary"
                onClick={() => onEditCourse(course.id!)}
              />

              {/*    </Can> */}
            </td>
            <td>
              <Can action="delete" object="cours">
                <Trash2 className="w-4 h-4 text-error" onClick={() => {}} />
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
        <div className="w-4/6">
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
                    <p>Titre</p>
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
                    <p>Titre</p>{" "}
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
                    <p>Titre</p>{" "}
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
                    <p>Titre</p>
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
                    <p>Titre</p>
                    <SortColumnIcon
                      fieldSort={fieldSort}
                      column="author"
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
