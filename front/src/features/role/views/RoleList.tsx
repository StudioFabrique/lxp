import { useMemo, useState, useCallback } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { roleApi } from "../api/role.api";

import type { RoleCounts } from "../api/role.api";
import { useRoleActions } from "../hooks/useRoleActions";
import { getRoleColumns } from "../components/role-table-columns";
import RoleForm from "../components/role-form/RoleForm";

import PageHeader from "../../../components/headers/PageHeader";
import Wrapper from "../../../../src/components/wrappers/BoxWrapper";
import { DataTable } from "../../../components/table/DataTable";
import TableActionsButtons from "../../../components/table/TableActionsButtons";
import TableActionsModal from "../../../components/table/TableActionsModal";
import SearchBar from "../../../components/UI/search-bar/search-bar";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import { rolesPageTourSteps } from "../../../components/headers/page-tour-steps";

const RoleList = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const idsList = Object.keys(rowSelection);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const isSearching = searchValue !== null && searchValue.length > 0;

  const {
    data: rawData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["roles", searchValue],
    queryFn: async () => {
      return (await roleApi.queries.listRoles(
        isSearching ? searchValue : undefined,
      )) as RoleCounts[];
    },
  });

  const data = rawData ?? [];

  const refreshAndClearSelection = () => {
    setRowSelection({});
    refetch();
  };

  const {
    onDeleteSelected,
    onDeleteOne,
    isDeleting,
    deleteError,
    resetDeleteError,
  } = useRoleActions(refreshAndClearSelection);

  const roleToDelete = useMemo(
    () => data.find((r) => r._id === idToDelete),
    [data, idToDelete],
  );

  const columns = useMemo(
    () =>
      getRoleColumns((id) => {
        resetDeleteError();
        setIdToDelete(id);
      }),
    [resetDeleteError],
  );

  const onRetreiveItemsValues = (property: keyof RoleCounts) =>
    data
      .filter((item) => item._id && rowSelection[item._id])
      .map((item) => String(item[property]));

  const handleConfirmSingleDelete = async () => {
    if (idToDelete) {
      try {
        await onDeleteOne(idToDelete);
        setIdToDelete(null);
      } catch {
        // Le toast et la modale affichent le message porté par la mutation.
      }
    }
  };

  const handleCancelSingleDelete = () => {
    setIdToDelete(null);
    resetDeleteError();
  };

  const handleRoleCreated = useCallback(() => {
    toast.success("Rôle créé avec succès");
    refreshAndClearSelection();
    queryClient.invalidateQueries({ queryKey: ["/auth/roles"] });
  }, [refreshAndClearSelection, queryClient]);

  return (
    <div>
      <PageHeader
        title="Liste des rôles"
        description="Créer et gérer des rôles, les droits et les permissions des utilisateurs"
        tourSteps={rolesPageTourSteps}
      />

      <Wrapper
        additionalClassname={`${data.length > 0 || isLoading ? "px-10" : ""} items-center`}
        unstyled={!isLoading && data.length === 0}
      >
        {isLoading || data.length > 0 || isSearching ? (
          <div className="w-full" data-page-tour="filters">
            <SearchBar
              placeholder="Rechercher un rôle"
              onSubmitSearchValue={(value) => {
                setSearchValue(value.length > 0 ? value : null);
              }}
            >
              <PermissionGuard action="delete" object="role">
                <TableActionsButtons
                  isLoading={isLoading || isDeleting}
                  isDisabled={idsList.length === 0}
                  onRefreshData={refetch}
                  actions={[
                    {
                      title: "Supprimer les rôles sélectionnés",
                      description: `${idsList.length} rôle(s) vont être supprimé(s)`,
                      rightButtonTitle: "Confirmer",
                      alertMessageBottom:
                        "Attention: Cette opération ne peut pas être annulée",
                      onConfirm: () => onDeleteSelected(idsList),
                    },
                  ]}
                  retreiveItemsProperty="role"
                  onRetreiveItemsValuesByPropertyFromIdList={
                    onRetreiveItemsValues as any
                  }
                />
              </PermissionGuard>
            </SearchBar>
          </div>
        ) : null}

        <div className="w-full" data-page-tour="table">
          <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            emptyMessage={
              isSearching
                ? "Aucun rôle disponible pour cette recherche"
                : "Aucun rôle disponible"
            }
          />
        </div>

        {data.length > 0 ? (
          <div className="w-full mt-2 text-sm text-base-content/60">
            Total : {data.length} rôle(s)
          </div>
        ) : null}
      </Wrapper>

      <div data-page-tour="role-form">
        <PermissionGuard action="write" object="role">
          <div className="mt-6">
            <RoleForm onRoleCreated={handleRoleCreated} />
          </div>
        </PermissionGuard>
      </div>

      <PermissionGuard action="delete" object="role">
        <TableActionsModal
          isOpen={!!idToDelete}
          onCancel={handleCancelSingleDelete}
          title="Confirmation de suppression"
          description="Êtes-vous sûr de vouloir supprimer ce rôle ?"
          descList={roleToDelete ? [roleToDelete.label] : undefined}
          error={deleteError}
        >
          <button
            className={`btn btn-error btn-md ${isDeleting ? "loading" : ""}`}
            onClick={handleConfirmSingleDelete}
            disabled={isDeleting}
          >
            Confirmer
          </button>
        </TableActionsModal>
      </PermissionGuard>
    </div>
  );
};

export default RoleList;
