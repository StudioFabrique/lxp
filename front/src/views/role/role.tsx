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
// import { transformRolesCsv } from "../../utils/csv/csv-data-transform";
// import CsvDownloaderWithRef from "../../components/UI/csv-downloader/csv-downloader-with-ref";
// import { Ref, useRef } from "react";

/**
 * Composant Role
 *
 * Affiche un formulaire et une liste de roles avec des fonctionnalités pour créer,
 * modifier et supprimer des rôles. Utilise un tableau paginé pour
 * présenter les données, avec une barre de recherche intégrée.
 *
 * @component
 */
const RolePage = () => {
  // custom hook gestion pagination
  const {
    data,
    searchValue,
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
      invokeErrorToast: true,
    },
  );

  // custom hook gestion checkbox
  const {
    idsList,
    onRetreiveItemsValuesByPropertyFromIdList,
    // onRetreiveItemsFromIdList,
    ...checkboxConfig
  } = useTableCheckbox<Role>(data, "_id");

  // custom hook gestion actions groupées
  const { onDeleteSelectedRoles } = useRoleActions(idsList, onRefreshData);

  // const csvRef: Ref<HTMLButtonElement> = useRef(null);

  return (
    <div className="flex flex-col gap-y-5 p-10">
      {/* Header de la liste des rôles */}
      <Header
        title="Liste des rôles"
        description="Créer et gérer des rôles, les droits et les permissions des
    utilisateurs"
      />

      {/* Balise Csv caché */}
      {/* <CsvDownloaderWithRef
        ref={csvRef}
        className="hidden"
        data={transformRolesCsv(onRetreiveItemsFromIdList())}
      /> */}

      <div className="flex flex-col gap-10">
        {/*
         * Tableau generique utilisé pour la liste des rôles,
         * utilisation du pattern composition
         */}
        <Table
          searchBarConfig={searchBarConfig(onSubmitSearchValue)}
          tableListConfig={tableListConfig(
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
                /* {
                 *   title: "Exporter les rôles sélectionnés",
                 *   description: "Exporter les rôles suivants en format csv",
                 *   rightButtonTitle: "Exporter",
                 *   onConfirm: async () => {
                 *     csvRef.current?.click();
                 *   },
                 * },
                 */
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

        <RoleForm allow2xlScreenFlexCol onRefreshData={onRefreshData} />
      </div>
    </div>
  );
};

export default RolePage;
