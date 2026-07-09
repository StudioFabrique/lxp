import { parcoursSearchOptions } from "../../../../config/search-options";
import Parcours from "../../../../../src/utils/interfaces/parcours";
import ParcoursTable from "./parcours-table";
import useEagerLoadingList from "../../../../../src/hooks/useEagerLoadingList";
import Pagination from "../../../../components/UI/pagination/pagination";
import ParcoursCardsList from "./parcours-cards-list";
import ToggleList from "../../../../components/UI/toggle-list";
import { useState } from "react";
import { searchListParcours } from "../../../../utils/helpers/search-list-parcours";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SearchAndRefresh from "../../../../components/UI/search-and-refresh";
import ParcoursHeader from "./parcours-header";
import ListHeader from "../../../../components/UI/list-header";
import { parcoursApi } from "../../api/parcours.api";
import Modal from "../../../../components/UI/modal/modal";

interface ParcoursListProps {
  onRefreshParcoursList: () => void;
  parcoursList: Parcours[];
}

const ParcoursList = (props: ParcoursListProps) => {
  const [showList, setShowList] = useState(true);
  const {
    list,
    sortData,
    page,
    totalPages,
    fieldSort,
    direction,
    getFilteredList,
    resetFilters,
    setPage,
  } = useEagerLoadingList(props.parcoursList, "title", 15);
  const [parcoursToDelete, setParcoursToDelete] = useState<Parcours | null>(
    null
  );

  const { mutate: deleteParcours, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => parcoursApi.mutations.deleteParcours(id),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        setParcoursToDelete(null);
        setPage(1);
        props.onRefreshParcoursList();
      }
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du parcours");
    },
  });

  const handleSearchResult = (entityToSearch: string, searchValue: string) => {
    const filters = searchListParcours(entityToSearch, searchValue);
    getFilteredList(filters);
  };

  const handleResetSearch = () => {
    resetFilters();
  };

  const confirmParcoursToDelete = (parcours: Parcours) => {
    setParcoursToDelete(parcours);
  };

  const handleDeleteParcours = () => {
    deleteParcours(parcoursToDelete!.id!);
  };

  return (
    <ListHeader>
      <ParcoursHeader />

      <section className="w-full flex flex-col gap-y-4">
        <article className="w-full flex justify-end items-center">
          <ToggleList showList={showList} onToggle={setShowList} />
        </article>
        {!showList ? (
          <SearchAndRefresh
            searchOptions={parcoursSearchOptions}
            onSearch={handleSearchResult}
            onResetInput={handleResetSearch}
            placeholder="Filtrer"
          />
        ) : null}
        {list ? (
          <>
            {showList ? (
              <ParcoursTable
                parcoursList={list}
                onSorting={sortData}
                direction={direction}
                fieldSort={fieldSort}
                onDeleteParcours={confirmParcoursToDelete}
                loading={isDeleting}
              >
                <SearchAndRefresh
                  searchOptions={parcoursSearchOptions}
                  onSearch={handleSearchResult}
                  onResetInput={handleResetSearch}
                  placeholder="Filtrer"
                />
              </ParcoursTable>
            ) : (
              <ParcoursCardsList
                parcoursList={list}
                loading={isDeleting}
                onDeleteParcours={confirmParcoursToDelete}
              />
            )}
          </>
        ) : null}
      </section>

      <section className="w-full">
        {totalPages > 1 ? (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        ) : null}
      </section>

      {parcoursToDelete ? (
        <Modal
          onLeftClick={() => setParcoursToDelete(null)}
          onRightClick={handleDeleteParcours}
          title="Supprimer un parcours"
          isSubmitting={false}
          leftLabel="Annuler"
          rightLabel="Confirmer"
        >
          Attention le parcours et les ressources qui lui sont associées seront
          définitivement supprimés.
        </Modal>
      ) : null}
    </ListHeader>
  );
};

export default ParcoursList;
