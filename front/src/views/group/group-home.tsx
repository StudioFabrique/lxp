import { Link } from "react-router-dom";
import Can from "../../components/UI/can/can.component";
import Header from "../../components/UI/header";
import { groupHomeTableItems } from "./group-home-table-config";
import { Pen, Trash2 } from "lucide-react";
import { TableListActionConfig } from "../../components/table/table-list/interfaces/table-list-action";
import Table from "../../components/table/table";
import TablePagination from "../../components/table/table-pagination/table-pagination";
import useTablePaginatedData from "../../components/table/table-pagination/hooks/use-table-paginated-data";
import { SearchBarProps } from "../../components/UI/search-bar/search-bar";
import { TableListProps } from "../../components/table/table-list/table-list";
import Group from "../../utils/interfaces/group";
import TableButtons from "../../components/table/table-buttons/table-buttons";

const GroupHome = () => {
  const { data, onRefreshData, isLoading, ...pagination } =
    useTablePaginatedData("/group/student/name/asc");

  const actions: TableListActionConfig[] = [
    {
      property: "edit",
      type: "link",
      tooltip: "Modifier",
      icon: Pen,
      additionnalClassname: "btn-ghost",
      request: { path: "edit/[:id]", method: "get" },
    },
    {
      property: "delete",
      type: "button",
      tooltip: "Supprimer",
      icon: Trash2,
      additionnalClassname: "btn-ghost text-error",
      onSuccessfulSubmit: onRefreshData,
    },
  ];

  const searchBarConfig: SearchBarProps = {
    title: "Groupes",
    placeholder: "Rechercher un groupe",
    // actions: [],
  };

  const listConfig: TableListProps<Group> = {
    idProperty: "_id",
    avatar: { property: "avatar" },
    data: data,
    tableItemsConfig: groupHomeTableItems,
    actionsItems: actions,
    style: {
      showCheckbox: true,
      showAvatar: true,
      emptyArrayMessage: isLoading
        ? "Chargement des groupes..."
        : "Aucun groupe disponible",
    },
  };

  return (
    <div className="flex flex-col gap-5 p-10">
      <Header
        title="Liste des groupes"
        description="Créer, modifier et supprimer des groupes"
      >
        <Can action="write" object="user">
          <Link className="btn btn-primary" to="/admin/group/add">
            Créer un groupe
          </Link>
        </Can>
      </Header>
      <Table searchBar={searchBarConfig} list={listConfig}>
        {[
          // top
          <TableButtons
            key={0}
            isLoading={isLoading}
            onRefreshData={onRefreshData}
          />,
          // bottom
          <TablePagination key={1} {...pagination} />,
        ]}
      </Table>
    </div>
  );
};

export default GroupHome;
