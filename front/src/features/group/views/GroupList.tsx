import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router";
import {
  RowSelectionState,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";

import Group from "../../../utils/interfaces/group";
import { useGroupActions } from "../hooks/useGroupActions";
import { getGroupColumns } from "../components/group-table-columns";

import PageHeader from "../../../components/headers/PageHeader";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import Wrapper from "../../../../src.legacy/components/UI/wrapper/wrapper.component";
import SearchBar from "../../../../src.legacy/components/UI/search-bar/search-bar";
import useTablePaginatedData from "../../../components/table/hooks/useTablePaginatedData";
import { DataTable } from "../../../components/table/DataTable";
import TablePagination from "../../../components/table/TablePagination";
import TableActionsButtons from "../../../components/table/TableActionsButtons";
import TableActionsModal from "../../../components/table/TableActionsModal";

const GroupList = () => {
  const { state } = useLocation();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const idsList = Object.keys(rowSelection);

  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  const {
    data,
    isLoading,
    searchValue,
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

  const refreshAndClearSelection = () => {
    setRowSelection({});
    onRefreshData();
  };

  const { onDeleteSelected, onDeleteOne, isDeleting } = useGroupActions(
    refreshAndClearSelection,
  );

  const groupToDelete = useMemo(
    () => data.find((g) => g._id === idToDelete),
    [data, idToDelete],
  );

  const sorting: SortingState = sortProperty
    ? [{ id: sortProperty, desc: !isAscDirection }]
    : [];

  const handleSortingChange = (updater: Updater<SortingState>) => {
    const newSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    if (newSorting.length > 0) onSortProperty(newSorting[0].id);
  };

  const onRetreiveItemsValues = (property: keyof Group) =>
    data
      .filter((item) => item._id && rowSelection[item._id])
      .map((item) => String(item[property]));

  const columns = useMemo(() => getGroupColumns((id) => setIdToDelete(id)), []);

  useEffect(() => {
    if (state?.toastFrom) toast.success(state.toastFrom);
  }, [state]);

  // Fonction pour exécuter la suppression unique
  const handleConfirmSingleDelete = async () => {
    if (idToDelete) {
      await onDeleteOne(idToDelete);
      setIdToDelete(null); // On ferme la modale après succès
    }
  };

  return (
    <div>
      <PageHeader
        title="Liste des groupes"
        description="Créer, modifier et supprimer des groupes"
      >
        <PermissionGuard object="group" action="write">
          <Link className="btn btn-primary btn-soft" to="/admin/group/add">
            <PlusCircle className="mr-2 h-5 w-5" />
            Créer un nouveau groupe
          </Link>
        </PermissionGuard>
      </PageHeader>

      <Wrapper additionalClassname="px-10 items-center">
        <SearchBar
          title="Groupes"
          placeholder="Rechercher un groupe"
          onSubmitSearchValue={onSubmitSearchValue}
        >
          <TableActionsButtons
            isLoading={isLoading || isDeleting}
            isDisabled={idsList.length === 0}
            onRefreshData={onRefreshData}
            actions={[
              {
                title: "Supprimer les groupes sélectionnés",
                description: `${idsList.length} groupe(s) vont être supprimé(s)`,
                rightButtonTitle: "Supprimer",
                onConfirm: () => onDeleteSelected(idsList),
              },
            ]}
            retreiveItemsProperty="name"
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
          sorting={sorting}
          setSorting={handleSortingChange}
          emptyMessage={
            searchValue ? "Aucun groupe trouvé" : "Aucun groupe disponible"
          }
        />

        <div className="w-full mt-5">
          <TablePagination
            leftText={`Groupes : ${totalItems}`}
            {...pagination}
          />
        </div>
      </Wrapper>

      <TableActionsModal
        isOpen={!!idToDelete}
        onCancel={() => setIdToDelete(null)}
        title="Confirmation de suppression"
        description="Êtes-vous sûr de vouloir supprimer ce groupe ?"
        descList={groupToDelete ? [groupToDelete.name] : undefined}
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

export default GroupList;
