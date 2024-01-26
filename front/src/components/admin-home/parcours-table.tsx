import { MoveUpRight } from "lucide-react";
import { localeDate } from "../../helpers/locale-date";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import ParcoursSummary from "../../utils/interfaces/parcours-summary";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";

interface ParcoursTableProps {
  parcoursList: ParcoursSummary[];
}

export default function ParcoursTable({ parcoursList }: ParcoursTableProps) {
  const { list, fieldSort, direction, sortData } = useEagerLoadingList(
    parcoursList,
    "title",
    3
  );

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
              >
                <td className="bg-transparent rounded-l-lg truncate">
                  {item.title}
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
                  <MoveUpRight className="w-4 h-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </>
  );
}
