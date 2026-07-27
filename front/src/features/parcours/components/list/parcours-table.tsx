import { Link } from "react-router";

import { localeDate } from "../../../../utils/helpers/locale-date";
import Parcours from "../../../../../src/utils/interfaces/parcours";
import SortColumnIcon from "../../../../components/UI/sort-column-icon/sort-column-icon";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { truncateText } from "../../../../utils/helpers/truncate-text";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import React from "react";
import TableRowWrapper from "../../../../components/UI/table-row-wrapper";
import TableWrapper from "../../../../components/UI/table-wrapper";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import ElementNotFound from "../../../../components/UI/element-not-found";

interface ParcoursTableProps {
  parcoursList: Parcours[];
  fieldSort: string;
  direction: boolean;
  onSorting: (property: string) => void;
  onDeleteParcours: (parcours: Parcours) => void;
  loading: boolean;
  children: React.ReactNode;
}

const ParcoursTable = (props: ParcoursTableProps) => {
  const {
    parcoursList,
    fieldSort,
    direction,
    onSorting,
    onDeleteParcours,
    //loading,
  } = props;

  const handleDeleteParcours = (parcours: Parcours) => {
    onDeleteParcours(parcours);
  };

  // contenu du tableau
  const content = (
    <>
      {parcoursList && parcoursList.length > 0 ? (
        <>
          {parcoursList.map((item: Parcours) => (
            <TableRowWrapper key={item.id}>
              <td className="bg-transparent rounded-l-lg">
                <p className="tooltip tooltip-right" data-tip={item.title}>
                  {truncateText(item.title, 20)}
                </p>
              </td>
              <td className="bg-transparent">
                <p className="tooltip" data-tip={item.formation.title}>
                  {truncateText(item.formation.title, 20)}
                </p>
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
              <td className="bg-transparent capitalize">
                <p className="tooltip" data-tip={item.author}>
                  {truncateText(item.author, 20)}
                </p>
              </td>
              <td className="bg-transparent truncate">
                {item.isPublished ? "Publié" : "Brouillon"}
              </td>
              <td className="bg-transparent rounded-r-lg text-center align-middle">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6">
                    <PermissionGuard action="update" object="parcours">
                      <div className="tooltip" data-tip="Modifier le parcours">
                        <Link
                          className="btn btn-ghost btn-xs btn-square"
                          to={`edit/${item.id}`}
                          aria-label="modifier le parcours"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </div>
                    </PermissionGuard>
                  </div>
                  <div
                    className="w-6 h-6 text-error"
                    aria-label="suppression du parcours"
                  >
                    <PermissionGuard action="delete" object="parcours">
                      <div
                        className="tooltip flex-items-center"
                        data-tip="Supprimer le parcours"
                      >
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs btn-square text-error"
                          onClick={() => handleDeleteParcours(item)}
                          aria-label="Supprimer le parcours"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </PermissionGuard>
                  </div>
                  <div className="w-6 h-6">
                    <PermissionGuard action="read" object="parcours">
                      <div
                        className="tooltip tooltip-left"
                        data-tip="Aperçu du parcours"
                      >
                        <Link
                          className="btn btn-ghost btn-xs btn-square text-primary"
                          to={`view/${item.id}`}
                          aria-label="Aperçu du parcours"
                        >
                          <ExternalLink className="h-4 w-4" />
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
    <Wrapper>
      {props.children}
      <div className="w-full min-h-[50%] flex justify-center items-center text-xs lg:text-sm">
        {parcoursList && parcoursList.length > 0 ? (
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
                <th>Etat</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>{content}</tbody>
          </TableWrapper>
        ) : (
          <ElementNotFound message="Aucun parcours trouvé." />
        )}
      </div>
    </Wrapper>
  );
};

export default ParcoursTable;
