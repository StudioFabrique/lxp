import { MoveUpRight } from "lucide-react";
import { localeDate } from "../../helpers/locale-date";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import ParcoursSummary from "../../utils/interfaces/parcours-summary";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import { Link, useNavigate } from "react-router-dom";
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

  //  redirige l'utilisateur sur l'interface permettant d'éditer le parcours sur lequel il a cliqué
  const handleEditParcours = (event: React.MouseEvent, parcoursId: number) => {
    event.stopPropagation();
    nav(`/admin/parcours/edit/${parcoursId}`);
  };

  //  redirige l'utilisateur sur la vue affichant une aperçu du parcours
  const handleViewParcours = (parcoursId: number) => {
    nav(`/admin/parcours/view/${parcoursId}`);
  };

  return (
    <>
      {list && list.length > 0 ? (
        <table className="table w-4/6 md:w-full border-separate border-spacing-y-2 text-xs text-black">
          <thead>
            <tr className="text-white">
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
                  sortData("level");
                }}
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
                className="cursor-pointer"
                onClick={() => {
                  sortData("students");
                }}
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
              <th
                className="cursor-pointer"
                onClick={() => {
                  sortData("duration");
                }}
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
                className="cursor-pointer"
                onClick={() => {
                  sortData("startDate");
                }}
              >
                <div className="flex items-center gap-x-2">
                  <p>Date de démarrage</p>
                  <SortColumnIcon
                    fieldSort={fieldSort}
                    column="startDate"
                    direction={direction}
                  />
                </div>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => {
                  sortData("visibility");
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
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr
                className="text-xs lg:text-sm cursor-pointer hover:bg-secondary/20 hover:text-white bg-white"
                key={item.id}
                onClick={() => handleViewParcours(item.id)}
              >
                <td className="bg-transparent rounded-l-lg">
                  <p className="tooltip tooltip-bottom" data-tip={item.title}>
                    {truncateText(item.title, 30)}
                  </p>
                </td>
                <td className="bg-transparent truncate">{item.level}</td>
                <td className="bg-transparent truncate">{item.students}</td>
                <td className="bg-transparent truncate">{item.courses}</td>
                <td className="bg-transparent truncate">{item.duration}</td>
                <td className="bg-transparent truncate">
                  {localeDate(item.startDate)}
                </td>
                <td className="bg-transparent truncate">
                  {item.visibility ? "Public" : "Caché"}
                </td>
                <td className="bg-transparent rounded-r-lg truncate">
                  <Can action="update" object="parcours">
                    <span
                      className="z-50"
                      onClick={(event) => handleEditParcours(event, item.id)}
                    >
                      <MoveUpRight className="w-4 h-4" />
                    </span>
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
