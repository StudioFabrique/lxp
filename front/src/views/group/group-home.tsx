import { Link, useLocation } from "react-router-dom";
import Can from "../../components/UI/can/can.component";
import Header from "../../components/UI/header";
import {
  actionsConfig,
  tableListConfig,
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
import type Group from "../../utils/interfaces/group";
import { PlusCircle } from "lucide-react";

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
    <>
      {/* Header de la liste des groupes */}
      <Header
        title="Liste des groupes"
        description="Créer, modifier et supprimer des groupes"
      >
        <Can object="group" action="write">
          <Link className="btn btn-primary text-base-100" to="/admin/group/add">
            <PlusCircle />
            Créer un nouveau groupe
          </Link>
        </Can>
      </Header>

      {/*
       * Tableau generique utilisé pour la liste des groupes,
       * utilisation du pattern composition
       */}
      <Table
        searchBarConfig={searchBarConfig(onSubmitSearchValue)}
        tableListConfig={tableListConfig(
          data,
          isLoading,
          Boolean(searchValue),
          actionsConfig(onRefreshData)
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
            leftText={`Nombre de groupes : ${totalItems}`}
            {...pagination}
          />,
        ]}
      </Table>
    </>
  );
};

export default GroupHome;
