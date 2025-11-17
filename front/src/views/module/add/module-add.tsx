//import { useRef } from "react";
import Header from "../../../components/UI/header";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import ModuleMetadatas from "./module-metadatas";
import Selecter from "../../../components/UI/selecter/selecter.component";
import useNewModule from "./use-new-module";

export default function ModuleAdd() {
  const {
    data,
    formationId,
    formationList,
    handlePickFormation,
    newModuleData,
    showMetadataForm,
    handleSubmit,
    handleSetFile,
    handleResetForm,
    toggleShowMetadataForm,
  } = useNewModule();

  return (
    <main className="p-2 flex flex-col items-center gap-y-8 w-full">
      {/* En-tête de la page */}
      <section className="flex justify-center xl:w-9/12 w-full">
        <Header
          title="Créer un nouveau module"
          description="Créer un nouveau module pour une formation existante"
        />
      </section>
      <section className="flex justify-center">
        <Wrapper>
          <div className="xl:w-2/6">
            <Selecter
              defaultItem={{ id: formationId ?? 0, title: "" }}
              list={formationList}
              title="Choisissez une formation"
              onSelectItem={handlePickFormation}
            />
          </div>
          <form className="w-full" onSubmit={handleSubmit} ref={null}>
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-2">
              <span className="col-span-5">
                <ModuleMetadatas
                  data={data}
                  thumb={null}
                  onSetFile={handleSetFile}
                  mode="create"
                />
                <div className="flex justify-end mt-4">
                  <span className="flex items-center gap-x-4">
                    <button
                      className="btn btn-outline btn-secondary"
                      type="button"
                      onClick={handleResetForm}
                    >
                      Annuler
                    </button>
                    <button className="btn btn-primary">Enregistrer</button>
                  </span>
                </div>
              </span>
              <span className="col-span-6 m-auto">
                {showMetadataForm && newModuleData ? (
                  <div></div>
                ) : (
                  <button
                    className="btn btn-info"
                    disabled={!newModuleData}
                    type="button"
                    onClick={toggleShowMetadataForm}
                  >
                    Attacher à un parcours
                  </button>
                )}
              </span>
            </div>
          </form>
        </Wrapper>
      </section>
    </main>
  );
}
