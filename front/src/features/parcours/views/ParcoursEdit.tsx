import FadeWrapper from "../../../../src/components/wrappers/FadeWrapper";
import Loader from "../../../../src/components/loaders/Loader";
import HeaderIcon from "../../../../src/components/UI/svg/header-icon";
import Calendrier from "../components/edit/calendrier/calendrier";
import ParcoursInformations from "../components/edit/informations/parcours-informations";
import ImportObjectives from "../components/edit/objectives/import-objectives";
import ObjectivesList from "../components/edit/objectives/objectives-list";
import ParcoursSection from "../components/edit/parcours-section";
import ParcoursStudents from "../components/edit/students/parcours-students.component";
import ParcoursPreview from "../components/edit/preview/parcours-preview.component";
import ImportSkills from "../components/edit/skills/import-skills.component";
import SkillsList from "../components/edit/skills/skills-list.component";
import Error404 from "../../../components/error404";
import ImageHeaderMutable from "../../../../src/components/image-header/image-header-mutable";

import ModuleComponent from "../components/edit/modules/module";
import Stepper from "../../../components/UI/stepper-component/stepper-component";
import { useParcoursEdit } from "../hooks/useParcoursEdit";
import FloatingBottomNavigation from "../../../components/buttons/FloatingBottomNavigation";

const EditParcours = () => {
  const {
    id,
    actualStep,
    finalStep,
    stepsList,
    updateStep,
    updateImage,
    isLoading,
    error,
    infos,
    formation,
    image,
    handleResetImportedObjectives,
    handleResetImportedSkills,
    handleUpdateStep,
    handleRetour,
  } = useParcoursEdit();

  const renderActualStep = () => {
    switch (actualStep.id) {
      case 1:
        return id && <ParcoursInformations parcoursId={id} />;
      case 2:
        return (
          <ParcoursSection
            section="Objectifs"
            title="Importer une liste d'objectifs"
            onResetList={handleResetImportedObjectives}
            children={[
              <ObjectivesList />,
              <ImportObjectives onCloseDrawer={() => {}} />,
            ]}
          />
        );
      case 3:
        return (
          <ParcoursSection
            section="Compétences"
            title="Importer des compétences"
            onResetList={handleResetImportedSkills}
            children={[
              <SkillsList />,
              <ImportSkills onCloseDrawer={() => {}} />,
            ]}
          />
        );
      case 4:
        return <ModuleComponent />;
      case 5:
        return <Calendrier />;
      case 6:
        return <ParcoursStudents />;
      case 7:
        return <ParcoursPreview onEdit={updateStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start">
      {isLoading ? (
        <div className="flex items-center">
          <Loader />
        </div>
      ) : error.length === 0 ? (
        <FadeWrapper>
          <div className="w-full flex flex-col items-center gap-y-8">
            {infos.title && formation ? (
              <ImageHeaderMutable
                defaultImage="/images/parcours-default.webp"
                image={image}
                title={infos.title}
                onUpdateImage={updateImage}
                parentTitle={formation.title}
                isPublished={infos.isPublished}
              >
                <HeaderIcon />
              </ImageHeaderMutable>
            ) : null}
            <div className="w-full p-4 rounded-xl border-[0.5px] border-secondary">
              <Stepper
                actualStep={actualStep}
                finalStep={finalStep}
                stepsList={stepsList}
                updateStep={updateStep}
              />
            </div>
          </div>
          <div className="w-full mt-16">{renderActualStep()}</div>
          {actualStep.id !== stepsList.length ? (
            <FloatingBottomNavigation
              startActions={
                <button
                  className="btn btn-ghost hover:underline"
                  onClick={handleRetour}
                >
                  Retour
                </button>
              }
              endActions={
                <button
                  className="btn btn-primary px-6"
                  onClick={() => handleUpdateStep(actualStep.id)}
                >
                  Étape suivante
                </button>
              }
            />
          ) : null}
        </FadeWrapper>
      ) : (
        <Error404 />
      )}
    </div>
  );
};

export default EditParcours;
