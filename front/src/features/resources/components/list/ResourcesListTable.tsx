import React, { ReactNode } from "react";
import { Link } from "react-router";
import { truncateText } from "../../../../utils/helpers/truncate-text";
import TableRowWrapper from "../../../../components/UI/table-row-wrapper";
import { EditIcon, Trash2Icon } from "lucide-react";
import Wrapper from "../../../../components/wrappers/BoxWrapper";
import SortColumnIcon from "../../../../components/UI/sort-column-icon/sort-column-icon";
import TableWrapper from "../../../../components/UI/table-wrapper";
import { ResourceListItem } from "../../views/ResourcesHome";

type Props = {
  children: ReactNode;
  resourcesList: ResourceListItem[];
  fieldSort: string;
  direction: boolean;
  onSorting: (property: string) => void;
  onDeleteResource: (resource: ResourceListItem) => void;
  loading: boolean;
};

export default function ResourcesListTable({
  children,
  resourcesList,
  fieldSort,
  direction,
  onSorting,
  onDeleteResource,
}: // onDeleteResource,
//loading,
Props) {
  // Defensive: if resourcesList is not an array treat as empty
  const list = Array.isArray(resourcesList) ? resourcesList : [];

  // If no data, render the provided children (fallback UI) if valid
  if (list.length === 0) {
    // If children is a valid React node, render it, otherwise render null
    return (
      <>
        {React.isValidElement(children) || typeof children === "string"
          ? children
          : null}
      </>
    );
  }

  const deleteRsource = (resource: ResourceListItem) => {
    onDeleteResource(resource);
  };

  const content = (
    <>
      {resourcesList && resourcesList.length > 0 ? (
        <>
          {resourcesList.map((item: ResourceListItem) => (
            <TableRowWrapper key={item.id}>
              <td className="bg-transparent rounded-l-lg">
                <p className="tooltip tooltip-bottom" data-tip={item.title}>
                  {truncateText(item.title, 30)}
                </p>
              </td>

              <td className="bg-transparent truncate">{item.createdAt!}</td>

              <td className="bg-transparent capitalize">
                <p className="tooltip tooltip-bottom" data-tip={item.author}>
                  {truncateText(item.author, 20)}
                </p>
              </td>

              <td className="bg-transparent rounded-r-lg h-full">
                <div className="flex items-center justify-around gap-x-2 h-full">
                  <div
                    className="tooltip tooltip-bottom"
                    data-tip="Modifier la ressource"
                  >
                    <Link
                      className="text-primary"
                      to={`add/${item.id}`}
                      aria-label="modifier la ressource"
                    >
                      <EditIcon className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="w-4 h-4 text-error">
                    <div
                      className="tooltip tooltip-bottom flex-items-center"
                      data-tip="Supprimer la ressource"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => deleteRsource(item)}
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </div>
                    </div>
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
      <div className="w-full flex justify-center items-center text-xs lg:text-sm">
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
        </TableWrapper>
      </div>
    </Wrapper>
  );
}
