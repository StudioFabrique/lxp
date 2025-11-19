//import { useRef } from "react";
import Header from "../../../components/UI/header";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";
import ModuleMetadatas from "./module-metadatas";
import Selecter from "../../../components/UI/selecter/selecter.component";
import useNewModule from "./use-new-module";
import ModuleToParcours from "./module-to-parcours";
import { useMemo } from "react";
import FieldNumber from "../../../components/UI/forms/field-number";
import defaultImage from "../../../assets/images/module-default.jpg";
import bgImageGradient from "../../../utils/bg-image-gradient";
import TwoButtonsModal from "../../../components/UI/modal/two-buttons-modal";

export default function ModuleAdd() {
  const {
    contacts,
    currentContacts,
    currentSkills,
    data,
    formationId,
    formationList,
    handleBackToModuleList,
    handleMetadataSubmit,
    handlePickFormation,
    handlePickParcours,
    handleSetFile,
    handleSubmit,
    image,
    isLoading,
    newModuleData,
    parcoursId,
    parcoursList,
    setCurrentContacts,
    setCurrentSkills,
    setImageBase64,
    showMetadataForm,
    showModal,
    skills,
    toggleModal,
    toggleShowMetadataForm,
  } = useNewModule();

  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(image ?? defaultImage),
    width: "75%",
    height: "20rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  const cantSubmit = useMemo(() => {
    if (typeof data.values.duration === "number" && data.values.duration > 0)
      return false;
    else
      return (
        !parcoursId ||
        isLoading ||
        (currentContacts &&
          currentContacts.length === 0 &&
          currentSkills &&
          currentSkills.length === 0)
      );
  }, [
    parcoursId,
    currentContacts,
    currentSkills,
    isLoading,
    data.values.duration,
  ]);

  return (
    <main className="p-2 flex flex-col items-center gap-y-8 w-full">
      <pre>{showModal ? "Le modal est ouvert" : "Le modal est fermé"}</pre>
      {/* En-tête de la page */}
      <section className="flex justify-center xl:w-9/12 w-full">
        <Header
          title="Créer un nouveau module"
          description="Créer un nouveau module pour une formation existante"
        />
      </section>
      <section style={classImage}></section>
      <section className="flex justify-center w-9/12">
        <Wrapper>
          <div className="grid grid-cols-1 lg:grid-cols-13 gap-2">
            <span className="col-span-5 flex flex-col gap-y-4">
              <h2 className="text-sm">
                Choisissez une formation à laquelle attacher le module
              </h2>
              <Selecter
                defaultItem={{ id: formationId ?? 0, title: "" }}
                list={formationList}
                title="Choisissez une formation"
                onSelectItem={handlePickFormation}
              />

              <form onSubmit={handleSubmit} ref={null}>
                <ModuleMetadatas
                  data={data}
                  thumb={null}
                  onSetFile={handleSetFile}
                  mode="create"
                  onSetImageBase64={setImageBase64}
                />
                <div className="flex justify-end">
                  <span className="flex items-center gap-x-4 mt-4">
                    <button
                      className="btn btn-outline btn-secondary"
                      type="button"
                      onClick={toggleModal}
                      disabled={!!newModuleData}
                    >
                      Annuler
                    </button>
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={!!newModuleData}
                    >
                      Enregistrer
                    </button>
                  </span>
                </div>
              </form>
            </span>
            <div className="col-span-1 lg:col-span-0 divider sm:my-auto lg:hidden" />
            <div className="col-span-1 divider divider-horizontal lg:mx-auto hidden lg:divider " />
            <span className="col-span-6 mx-auto flex flex-col gap-y-4">
              {showMetadataForm && newModuleData && parcoursList ? (
                <>
                  <h2 className="text-sm">
                    Choisissez un parcours auquel attacher le module afin de
                    pouvoir mettre à jour les compétences et ressources
                    pédagogiques liées
                  </h2>
                  <Selecter
                    defaultItem={{ id: parcoursId ?? 0, title: "" }}
                    list={parcoursList}
                    title="Choisissez un parcours auquel attacher le module"
                    onSelectItem={handlePickParcours}
                  />
                  <FieldNumber
                    label="Durée du module en heures *"
                    name="duration"
                    placeholder="Ex : 12"
                    min={0}
                    data={data}
                  />
                  <ModuleToParcours
                    currentContacts={currentContacts ?? []}
                    currentSkills={currentSkills ?? []}
                    contacts={contacts ?? []}
                    skills={skills ?? []}
                    isLoading={isLoading}
                    setCurrentContacts={setCurrentContacts}
                    setCurrentSkills={setCurrentSkills}
                    isDisabled={!parcoursId}
                  />
                  <div className="flex justify-end gap-x-4">
                    <button
                      className="btn btn-outline btn-secondary"
                      onClick={toggleModal}
                    >
                      Annuler
                    </button>
                    <button
                      className="btn btn-primary"
                      disabled={cantSubmit}
                      type="button"
                      onClick={handleMetadataSubmit}
                    >
                      Enregistrer
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex justify-center items-center gap-x-4">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={toggleModal}
                  >
                    Retour à la liste des modules
                  </button>
                  <button
                    className="btn btn-info"
                    disabled={!newModuleData}
                    type="button"
                    onClick={toggleShowMetadataForm}
                  >
                    Attacher à un parcours
                  </button>
                </div>
              )}
            </span>
          </div>
        </Wrapper>
      </section>
      <TwoButtonsModal
        id="back_to_module_list_modal"
        title="Retour à la liste des modules"
        leftLabel="Fermer"
        rightLabel="Continuer"
        onRightButtonClick={handleBackToModuleList}
        onLeftButtonClick={toggleModal}
      >
        <p>
          Êtes-vous sûr de vouloir revenir à la liste des modules ? Les
          modifications non enregistrées seront perdues.
        </p>
      </TwoButtonsModal>
    </main>
  );
}
