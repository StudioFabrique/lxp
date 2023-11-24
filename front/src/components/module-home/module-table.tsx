/* eslint-disable @typescript-eslint/no-explicit-any */
//import { useNavigate } from "react-router-dom";

import { localeDate } from "../../helpers/locale-date";
import Can from "../UI/can/can.component";
import DeleteIcon from "../UI/svg/delete-icon.component";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";

interface ModuleTableProps {
  modulesList: any[];
  fieldSort: string;
  direction: boolean;
  onSorting: (property: string) => void;
}

const ModuleTable = ({
  modulesList,
  fieldSort,
  direction,
  onSorting,
}: ModuleTableProps) => {
  //const nav = useNavigate();

  const content = (
    <>
      {modulesList && modulesList.length > 0 ? (
        <>
          {modulesList.map((item: any) => (
            <tr
              className="text-xs lg:text-sm cursor-pointer hover:bg-secondary/20 hover:text-base-content"
              key={item.id}
            >
              <td className="bg-transparent rounded-l-lg truncate">
                {item.title}
              </td>
              <td className="bg-transparent truncate">
                {item.formation ? item.formation : "ND"}
              </td>
              <td className="bg-transparent truncate">
                {item.parcours ? item.parcours : "ND"}
              </td>
              <td className="bg-transparent truncate">
                {localeDate(item.createdAt!)}
              </td>
              <td className="bg-transparent truncate">
                {localeDate(item.updatedAt!)}
              </td>
              <td className="bg-transparent capitalize truncate">
                {item.author}
              </td>
              <td className="bg-transparent rounded-r-lg">
                <div
                  className="w-6 h-6 text-error"
                  aria-label="suppression du parcours"
                >
                  <Can action="delete" object="module">
                    <div
                      className="tooltip tooltip-bottom flex-items-center"
                      data-tip="Supprimer le parcours"
                    >
                      <div onClick={() => {}}>
                        <DeleteIcon />
                      </div>
                    </div>
                  </Can>
                </div>
              </td>
            </tr>
          ))}
        </>
      ) : null}
    </>
  );

  return (
    <div className="w-full min-h-[50%] flex justify-center items-center text-xs lg:text-sm">
      {modulesList && modulesList.length > 0 ? (
        <table className="table w-full border-separate border-spacing-y-2">
          <thead>
            <tr>
              <th
                className="cursor-pointer"
                onClick={() => {
                  onSorting("title");
                }}
              >
                <div className="flex items-center gap-x-2">
                  <p>Titre</p>{" "}
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
                  onSorting("formation");
                }}
              >
                <div className="flex items-center gap-x-2">
                  <p>Formation</p>{" "}
                  <SortColumnIcon
                    fieldSort={fieldSort}
                    column="formation"
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
                  onSorting("updatedAt");
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
              <th></th>
            </tr>
          </thead>
          <tbody>{content}</tbody>
        </table>
      ) : (
        <p>Aucun parcours trouvé</p>
      )}
    </div>
  );
};

export default ModuleTable;
