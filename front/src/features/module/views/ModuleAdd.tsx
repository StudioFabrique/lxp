//import { useRef } from "react";
import Header from "../../../components/headers/Header";
import Wrapper from "../../../components/wrappers/BoxWrapper";

import { useMemo } from "react";
import defaultImage from "../../../../src/assets/images/module-default.jpg";
import ModuleCreateForm from "../../../components/module-add/ModuleCreateForm";
import AssociateToParcours from "../../../components/module-add/AssociateToParcours";
import ButtonButton from "../../../components/module-add/ButtonButton";
import useNewModule from "../../../components/module-add/useAddModule";
import { bgImageGradient } from "../../../../src/utils/helpers/color-helpers";
import Modal from "../../../components/UI/modal/modal";

export default function ModuleAdd() {
  const {
    contacts,
    currentContacts,
    currentSkills,
    register,
    errors,
    watch,
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

  const duration = watch("duration");

  const cantSubmit = useMemo(() => {
    if (typeof duration === "number" && duration > 0)
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
    duration,
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
                register={register}
                errors={errors}
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
                  register={register}
                  errors={errors}
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
                <div className="h-full flex flex-col justify-center items-center gap-y-8">
                  <ButtonButton
                    toggleModal={toggleModal}
                    toggleShowMetadataForm={toggleShowMetadataForm}
                    newModuleData={newModuleData}
                  />
                  <h2 className="text-center text-xs text-info">
                    Vous pourrez associer le module à un parcours une fois un
                    nouveau module crée.
                  </h2>
                </div>
              )}
            </span>
          </div>
        </Wrapper>
      </section>
      <Modal
        title="Retour à la liste des modules"
        leftLabel="Fermer"
        rightLabel="Continuer"
        onRightClick={handleBackToModuleList}
        onLeftClick={toggleModal}
      >
        <p>
          Êtes-vous sûr de vouloir revenir à la liste des modules ? Les
          modifications non enregistrées seront perdues.
        </p>
      </Modal>
    </main>
  );
}
