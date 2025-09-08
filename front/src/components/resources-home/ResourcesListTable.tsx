import { Link } from "react-router-dom";
import { localeDate } from "../../helpers/locale-date";
import { truncateText } from "../../helpers/truncate-text";
import { ResourceListItem } from "../../views/resources/hooks/useResources";
import TableRowWrapper from "../UI/table-row-wrapper";
import { EditIcon, Trash2Icon } from "lucide-react";
import ArrowTopRightIcon from "../UI/svg/arrow-top-right-icon";
import Wrapper from "../UI/wrapper/wrapper.component";
import ElementNotFound from "../UI/element-not-found";
import SortColumnIcon from "../UI/sort-column-icon.component/sort-column-icon.component";
import TableWrapper from "../UI/table-wrapper";

type Props = {
  resourcesList: ResourceListItem[];
  fieldSort: string;
  direction: boolean;
  onSorting: (property: string) => void;
  onDeleteResource: (resource: ResourceListItem) => void;
  loading: boolean;
};

export default function ResourcesListTable({
  resourcesList,
  fieldSort,
  direction,
  onSorting,
}: // onDeleteResource,
//loading,
Props) {
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

              <td className="bg-transparent truncate">
                {localeDate(item.createdAt!)}
              </td>

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
                      to={`edit/${item.id}`}
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
                      <div className="cursor-pointer" onClick={() => {}}>
                        <Trash2Icon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="w-4 h-4">
                    <div
                      className="tooltip tooltip-bottom"
                      data-tip="Aperçu de la ressource"
                    >
                      <Link
                        className="text-primary w-4"
                        to={`view/${item.id}`}
                        aria-label="Aperçu de la ressource"
                      >
                        <ArrowTopRightIcon />
                      </Link>
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
        {resourcesList && resourcesList.length > 0 ? (
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
        ) : (
          <ElementNotFound message="Aucun parcours trouvé." />
        )}
      </div>
    </Wrapper>
  );
}
