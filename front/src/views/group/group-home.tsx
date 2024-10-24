import { Link, useLocation } from "react-router-dom";
import Can from "../../components/UI/can/can.component";
import Header from "../../components/UI/header";
import { groupHomeTableItems } from "./group-home-table-config";
import { Pen, Trash2 } from "lucide-react";
import { TableListActionConfig } from "../../components/table/table-list/interfaces/table-list-action";
import Table from "../../components/table/table";
import TablePagination from "../../components/table/table-pagination/table-pagination";
import useTablePaginatedData from "../../components/table/table-pagination/hooks/use-table-paginated-data";
import TableButtons from "../../components/table/table-buttons/table-buttons";
import toast from "react-hot-toast";
import { useEffect } from "react";

const GroupHome = () => {
  const { state } = useLocation();

  const { data, onRefreshData, isLoading, onSubmitSearchValue, ...pagination } =
    useTablePaginatedData("/group/student", "/group/search/student");

  const actions: TableListActionConfig[] = [
    {
      property: "invite",
      additionnalClassname: "btn-success",
      label: "Inviter les utilisateurs",
      title: "Inviter",
      type: "button",
      // request: { path: "/group/invite/[:id]", method: "post" },
      // onSuccessfulSubmit: onRefreshData,
    },
    {
      property: "edit",
      type: "link",
      tooltip: "Modifier",
      icon: Pen,
      additionnalClassname: "btn-ghost",
      request: { path: "edit/[:id]" },
    },
    {
      property: "delete",
      type: "button",
      tooltip: "Supprimer",
      icon: Trash2,
      additionnalClassname: "btn-ghost text-error",
      request: { path: "/group/[:id]", method: "delete" },
      onSuccessfulSubmit: onRefreshData,
    },
  ];

  useEffect(() => {
    if (state && state.toastFrom) toast.success(state.toastFrom);
  }, [state]);

  return (
    <div className="flex flex-col gap-10 p-10 h-screen">
      {/* Header de la liste des groupes */}
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

      {/* Tableau liste des groupes */}
      <Table
        searchBar={{
          title: "Groupes",
          placeholder: "Rechercher un groupe",
          onSubmitSearchValue: onSubmitSearchValue,
        }}
        list={{
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
        }}
      >
        {[
          // top
          <TableButtons
            key={0}
            isLoading={isLoading}
            onRefreshData={onRefreshData}
            onDeleteUsers={onRefreshData}
          />,
          // bottom
          <TablePagination key={1} {...pagination} />,
        ]}
      </Table>
    </div>
  );
};

export default GroupHome;
