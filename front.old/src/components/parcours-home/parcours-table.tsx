import { Link, useNavigate } from "react-router-dom";
import { localeDate } from "../../helpers/locale-date";
import Parcours from "../../utils/interfaces/parcours";
import Can from "../UI/can/can.component";
import EditIcon from "../UI/svg/edit-icon";
import DeleteIcon from "../UI/svg/delete-icon.component";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import EyeIcon from "../UI/svg/eye-icon";

interface ParcoursTableProps {
  parcoursList: Parcours[];
  fieldSort: string;
  direction: boolean;
  onSorting: (property: string) => void;
}

const ParcoursTable = (props: ParcoursTableProps) => {
  const { parcoursList, fieldSort, direction, onSorting } = props;
  const nav = useNavigate();

  const handleDeleteParcours = (id: number) => {
    nav(``);
  };

  // contenu du tableau
  const content = (
    <>
      {parcoursList && parcoursList.length > 0 ? (
        <>
          {parcoursList.map((item: Parcours) => (
            <tr
              className="text-xs lg:text-sm cursor-pointer hover:bg-secondary/20 hover:text-base-content"
              key={item.id}
            >
              <td className="bg-transparent rounded-l-lg truncate">
                {item.title}
              </td>
              <td className="bg-transparent truncate">
                {item.formation.title}
              </td>
              <td className="bg-transparent truncate">
                {item.formation.level}
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
              <td className="bg-transparent truncate">
                {item.isPublished ? "Publié" : "Brouillon"}
              </td>
              <td className="bg-transparent">
                <input
                  type="checkbox"
                  id={item.id!.toString()}
                  className="toggle toggle-primary disabled:toggle-primary disabled:opacity-100 disabled:cursor-default"
                  disabled
                  checked={item.visibility}
                />
              </td>
              <td className="bg-transparent">
                <div className="w-6 h-6">
                  <Can action="update" object="parcours">
                    <div
                      className="tooltip tooltip-bottom"
                      data-tip="Aperçu du parcours"
                    >
                      <Link
                        className="text-primary"
                        to={`view/${item.id}`}
                        aria-label="Aperçu du parcours"
                      >
                        <EyeIcon />
                      </Link>
                    </div>
                  </Can>
                </div>
              </td>
              <td className="bg-transparent">
                <div className="w-6 h-6">
                  <Can action="update" object="parcours">
                    <div
                      className="tooltip tooltip-bottom"
                      data-tip="Modifier le parcours"
                    >
                      <Link
                        className="text-primary"
                        to={`edit/${item.id}`}
                        aria-label="modifier le parcours"
                      >
                        <EditIcon />
                      </Link>
                    </div>
                  </Can>
                </div>
              </td>
              <td className="bg-transparent rounded-r-lg">
                <div
                  className="w-6 h-6 text-error"
                  aria-label="suppression du parcours"
                >
                  <Can action="delete" object="parcours">
                    <div
                      className="tooltip tooltip-bottom flex-items-center"
                      data-tip="Supprimer le parcours"
                    >
                      <div onClick={() => handleDeleteParcours(item.id!)}>
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
      {parcoursList && parcoursList.length > 0 ? (
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
                  onSorting("level");
                }}
              >
                <div className="flex items-center gap-x-2">
                  <p>Niveau</p>
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
              <th>Statut</th>
              <th>Visibilité</th>
              <th></th>
              <th></th>
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

export default ParcoursTable;
