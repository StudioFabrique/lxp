import { parcoursSearchOptions } from "../../config/search-options";
import Parcours from "../../utils/interfaces/parcours";
import ButtonAdd from "../UI/button-add/button-add";
import Can from "../UI/can/can.component";
import Header from "../UI/header";
import Search from "../UI/search/search.component";
import RefreshIcon from "../UI/svg/refresh-icon.component";
import ParcoursTable from "./parcours-table";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import Pagination from "../UI/pagination/pagination";

interface ParcoursListProps {
  parcoursList: Parcours[];
}

const ParcoursList = (props: ParcoursListProps) => {
  const { list, sortData, page, totalPages, fieldSort, direction, setPage } =
    useEagerLoadingList(props.parcoursList, "title", 15);

  return (
    <main className="w-5/6 flex flex-col items-center px-4 py-8 gap-8">
      <section className="w-full">
        <Header
          title="Liste des parcours"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in urna eget pura."
        />
      </section>
      <section className="w-full flex justify-between items-center">
        <div className="w-full flex flex-col gap-y-8">
          <div className="w-full flex items-center">
            <div className="flex justify-start">
              <Can action="write" object="parcours">
                <ButtonAdd label="Créer un parcours" onClickEvent={() => {}} />
              </Can>
            </div>
            <div className="w-full flex justify-end items-center gap-x-2">
              <Search
                options={parcoursSearchOptions}
                placeholder="Filtrer par ..."
                onSearch={() => {}}
              />
              <div className="text-primary" onClick={() => {}}>
                <RefreshIcon size={8} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full">
        {list ? (
          <ParcoursTable
            parcoursList={list}
            onSorting={sortData}
            direction={direction}
            fieldSort={fieldSort}
          />
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
