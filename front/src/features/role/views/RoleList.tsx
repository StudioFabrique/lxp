import { useMemo, useState, useCallback } from "react";
import { RowSelectionState } from "@tanstack/react-table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../../../lib/axios";

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
      const path = isSearching
        ? `/permission/search/role/${searchValue}`
        : "/permission/role";
      const res = await apiClient.get(path);
      return res.data.data as RoleCounts[];
    },
  });

  const data = rawData ?? [];

  const refreshAndClearSelection = () => {
    setRowSelection({});
    refetch();
  };

  const { onDeleteSelected, onDeleteOne, isDeleting } = useRoleActions(
    refreshAndClearSelection,
  );

  const roleToDelete = useMemo(
    () => data.find((r) => r._id === idToDelete),
    [data, idToDelete],
  );

  const columns = useMemo(() => getRoleColumns((id) => setIdToDelete(id)), []);

  const onRetreiveItemsValues = (property: keyof RoleCounts) =>
    data
      .filter((item) => item._id && rowSelection[item._id])
      .map((item) => String(item[property]));

  const handleConfirmSingleDelete = async () => {
    if (idToDelete) {
      await onDeleteOne(idToDelete);
      setIdToDelete(null);
    }
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
      />

      <Wrapper additionalClassname="px-10 items-center">
        <SearchBar
          title=""
          placeholder="Rechercher un rôle"
          onSubmitSearchValue={(value) => {
            setSearchValue(value.length > 0 ? value : null);
          }}
        >
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
        </SearchBar>

        <DataTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          emptyMessage={
            isSearching
              ? "Aucun rôle ne correspond à votre recherche"
              : "Aucun rôle créé"
          }
        />

        <div className="w-full mt-2 text-sm text-base-content/60">
          Total : {data.length} rôle(s)
        </div>
      </Wrapper>

      <div className="mt-6">
        <RoleForm onRoleCreated={handleRoleCreated} />
      </div>

      <TableActionsModal
        isOpen={!!idToDelete}
        onCancel={() => setIdToDelete(null)}
        title="Confirmation de suppression"
        description="Êtes-vous sûr de vouloir supprimer ce rôle ?"
        descList={roleToDelete ? [roleToDelete.label] : undefined}
      >
        <button
          className={`btn btn-error btn-md ${isDeleting ? "loading" : ""}`}
          onClick={handleConfirmSingleDelete}
          disabled={isDeleting}
        >
          Confirmer
        </button>
      </TableActionsModal>
    </div>
  );
};

export default RoleList;
