import { parcoursSearchOptions } from "../../config/search-options";
import Parcours from "../../utils/interfaces/parcours";
import Can from "../UI/can/can.component";
import Header from "../UI/header";
import Search from "../UI/search/search.component";
import RefreshIcon from "../UI/svg/refresh-icon.component";
import ParcoursTable from "./parcours-table";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import Pagination from "../UI/pagination/pagination";
import { Link } from "react-router-dom";
import AddIcon from "../UI/svg/add-icon";
import ParcoursCardsList from "./parcours-cards-list";
import ToggleList from "../UI/toggle-list";
import { useState } from "react";
import { searchListParcours } from "../../helpers/parcours/search-list-parcours";

interface ParcoursListProps {
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

  return (
    <main className="w-5/6 flex flex-col items-center px-4 py-8 gap-8">
      <section className="w-full">
        <Header
          title="Liste des parcours"
          description="Gérer tous les parcours qui vous sont attribués."
        >
          <Can action="write" object="parcours">
            <Link className="btn btn-primary" to="créer-un-parcours">
              <div className="flex gap-x-2 items-center">
                <div className="w-8 h-8">
                  <AddIcon />
                </div>
                <p>Créer un parcours</p>
              </div>
            </Link>
          </Can>
        </Header>
      </section>
      <section className="w-full flex">
        <article className="w-full flex justify-end items-center gap-x-2">
          <Search
            options={parcoursSearchOptions}
            placeholder="Filtrer"
            onSearch={handleSearchResult}
          />
          <div className="text-primary" onClick={handleResetSearch}>
            <RefreshIcon size={8} />
          </div>
        </article>
      </section>
      <section className="w-full flex flex-col">
        <article className="w-full flex justify-end items-center gap-x-4">
          <ToggleList showList={showList} onToggle={setShowList} />
        </article>
        {list ? (
          <>
            {showList ? (
              <ParcoursTable
                parcoursList={list}
                onSorting={sortData}
                direction={direction}
                fieldSort={fieldSort}
              />
            ) : (
              <ParcoursCardsList parcoursList={list} />
            )}
          </>
        ) : null}
      </section>
      <section className="w-full">
        {totalPages > 1 ? (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        ) : null}
      </section>
    </main>
  );
};

export default ParcoursList;
