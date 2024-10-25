import { Link, useLocation } from "react-router-dom";
import Can from "../../components/UI/can/can.component";
import Header from "../../components/UI/header";
import {
  actionsConfig,
  listConfig,
  searchBarConfig,
} from "./group-home-table-config";
import Table from "../../components/table/table";
import TablePagination from "../../components/table/table-pagination/table-pagination";
import useTablePaginatedData from "../../components/table/table-pagination/hooks/use-table-paginated-data";
import TableButtons from "../../components/table/table-buttons/table-buttons";
import toast from "react-hot-toast";
import { useEffect } from "react";
import useTableCheckbox from "../../components/table/table-list/hooks/use-table-checkbox";

/**
 * Composant GroupHome
 *
 * Affiche une liste de groupes avec des fonctionnalités pour créer,
 * modifier et supprimer des groupes. Utilise un tableau paginé pour
 * présenter les données, avec une barre de recherche intégrée.
 * Gère les notifications toast pour informer l'utilisateur des actions.
 *
 * @component
 */
const GroupHome = () => {
  const { state } = useLocation();

  const { data, onRefreshData, isLoading, onSubmitSearchValue, ...pagination } =
    useTablePaginatedData("/group/student", "/group/search/student");

  const { idsList, resetCheckbox, ...checkboxConfig } = useTableCheckbox(
    data,
    "_id",
  );

  // Si un message du state est présent, alors il s'affiche dans un toaster
  useEffect(() => {
    if (state && state.toastFrom) toast.success(state.toastFrom);
  }, [state]);

  return (
    <div className="flex flex-col gap-10 p-10">
      {/* Header de la liste des groupes */}
      <Header
        title="Liste des groupes"
        description="Créer, modifier et supprimer des groupes"
      >
        <Can object="group" action="write">
          <Link className="btn btn-primary" to="/admin/group/add">
            Créer un groupe
          </Link>
        </Can>
      </Header>

      {/* Tableau liste des groupes */}
      <Table
        searchBarConfig={searchBarConfig(onSubmitSearchValue)}
        listConfig={listConfig(data, isLoading, actionsConfig(onRefreshData))}
        checkboxConfig={checkboxConfig}
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
