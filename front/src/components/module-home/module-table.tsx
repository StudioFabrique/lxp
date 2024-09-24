import { Link } from "react-router-dom";
import { localeDate } from "../../helpers/locale-date";
import Can from "../UI/can/can.component";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import ArrowTopRightIcon from "../UI/svg/arrow-top-right-icon";
import DeleteIcon from "../UI/svg/delete-icon.component";

interface ModuleTableProps {
  modulesList: any[];
  fieldSort: string;
  direction: boolean;
  stepId: number;
  onSorting: (property: string) => void;
  onDelete: (id: number) => void;
}

const ModuleTable = ({
  modulesList,
  fieldSort,
  direction,
  onSorting,
  stepId,
  onDelete,
}: ModuleTableProps) => {
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  console.log({ modulesList });

  const content = (
    <>
      {modulesList && modulesList.length > 0 ? (
        <>
          {modulesList.map((item: any) => (
            <tr
              className="text-xs lg:text-sm cursor-pointer hover:bg-secondary/20 hover:text-base-content"
              key={item.id}
            >
              <td className="bg-transparent rounded-l-lg max-w-[150px] truncate">
                <span className="tooltip" data-tip={item.title}>
                  {truncateText(item.title, 20)}
                </span>
              </td>
              <td className="bg-transparent capitalize max-w-[100px] truncate">
                <span className="tooltip" data-tip={item.author}>
                  {truncateText(item.author, 15)}
                </span>
              </td>
              <td className="bg-transparent max-w-[150px] truncate">
                <span className="tooltip" data-tip={item.formation || "ND"}>
                  {truncateText(item.formation, 20)}
                </span>
              </td>
              <td className="bg-transparent max-w-[150px] truncate">
                <span className="tooltip" data-tip={item.parcours}>
                  {truncateText(item.parcours, 20)}
                </span>
              </td>
              <td className="bg-transparent truncate">
                {localeDate(item.createdAt!)}
              </td>
              <td className="bg-transparent truncate">
                {localeDate(item.updatedAt!)}
              </td>
              <td className="bg-transparent">
                <div className="w-6 h-6">
                  <Can action="update" object="module">
                    <div className="tooltip tooltip-bottom">
                      {item.parcoursId ? (
                        <Link
                          className="text-secondary tooltip tooltip-bottom"
                          data-tip="Modifier le module"
                          to={`/admin/parcours/edit/${item.parcoursId}?step=${stepId}`}
                          aria-label="Editer le module"
                        >
                          <ArrowTopRightIcon />
                        </Link>
                      ) : (
                        <div
                          className="text-base-content/50 tooltip tooltip-bottom"
                          data-tip="Vous ne pouvez pas modifier un module
                            attaché à une formation"
                        >
                          <ArrowTopRightIcon />
                        </div>
                      )}
                    </div>
                  </Can>
                </div>
              </td>
              <td className="bg-transparent rounded-r-lg">
                <div
                  className="w-6 h-6 text-error"
                  aria-label="suppression du module"
                >
                  <Can action="delete" object="module">
                    <div
                      className="tooltip tooltip-bottom flex-items-center"
                      data-tip="Supprimer le module"
                    >
                      <div onClick={() => onDelete(item.id)}>
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

  // Le reste du code reste inchangé...

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
                  onSorting("formation");
                }}
              >
                <div className="flex items-center gap-x-2">
                  <p>Formation</p>
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
                  <p>Parcours</p>
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
