//import { useRef } from "react";
import Header from "../../../components/UI/header";
import Wrapper from "../../../components/UI/wrapper/wrapper.component";

import { useMemo } from "react";
import defaultImage from "../../../assets/images/module-default.jpg";
import bgImageGradient from "../../../utils/bg-image-gradient";
import TwoButtonsModal from "../../../components/UI/modal/two-buttons-modal";
import ModuleCreateForm from "../../../components/module-add/ModuleCreateForm";
import AssociateToParcours from "../../../components/module-add/AssociateToParcours";
import ButtonButton from "../../../components/module-add/ButtonButton";
import useNewModule from "../../../components/module-add/useAddModule";

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
    <main className="flex flex-col items-center gap-y-8 w-full">
      {/* En-tête de la page */}
      <section className="flex justify-center w-full">
        <Header
          title="Créer un nouveau module"
          description="Créer un nouveau module pour une formation existante"
        />
      </section>
      <section style={classImage}></section>
      <section className="flex justify-center">
        <Wrapper>
          <div className="grid grid-cols-1 lg:grid-cols-13 gap-2">
            <span className="col-span-5 flex flex-col gap-y-4">
              <ModuleCreateForm
                formationId={formationId}
                formationList={formationList}
                data={data}
                onSubmit={handleSubmit}
                onPickFormation={handlePickFormation}
                onSetFile={handleSetFile}
                setImageBase64={setImageBase64}
                toggleModal={toggleModal}
                newModuleData={newModuleData}
              />
            </span>
            <div className="col-span-1 lg:col-span-0 sm:divider sm:my-auto lg:hidden block" />
            <div className="col-span-1 divider divider-horizontal lg:mx-auto hidden lg:block " />
            <span className="col-span-6 mx-auto flex flex-col gap-y-4">
              {showMetadataForm && newModuleData && parcoursList ? (
                <AssociateToParcours
                  parcoursId={parcoursId}
                  parcoursList={parcoursList}
                  onPickParcours={handlePickParcours}
                  data={data}
                  contacts={contacts}
                  currentContacts={currentContacts}
                  skills={skills}
                  currentSkills={currentSkills}
                  isLoading={isLoading}
                  onMetadataSubmit={handleMetadataSubmit}
                  setCurrentContacts={setCurrentContacts}
                  setCurrentSkills={setCurrentSkills}
                  toggleModal={toggleModal}
                  cantSubmit={cantSubmit}
                />
              ) : (
                <div className="h-full flex justify-center items-center gap-x-4">
                  <ButtonButton
                    toggleModal={toggleModal}
                    toggleShowMetadataForm={toggleShowMetadataForm}
                    newModuleData={newModuleData}
                  />
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
