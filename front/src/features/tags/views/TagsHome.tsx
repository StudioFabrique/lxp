import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  RowSelectionState,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import { PlusCircle } from "lucide-react";

import type { TagRow } from "../api/tag.api";
import { useTagActions } from "../hooks/useTagActions";
import { getTagColumns } from "../components/tag-table-columns";

import PageHeader from "../../../components/headers/PageHeader";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import Wrapper from "../../../../src/components/wrappers/BoxWrapper";
import SearchBar from "../../../components/UI/search-bar/search-bar";
import Modal from "../../../components/UI/modal/modal";
import TagsHomeAdding from "./TagsHomeAdding";
import TagsHomeEditing from "./TagsHomeEditing";
import useTablePaginatedData from "../../../components/table/hooks/useTablePaginatedData";
import { DataTable } from "../../../components/table/DataTable";
import TablePagination from "../../../components/table/TablePagination";
import TableActionsButtons from "../../../components/table/TableActionsButtons";
import TableActionsModal from "../../../components/table/TableActionsModal";
import { tagsPageTourSteps } from "../../../components/headers/page-tour-steps";

const TagsHome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("editId");
  const isModalOpen = searchParams.has("openModal");

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [canSubmitTags, setCanSubmitTags] = useState(false);
  const idsList = Object.keys(rowSelection);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

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
  } = useTablePaginatedData<TagRow>("/tag/paginate", {
    apiSearchEndpoint: "/tag/paginate-search",
    searchProperty: "name",
  });

  const refreshAndClearSelection = () => {
    setRowSelection({});
    onRefreshData();
  };

  const {
    onDeleteSelected,
    onDeleteOne,
    onCreateTags,
    onEditTag,
    isDeleting,
    isSubmitting,
  } = useTagActions(refreshAndClearSelection);

  const handleDismissModal = () => {
    setCanSubmitTags(false);
    navigate(".", { replace: true });
  };

  const tagToDelete = useMemo(
    () => data.find((t) => t.id === idToDelete),
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

  const columns = useMemo(() => getTagColumns((id) => setIdToDelete(id)), []);

  const onRetreiveItemsValues = (property: keyof TagRow) =>
    data
      .filter((item) => item.id !== undefined && rowSelection[String(item.id)])
      .map((item) => String(item[property]));

  const handleConfirmSingleDelete = async () => {
    if (idToDelete !== null) {
      await onDeleteOne(idToDelete);
      setIdToDelete(null);
    }
  };

  return (
    <div>
      {isModalOpen && (
        <Modal
          title={editId ? "Modification du tag" : "Création des tags"}
          leftLabel="Annuler"
          onLeftClick={handleDismissModal}
          rightLabel="Valider"
          onRightClick={() => {
            const btn = document.getElementById(
              "modal-submit-btn",
            ) as HTMLButtonElement | null;
            btn?.click();
          }}
          isSubmitting={isSubmitting}
          rightDisabled={!editId && !canSubmitTags}
        >
          {editId ? (
            <TagsHomeEditing
              tag={
                data.find((t) => t.id === +editId) ?? {
                  id: +editId,
                  name: "",
                  color: "",
                }
              }
              onSubmitTag={(id, name) => {
                onEditTag(id, name);
                handleDismissModal();
              }}
            />
          ) : (
            <TagsHomeAdding
              onCanSubmitChange={setCanSubmitTags}
              onSubmitAllTags={async (tags) => {
                try {
                  await onCreateTags(
                    tags.map((t) => ({ name: t.name, color: t.color })),
                  );
                  handleDismissModal();
                } catch {
                  // La mutation affiche l'erreur et garde la modale ouverte.
                }
              }}
            />
          )}
        </Modal>
      )}

      <PageHeader
        title="Liste des tags"
        description="Créer, modifier et supprimer des tags"
        tourSteps={tagsPageTourSteps}
      >
        <PermissionGuard object="tag" action="write">
          <Link className="btn btn-primary btn-soft" to="?openModal=true">
            <PlusCircle className="mr-2 h-5 w-5" />
            Créer un nouveau tag
          </Link>
        </PermissionGuard>
      </PageHeader>

      <Wrapper additionalClassname="px-10 items-center">
        <div className="w-full" data-page-tour="filters">
          <SearchBar
            title="Tags"
            placeholder="Rechercher un tag"
            onSubmitSearchValue={onSubmitSearchValue}
          >
            <TableActionsButtons<TagRow>
              isLoading={isLoading || isDeleting}
              isDisabled={idsList.length === 0}
              onRefreshData={onRefreshData}
              actions={[
                {
                  title: "Supprimer les tags sélectionnés",
                  description: `${idsList.length} tag(s) vont être supprimé(s)`,
                  rightButtonTitle: "Supprimer",
                  onConfirm: () => onDeleteSelected(idsList),
                },
              ]}
              retreiveItemsProperty="name"
              onRetreiveItemsValuesByPropertyFromIdList={onRetreiveItemsValues}
            />
          </SearchBar>
        </div>

        <div className="w-full" data-page-tour="table">
          <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            sorting={sorting}
            setSorting={handleSortingChange}
            emptyMessage={
              searchValue ? "Aucun tag trouvé" : "Aucun tag disponible"
            }
          />
        </div>

        <div className="w-full mt-5" data-page-tour="pagination">
          <TablePagination leftText={`Tags : ${totalItems}`} {...pagination} />
        </div>
      </Wrapper>

      <TableActionsModal
        isOpen={idToDelete !== null}
        onCancel={() => setIdToDelete(null)}
        title="Confirmation de suppression"
        description="Êtes-vous sûr de vouloir supprimer ce tag ?"
        descList={tagToDelete ? [tagToDelete.name] : undefined}
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

export default TagsHome;
