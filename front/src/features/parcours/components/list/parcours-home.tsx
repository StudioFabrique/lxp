/* eslint-disable @typescript-eslint/no-explicit-any */
import { parcoursSearchOptions } from "../../../../../src.legacy/config/search-options";
import Parcours from "../../../../../src.legacy/utils/interfaces/parcours";
import ParcoursTable from "./parcours-table";
import useEagerLoadingList from "../../../../../src.legacy/hooks/use-eager-loading-list";
import Pagination from "../../../../../src.legacy/components/UI/pagination/pagination";
import ParcoursCardsList from "./parcours-cards-list";
import ToggleList from "../../../../../src.legacy/components/UI/toggle-list";
import { useEffect, useState } from "react";
import { searchListParcours } from "../../../../../src.legacy/helpers/parcours/search-list-parcours";
import useHttp from "../../../../../src.legacy/hooks/use-http";
import toast from "react-hot-toast";
import Modal from "../../../../../src.legacy/components/UI/modal/modal";
import SearchAndRefresh from "../../../../../src.legacy/components/UI/search-and-refresh";
import ParcoursHeader from "./parcours-header";
import ListHeader from "../../../../../src.legacy/components/UI/list-header";

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
  const { error, isLoading, sendRequest } = useHttp();
  const [parcoursToDelete, setParcoursToDelete] = useState<Parcours | null>(
    null
  );

  /**
   * permet de filtrer les objets affichés dans la liste, gère les propriétés nichées dans d'autres
   * @param entityToSearch string
   * @param searchValue string
   */
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
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        setParcoursToDelete(null);
        setPage(1);
        props.onRefreshParcoursList();
      }
    };
    sendRequest(
      { path: `/parcours/${parcoursToDelete!.id}`, method: "delete" },
      applyData
    );
  };

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

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
                loading={isLoading}
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
                loading={isLoading}
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
