import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router";
import {
  RowSelectionState,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";

import Group from "../../../utils/interfaces/group";
import { useGroupActions } from "../hooks/useGroupActions";
import { getGroupColumns } from "../components/group-table-columns";

import PageHeader from "../../../components/headers/PageHeader";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import BoxWrapper from "../../../../src/components/wrappers/BoxWrapper";
import MultiCriteriaSearch from "../../../components/UI/multi-criteria-search";
import useTablePaginatedData from "../../../components/table/hooks/useTablePaginatedData";
import { DataTable } from "../../../components/table/DataTable";
import TablePagination from "../../../components/table/TablePagination";
import TableActionsButtons from "../../../components/table/TableActionsButtons";
import TableActionsModal from "../../../components/table/TableActionsModal";
import { groupsPageTourSteps } from "../../../components/headers/page-tour-steps";
import ParcoursFilterBadges from "../../../components/UI/parcours-filter-badges";
import { dashboardAdminApi } from "../../dashboard-admin/api/dashboard-admin.api";

const GroupList = () => {
  const { state } = useLocation();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedParcours, setSelectedParcours] = useState<string | null>(
    null,
  );
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

  const { data: formations = [] } = useQuery({
    queryKey: ["root-parcours"],
    queryFn: dashboardAdminApi.queries.getRootParcours,
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

  const parcours = useMemo(
    () =>
      formations.flatMap((formation) =>
        formation.parcours.map(({ title }) => title),
      ),
    [formations],
  );
  const filteredData = useMemo(
    () =>
      selectedParcours === null
        ? data
        : data.filter(
            (group) =>
              group.formation === selectedParcours ||
              group.formation?.endsWith(` - ${selectedParcours}`),
          ),
    [data, selectedParcours],
  );

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
        tourSteps={groupsPageTourSteps}
      >
        <PermissionGuard object="group" action="write">
          <Link className="btn btn-primary btn-soft" to="/admin/group/add">
            <PlusCircle className="mr-2 h-5 w-5" />
            Créer un nouveau groupe
          </Link>
        </PermissionGuard>
      </PageHeader>

      <div className="mb-4">
        <ParcoursFilterBadges
          parcours={parcours}
          selectedParcours={selectedParcours}
          onSelect={(value) => {
            setSelectedParcours(value);
            setRowSelection({});
          }}
        />
      </div>

      <BoxWrapper
        className={`${filteredData.length > 0 || isLoading || searchValue ? "px-10" : ""} items-center`}
        unstyled={!isLoading && filteredData.length === 0 && !searchValue}
      >
        {isLoading || filteredData.length > 0 || searchValue ? (
          <div className="w-full" data-page-tour="filters">
            <MultiCriteriaSearch
              value={searchValue ?? ""}
              onChange={onSubmitSearchValue}
              placeholder="Rechercher un groupe"
              criteria={["nom"]}
              actions={
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
                  onRetreiveItemsValues
                }
                />
              }
            />
          </div>
        ) : null}

        <div className="w-full" data-page-tour="table">
          <DataTable
            columns={columns}
            data={filteredData}
            isLoading={isLoading}
            isSearching={Boolean(searchValue)}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            sorting={sorting}
            setSorting={handleSortingChange}
            emptyMessage={
              searchValue
                ? "Aucun groupe disponible pour cette recherche"
                : "Aucun groupe disponible"
            }
          />
        </div>

        {filteredData.length > 0 ? (
          <div className="w-full mt-5" data-page-tour="pagination">
            <TablePagination
              leftText={`Groupes : ${totalItems}`}
              {...pagination}
            />
          </div>
        ) : null}
      </BoxWrapper>

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
