//import { useRef } from "react";
import Header from "../../../components/headers/Header";
import Wrapper from "../../../components/wrappers/BoxWrapper";

import defaultImage from "../../../../src/assets/images/module-default.jpg";
import ModuleCreateForm from "../components/add/ModuleCreateForm";
import useNewModule from "../components/add/useAddModule";
import { bgImageGradient } from "../../../../src/utils/helpers/color-helpers";
import Modal from "../../../components/UI/modal/modal";

export default function ModuleAdd() {
  const {
    contacts,
    currentContacts,
    currentSkills,
    register,
    errors,
    formationId,
    formationList,
    handleBackToModuleList,
    handlePickFormation,
    handlePickParcours,
    handleSetFile,
    handleSubmit,
    image,
    isLoading,
    parcoursId,
    parcoursList,
    setCurrentContacts,
    setCurrentSkills,
    setImageBase64,
    skills,
    toggleModal,
    showModal,
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
          <div className="w-full max-w-4xl">
            <span className="flex flex-col gap-y-4">
              <ModuleCreateForm
                formationId={formationId}
                formationList={formationList}
                parcoursId={parcoursId}
                parcoursList={parcoursList}
                register={register}
                errors={errors}
                onSubmit={handleSubmit}
                onPickFormation={handlePickFormation}
                onPickParcours={handlePickParcours}
                onSetFile={handleSetFile}
                setImageBase64={setImageBase64}
                toggleModal={toggleModal}
                contacts={contacts}
                currentContacts={currentContacts}
                skills={skills}
                currentSkills={currentSkills}
                isLoading={isLoading}
                setCurrentContacts={setCurrentContacts}
                setCurrentSkills={setCurrentSkills}
              />
            </span>
          </div>
        </Wrapper>
      </section>
      {showModal ? (
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
      ) : null}
    </main>
  );
}
