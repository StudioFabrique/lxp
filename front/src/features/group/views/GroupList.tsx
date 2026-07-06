import { Link, useLocation } from "react-router";
import {
  actionsConfig,
  groupListConfig,
  searchBarConfig,
} from "./group-list-config";
import toast from "react-hot-toast";
import { useEffect } from "react";
import useGroupActions from "../hooks/use-group-actions";
import { PlusCircle } from "lucide-react";
import useTablePaginatedData from "../../../components/table/table-pagination/hooks/use-table-paginated-data";
import Group from "../../../utils/interfaces/group";
import useTableCheckbox from "../../../components/table/table-list/hooks/use-table-checkbox";
import PageHeader from "../../../components/headers/PageHeader";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import Table from "../../../components/table/table";
import TableActionsButtons from "../../../components/table/table-buttons/table-actions-buttons";
import TablePagination from "../../../components/table/table-pagination/table-pagination";

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
const GroupList = () => {
  const { state } = useLocation();

  // custom hook gestion pagination
  const {
    data,
    searchValue,
    isLoading,
    totalItems,
    sortProperty,
    isAscDirection,
    onRefreshData,
    onSubmitSearchValue,
    onSortProperty,
    ...pagination
  } = useTablePaginatedData<Group>("/group/student", {
    apiSearchEndpoint: "/group/search/student",
    searchProperty: "name",
  });

  // custom hook gestion checkbox
  const {
    idsList,
    onRetreiveItemsValuesByPropertyFromIdList,
    ...checkboxConfig
  } = useTableCheckbox<Group>(data, "_id");

  // custom hook gestion actions groupées
  const { onDeleteSelectedGroups } = useGroupActions(idsList, onRefreshData);

  // Si un message du state est présent, alors il s'affiche dans un toaster
  useEffect(() => {
    if (state?.toastFrom) toast.success(state.toastFrom);
  }, [state]);

  return (
    <div>
      {/* Header de la liste des groupes */}
      <PageHeader
        title="Liste des groupes"
        description="Créer, modifier et supprimer des groupes"
      >
        <PermissionGuard object="group" action="write">
          <Link className="btn btn-primary btn-soft" to="/admin/group/add">
            <PlusCircle />
            Créer un nouveau groupe
          </Link>
        </PermissionGuard>
      </PageHeader>

      {/*
       * Tableau generique utilisé pour la liste des groupes,
       * utilisation du pattern composition
       */}
      <Table
        searchBarConfig={searchBarConfig(onSubmitSearchValue)}
        tableListConfig={groupListConfig(
          data,
          isLoading,
          Boolean(searchValue),
          actionsConfig(onRefreshData),
        )}
        checkboxConfig={checkboxConfig}
        sortConfig={{ sortProperty, isAscDirection, onSortProperty }}
      >
        {/* Composants children en haut et en bas du tableau */}
        {[
          // haut du tableau, à côté de la barre de recherche
          <TableActionsButtons
            key={0}
            isLoading={isLoading}
            isDisabled={!(idsList.length > 0)} // disabled si la liste a une longueur de 0
            onRefreshData={onRefreshData}
            actions={[
              {
                title: "Supprimer les groupes selectionnés",
                description: `${idsList.length} ${
                  idsList.length > 1
                    ? "groupes vont être supprimés"
                    : "groupe va être supprimé"
                }`,
                rightButtonTitle: "Supprimer",
                onConfirm: onDeleteSelectedGroups,
              },
            ]}
            retreiveItemsProperty="name"
            onRetreiveItemsValuesByPropertyFromIdList={
              onRetreiveItemsValuesByPropertyFromIdList
            }
          />,
          // bas du tableau
          <TablePagination
            key={1}
            leftText={`Groupes : ${totalItems}`}
            {...pagination}
          />,
        ]}
      </Table>
    </div>
  );
};

export default GroupList;
