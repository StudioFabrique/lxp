/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import useEagerLoadingList from "../../hooks/use-eager-loading-list";
import Module from "../../utils/interfaces/module";
import Header from "../UI/header";
import ToggleList from "../UI/toggle-list";
import Pagination from "../UI/pagination/pagination";
import ModuleTable from "./module-table";
import ModuleCardList from "./modules-card-list";
import { stepsParcours } from "../../config/steps/steps-parcours";

interface ModuleHomeListProps {
  modulesList: Module[];
  onDeleteModule: (module: any) => void;
}

const ModuleHomeList = ({
  modulesList,
  onDeleteModule,
}: ModuleHomeListProps) => {
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

  const stepId = useMemo(() => {
    return stepsParcours.find((item: any) => item.label === "Modules").id;
  }, []);

  /**
   * stocke en mémoire le module à supprimer
   * @param id number
   */
  const handleConfirmDeleteModule = (id: number) => {
    const module = list?.find((item: any) => item.id === id);
    if (module) {
      onDeleteModule(module);
    }
  };

  return (
    <main className="w-5/6 flex flex-col items-center px-4 py-8 gap-8">
      <section className="w-full">
        <Header
          title="Liste des modules"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in urna eget pura."
        ></Header>
      </section>
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
                stepId={stepId}
                onDelete={handleConfirmDeleteModule}
              />
            ) : (
              <ModuleCardList
                stepId={stepId}
                modulesList={list}
                onDelete={handleConfirmDeleteModule}
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
    </main>
  );
};

export default ModuleHomeList;

{
  /* <ParcoursCardsList parcoursList={list} /> */
}
