import { MoveUpRight } from "lucide-react";
import { localeDate } from "../../helpers/locale-date";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import ParcoursSummary from "../../utils/interfaces/parcours-summary";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import { useNavigate } from "react-router";
import Can from "../UI/can/can.component";
import { truncateText } from "../../helpers/truncate-text";

interface ParcoursTableProps {
  parcoursList: ParcoursSummary[];
}

export default function ParcoursTable({ parcoursList }: ParcoursTableProps) {
  const { list, fieldSort, direction, sortData } = useEagerLoadingList(
    parcoursList,
    "title",
    3,
  );
  const nav = useNavigate();

  const handleEditParcours = (event: React.MouseEvent, parcoursId: number) => {
    event.stopPropagation();
    nav(`/admin/parcours/edit/${parcoursId}`);
  };

  const handleViewParcours = (parcoursId: number) => {
    nav(`/admin/parcours/view/${parcoursId}`);
  };

  return (
    <>
      {list && list.length > 0 ? (
        <table className="table w-full border-separate border-spacing-y-2 text-sm text-base-content">
          <thead>
            <tr className="text-base-content/70">
              <th
                className="cursor-pointer hover:text-base-content transition-colors"
                onClick={() => sortData("title")}
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
                className="cursor-pointer hover:text-base-content transition-colors"
                onClick={() => sortData("level")}
              >
                <div className="flex items-center gap-x-2">
                  <p>Certificat</p>
                  <SortColumnIcon
                    fieldSort={fieldSort}
                    column="level"
                    direction={direction}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer hover:text-base-content transition-colors"
                onClick={() => sortData("students")}
              >
                <div className="flex items-center gap-x-2">
                  <p>Apprenants</p>
                  <SortColumnIcon
                    fieldSort={fieldSort}
                    column="students"
                    direction={direction}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer hover:text-base-content transition-colors"
                onClick={() => sortData("courses")}
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
              <th
                className="cursor-pointer hover:text-base-content transition-colors"
                onClick={() => sortData("duration")}
              >
                <div className="flex items-center gap-x-2">
                  <p>Heures</p>
                  <SortColumnIcon
                    fieldSort={fieldSort}
                    column="duration"
                    direction={direction}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer hover:text-base-content transition-colors"
                onClick={() => sortData("startDate")}
              >
                <div className="flex items-center gap-x-2">
                  <p>Démarrage</p>
                  <SortColumnIcon
                    fieldSort={fieldSort}
                    column="startDate"
                    direction={direction}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer hover:text-base-content transition-colors"
                onClick={() => sortData("isPublished")}
              >
                <div className="flex items-center gap-x-2">
                  <p>État</p>
                  <SortColumnIcon
                    fieldSort={fieldSort}
                    column="isPublished"
                    direction={direction}
                  />
                </div>
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr
                className="cursor-pointer bg-base-100 hover:bg-base-300 transition-colors shadow-sm"
                key={item.id}
                onClick={() => handleViewParcours(item.id)}
              >
                <td className="rounded-l-lg font-semibold">
                  <p className="tooltip tooltip-bottom" data-tip={item.title}>
                    {truncateText(item.title, 30)}
                  </p>
                </td>
                <td className="truncate">{item.level}</td>
                <td className="truncate">{item.students}</td>
                <td className="truncate">{item.courses}</td>
                <td className="truncate">{item.duration}</td>
                <td className="truncate">{localeDate(item.startDate)}</td>
                <td className="truncate">
                  {item.isPublished ? (
                    <span className="badge badge-success badge-sm text-success-content">
                      Publié
                    </span>
                  ) : (
                    <span className="badge badge-ghost badge-sm border-base-content/20">
                      Brouillon
                    </span>
                  )}
                </td>
                <td className="rounded-r-lg truncate text-right">
                  <Can action="update" object="parcours">
                    <button
                      className="btn btn-sm btn-ghost btn-circle text-primary hover:bg-primary/20 z-50"
                      onClick={(event) => handleEditParcours(event, item.id)}
                    >
                      <MoveUpRight className="w-4 h-4" />
                    </button>
                  </Can>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </>
  );
}
