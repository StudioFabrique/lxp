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
import toast from "react-hot-toast";
import { useEffect } from "react";
import useTableCheckbox from "../../components/table/table-list/hooks/use-table-checkbox";
import useGroupActions from "./hooks/use-group-actions";
import TableActionsButtons from "../../components/table/table-buttons/table-actions-buttons";

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

  const { idsList, ...checkboxConfig } = useTableCheckbox(data, "_id");

  const { onDeleteSelectedGroups } = useGroupActions(idsList, onRefreshData);

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

      {/*
       * Tableau generique utilisé pour la liste des groupes,
       * utilisation du pattern composition
       */}
      <Table
        searchBarConfig={searchBarConfig(onSubmitSearchValue)}
        listConfig={listConfig(data, isLoading, actionsConfig(onRefreshData))}
        checkboxConfig={checkboxConfig}
      >
        {[
          // top
          <TableActionsButtons
            key={0}
            isLoading={isLoading}
            isDisabled={!(idsList.length > 0)} // disabled si la liste a une longueur de 0
            onRefreshData={onRefreshData}
            onDeleteUsers={onDeleteSelectedGroups}
          />,
          // bottom
          <TablePagination key={1} {...pagination} />,
        ]}
      </Table>
    </div>
  );
};

export default GroupHome;
