import RoleForm from "../../components/role/role-form/role-form";
import useTablePaginatedData from "../../components/table/table-pagination/hooks/use-table-paginated-data";
import Role from "../../utils/interfaces/role";
import useTableCheckbox from "../../components/table/table-list/hooks/use-table-checkbox";
import Header from "../../components/UI/header";
import Table from "../../components/table/table";
import {
  actionsConfig,
  searchBarConfig,
  tableListConfig,
} from "./role-table-config";
import TableActionsButtons from "../../components/table/table-buttons/table-actions-buttons";
import useRoleActions from "./hooks/use-role-actions";
import CSVDownloader from "../../components/UI/csv-downloader/csv-downloader";
import { transformRolesCsv } from "../../utils/csv/csv-data-transform";
import { Ref, useRef } from "react";

/**
 * Composant Role
 *
 * Affiche un formulaire et une liste de roles avec des fonctionnalités pour créer,
 * modifier et supprimer des groupes. Utilise un tableau paginé pour
 * présenter les données, avec une barre de recherche intégrée.
 *
 * @component
 */
const RolePage = () => {
  // custom hook gestion pagination
  const {
    data,
    isLoading,
    sortProperty,
    isAscDirection,
    onRefreshData,
    onSubmitSearchValue,
    onSortProperty,
  } = useTablePaginatedData<Role>(
    "/permission/role",
    { apiSearchEndpoint: "/permission/search", searchProperty: "role" },
    {
      disablePagination: true,
      disableSort: true,
    },
  );

  // custom hook gestion checkbox
  const {
    idsList,
    onRetreiveItemsValuesByPropertyFromIdList,
    onRetreiveItemsFromIdList,
    ...checkboxConfig
  } = useTableCheckbox<Role>(data, "_id");

  // custom hook gestion actions groupées
  const { onDeleteSelectedRoles } = useRoleActions(idsList, onRefreshData);

  return (
    <div className="flex flex-col gap-y-5 p-10">
      {/* Header de la liste des groupes */}
      <Header title="Liste des rôles" />

      <div className="grid grid-cols-2 gap-5">
        <div className="h-fit">
          <CSVDownloader
            data={transformRolesCsv(onRetreiveItemsFromIdList())}
          />
          <RoleForm onRefreshData={onRefreshData} />
        </div>

        {/*
         * Tableau generique utilisé pour la liste des groupes,
         * utilisation du pattern composition
         */}
        <Table
          searchBarConfig={searchBarConfig(onSubmitSearchValue)}
          tableListConfig={tableListConfig(
            data,
            isLoading,
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
                  title: "Exporter les rôles sélectionnés",
                  description: "Exporter les rôles suivants en format csv",
                  rightButtonTitle: "Exporter",
                  onConfirm: async () => {},
                },
                {
                  title: "Supprimer les rôles selectionnés",
                  description: `${idsList.length} ${idsList.length > 1 ? "rôles vont être supprimés" : "rôle va être supprimé"}`,
                  rightButtonTitle: "Confirmer",
                  alertMessageBottom:
                    "Attention: Cette opération ne peut pas être annulée",
                  onConfirm: onDeleteSelectedRoles,
                },
              ]}
              retreiveItemsProperty="role"
              onRetreiveItemsValuesByPropertyFromIdList={
                onRetreiveItemsValuesByPropertyFromIdList
              }
            />,
          ]}
        </Table>
      </div>
    </div>
  );
};

export default RolePage;
