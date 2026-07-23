/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import useEagerLoadingList from "../../../../hooks/useEagerLoadingList";
import Module from "../../../../utils/interfaces/module";
import ToggleList from "../../../../components/UI/toggle-list";
import Pagination from "../../../../components/UI/pagination/pagination";
import ModuleTable from "./module-table";
import ModuleCardList from "./modules-card-list";
import Wrapper from "../../../../components/wrappers/BoxWrapper";
import ListHeader from "../../../../components/UI/list-header";
import ModuleHeader from "./module-header";

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
    <ListHeader>
      <ModuleHeader />
      <section className="w-full flex flex-col gap-y-8">
        <article className="w-full flex justify-end items-center gap-x-4">
          <ToggleList showList={showList} onToggle={setShowList} />
        </article>
        {list ? (
          <div className="w-full">
            {showList ? (
              <Wrapper>
                <ModuleTable
                  modulesList={list}
                  onSorting={sortData}
                  direction={direction}
                  fieldSort={fieldSort}
                  onDelete={handleConfirmDeleteModule}
                />
              </Wrapper>
            ) : (
              <ModuleCardList
                modulesList={list}
                onDelete={handleConfirmDeleteModule}
              />
            )}
          </div>
        ) : null}
      </section>
      <section className="w-full">
        {totalPages > 1 ? (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        ) : null}
      </section>
    </ListHeader>
  );
};

export default ModuleHomeList;
