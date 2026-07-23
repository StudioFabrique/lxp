/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import SortColumnIcon from "../../../../components/UI/sort-column-icon/sort-column-icon";
import { Eye, Pencil, Trash2 } from "lucide-react";
import TableRowWrapper from "../../../../components/UI/table-row-wrapper";
import TableWrapper from "../../../../components/UI/table-wrapper";
import ElementNotFound from "../../../../components/UI/element-not-found";
import { truncateText } from "../../../../utils/helpers/truncate-text";
import { localeDate } from "../../../../utils/helpers/locale-date";

interface ModuleTableProps {
  modulesList: any[];
  fieldSort: string;
  direction: boolean;
  onSorting: (property: string) => void;
  onDelete: (id: number) => void;
}

const ModuleTable = ({
  modulesList,
  fieldSort,
  direction,
  onSorting,
  onDelete,
}: ModuleTableProps) => {
  const content = (
    <>
      {modulesList && modulesList.length > 0 ? (
        <>
          {modulesList.map((item: any) => (
            <TableRowWrapper key={item.id}>
              <td className="bg-transparent rounded-l-lg max-w-[150px]">
                <span className="tooltip tooltip-bottom" data-tip={item.title}>
                  {truncateText(item.title, 20)}
                </span>
              </td>
              <td className="bg-transparent capitalize max-w-[100px]">
                <div>
                  <span
                    className="tooltip tooltip-bottom"
                    data-tip={item.author}
                  >
                    {truncateText(item.author, 15)}
                  </span>
                </div>
              </td>
              <td className="bg-transparent max-w-[150px]">
                <span
                  className="tooltip tooltip-bottom text"
                  data-tip={item.formation || "ND"}
                >
                  {truncateText(item.formation, 20)}
                </span>
              </td>

              <td className="bg-transparent">{localeDate(item.createdAt!)}</td>
              <td className="bg-transparent">{localeDate(item.updatedAt!)}</td>
              <td className="bg-transparent rounded-r-lg text-center align-middle">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6">
                    <PermissionGuard action="read" object="module">
                      <div>
                        {item.metadataId ? (
                          <Link
                            className="btn btn-ghost btn-xs btn-square text-secondary tooltip tooltip-bottom"
                            data-tip="Voir le module"
                            to={`/admin/parcours/module/${item.metadataId}`}
                            aria-label="Prévisualiser le module"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        ) : (
                          <div
                            className="btn btn-ghost btn-xs btn-square text-base-content/50 tooltip tooltip-bottom"
                            data-tip="Vous ne pouvez pas modifier un module
                            non rattaché à un parcours"
                          >
                            <Eye className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </PermissionGuard>
                  </div>
                  <div className="w-6 h-6">
                    <PermissionGuard action="update" object="module">
                      <div>
                        {item.metadataId ? (
                          <Link
                            className="btn btn-ghost btn-xs btn-square text-secondary tooltip tooltip-bottom"
                            data-tip="Modifier le module"
                            to={`/admin/parcours/edit/${item.parcoursId}?step=4&moduleId=${item.metadataId}`}
                            aria-label="Editer le module"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        ) : (
                          <div
                            className="btn btn-ghost btn-xs btn-square text-base-content/50 tooltip tooltip-bottom"
                            data-tip="Vous ne pouvez pas modifier un module
                            non rattaché à un parcours"
                          >
                            <Pencil className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </PermissionGuard>
                  </div>
                  <div
                    className="w-6 h-6 text-error"
                    aria-label="suppression du module"
                  >
                    <PermissionGuard action="delete" object="module">
                      <div
                        className="tooltip tooltip-bottom flex-items-center"
                        data-tip="Supprimer le module"
                      >
                        <button
                          className="btn btn-ghost btn-xs btn-square text-error"
                          onClick={() => onDelete(item.id)}
                          aria-label="Supprimer le module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

  // Le reste du code reste inchangé...

  return (
    <div className="w-full min-h-[50%] flex justify-center items-center text-xs lg:text-sm">
      {modulesList && modulesList.length > 0 ? (
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
                <div className="flex items-center justify-around gap-x-2">
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
        <ElementNotFound message="Aucun module trouvé." />
      )}
    </div>
  );
};

export default ModuleTable;
