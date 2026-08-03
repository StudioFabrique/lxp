import { Link } from "react-router";
import { localeDate, localeTime } from "../../../../utils/helpers/locale-date";
import useEagerLoadingList from "../../../../../src/hooks/useEagerLoadingList";
import Lesson from "../../../../../src/utils/interfaces/lesson";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import LessonsList from "../../../course/components/edit/scenario/lessons-list";
import SortColumnIcon from "../../../../components/UI/sort-column-icon/sort-column-icon";
import { Eye, Pencil, Trash2 } from "lucide-react";
import TableRowWrapper from "../../../../components/UI/table-row-wrapper";
import TableWrapper from "../../../../components/UI/table-wrapper";
import ElementNotFound from "../../../../components/UI/element-not-found";

interface LessonHomeProps {
  lessonsList: Lesson[];
  onDelete: (id: number) => void;
}

export default function LessonHome({ lessonsList, onDelete }: LessonHomeProps) {
  const { list, sortData, fieldSort, direction } = useEagerLoadingList(
    lessonsList,
    "title",
    1000,
  );

  const content = (
    <>
      {list && list.length > 0 ? (
        <>
          {list.map((item: Lesson) => (
            <TableRowWrapper key={item.id}>
              <td className="bg-transparent rounded-l-lg">{item.title}</td>
              <td className="bg-transparent capitalize">
                {item.course ? item.course.title : "ND"}
              </td>
              <td className="bg-transparent capitalize">
                {item.course.module.parcours.title}
              </td>
              <td className="bg-transparent capitalize">{item.author}</td>
              <td className="bg-transparent">
                {localeDate(item.createdAt ?? "")} à{" "}
                {localeTime(item.createdAt ?? "")}
              </td>
              <td className="bg-transparent">
                {localeDate(item.updatedAt ?? "")}
              </td>

              <td className="bg-transparent rounded-r-lg p-2 align-middle">
                <div className="flex items-center gap-x-4 justify-center">
                  <PermissionGuard action="read" object="lesson">
                    <div
                      className="tooltip tooltip-top flex-items-center"
                      data-tip="Aperçu de la leçon"
                    >
                      <Link
                        className="btn btn-ghost btn-xs btn-square"
                        to={`/admin/parcours/module/${item.course.module.id}`}
                        state={{ lessonId: item.id }}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </div>
                  </PermissionGuard>

                  <div
                    className="w-6 h-6 text-error"
                    aria-label="suppression de la leçon"
                  >
                    <PermissionGuard action="delete" object="lesson">
                      <div
                        className="tooltip tooltip-top flex-items-center"
                        data-tip="Supprimer la leçon"
                      >
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs btn-square text-error"
                          onClick={() => onDelete(item.id!)}
                          aria-label="Supprimer la leçon"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </PermissionGuard>
                  </div>
                  <div className="w-6 h-6">
                    <PermissionGuard action="update" object="lesson">
                      <div
                        className="tooltip tooltip-left"
                        data-tip="Modifier la leçon"
                      >
                        <Link
                          to={`/admin/parcours/module/${item.course.module.id}?editLessonId=${item.id}`}
                          className="btn btn-ghost btn-xs btn-square text-secondary"
                          aria-label="Editer la leçon"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </div>
                    </PermissionGuard>
                  </div>
                </div>
              </td>
            </TableRowWrapper>
          ))}
        </>
      ) : null}
    </>
  );

  return (
    <>
      {lessonsList && LessonsList.length > 0 ? (
        <TableWrapper>
          <thead>
            <tr className="text-xs xl:text-sm">
              <th
                className="cursor-pointer"
                onClick={() => {
                  sortData("title");
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
                  sortData("courses");
                }}
              >
                <div className="flex items-center gap-x-2">
                  <p>Cours</p>
                  <SortColumnIcon
                    fieldSort={fieldSort}
                    column="courses"
                    direction={direction}
                  />
                </div>
              </th>
              <th className="cursor-pointer" onClick={() => {}}>
                <div className="flex items-center gap-x-2">
                  <p>Parcours</p>
                  <SortColumnIcon
                    fieldSort={""}
                    column="parcours"
                    direction={direction}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => {
                  sortData("author");
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
                  sortData("createdAt");
                }}
              >
                <div className="flex items-center gap-x-2">
                  <p>Date de création</p>
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
                  sortData("updatedAt");
                }}
              >
                <div className="flex items-center gap-x-2">
                  <p>Dernière màj</p>
                  <SortColumnIcon
                    fieldSort={fieldSort}
                    column="updatedAt"
                    direction={direction}
                  />
                </div>
              </th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </TableWrapper>
      ) : (
        <ElementNotFound message={"Aucune leçon trouvée."} />
      )}
    </>
  );
}
