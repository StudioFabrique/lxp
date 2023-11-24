import { useState } from "react";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import Module from "../../utils/interfaces/module";
import Header from "../UI/header";
import ToggleList from "../UI/toggle-list";
import Pagination from "../UI/pagination/pagination";
import ModuleTable from "./module-table";
import ModuleCardList from "./modules-card-list";

interface ModuleHomeListProps {
  modulesList: Module[];
}

const ModuleHomeList = ({ modulesList }: ModuleHomeListProps) => {
  const [showList, setShowList] = useState(true);
  const {
    list,
    sortData,
    page,
    totalPages,
    fieldSort,
    direction,
    //getFilteredList,
    //resetFilters,
    setPage,
  } = useEagerLoadingList(modulesList, "title", 15);

  return (
    <main className="w-5/6 flex flex-col items-center px-4 py-8 gap-8">
      <section className="w-full">
        <Header
          title="Liste des modules"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in urna eget pura."
        ></Header>
      </section>
      {/*       <section className="w-full flex">
        <article className="w-full flex justify-end items-center gap-x-2">
          <SelectDropdown onSelectItem={() => {}} />
          <div className="text-primary" onClick={handleResetSearch}>
            <RefreshIcon size={8} />
          </div>
        </article>
      </section> */}
      <section className="w-full flex flex-col">
        <article className="w-full flex justify-end items-center gap-x-4">
          <ToggleList showList={showList} onToggle={setShowList} />
        </article>
        {list ? (
          <>
            {showList ? (
              <ModuleTable
                modulesList={list}
                onSorting={sortData}
                direction={direction}
                fieldSort={fieldSort}
              />
            ) : (
              <ModuleCardList modulesList={list} />
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

export default ModuleHomeList;

{
  /* <ParcoursCardsList parcoursList={list} /> */
}
