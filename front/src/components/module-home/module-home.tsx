/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
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
}

const ModuleHomeList = ({ modulesList }: ModuleHomeListProps) => {
  const [showList, setShowList] = useState(true);
  const [moduleToDelete, setModuleToDelete] = useState<any>(null);
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

  const handleConfirmDeleteModule = (id: number) => {
    const module = list?.find((item: any) => item.id === id);
    if (module) {
      setModuleToDelete(module);
    }
  };

  const handleCloseModal = () => {
    setModuleToDelete(null);
  };

  useEffect(() => {
    if (moduleToDelete) {
      (document.getElementById("my_modal_3") as HTMLFormElement).showModal();
    }
  }, [moduleToDelete]);

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

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog" onSubmit={handleCloseModal}>
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-warning">
            Supprimer le module {moduleToDelete?.title}
          </h3>
          <p className="py-4">
            Confirmez-vous la suppression définitive de ce module ?
          </p>
          <div className="w-full flex justify-end gap-x-2 mt-4">
            <form method="dialog" onSubmit={handleCloseModal}>
              <button className="btn btn-sm btn-outline" type="submit">
                Annuler
              </button>
            </form>
            <button className="btn btn-sm btn-error">Confirmer</button>
          </div>
        </div>
      </dialog>
    </main>
  );
};

export default ModuleHomeList;

{
  /* <ParcoursCardsList parcoursList={list} /> */
}
