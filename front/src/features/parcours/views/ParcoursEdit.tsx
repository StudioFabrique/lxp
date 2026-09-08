import { useContext, useMemo } from "react";

import FadeWrapper from "../../../../src/components/wrappers/FadeWrapper";
import Loader from "../../../../src/components/loaders/Loader";
import HeaderIcon from "../../../../src/components/UI/svg/header-icon";
import Calendrier from "../components/edit/calendrier/calendrier";
import ParcoursInformations from "../components/edit/informations/parcours-informations";
import ImportObjectives from "../components/edit/objectives/import-objectives";
import ObjectivesList from "../components/edit/objectives/objectives-list";
import ParcoursSection from "../components/edit/parcours-section";
import ParcoursStepContent from "../components/edit/parcours-step-content";
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
import { useOnboarding } from "../../onboarding/OnboardingContext";
import { AuthContext } from "../../../store/AuthProvider";
import {
  getModulesLabel,
  isTeacherUser,
} from "../../../utils/helpers/user-role";
import RecommendedActionTour from "../../../components/guided-tour/RecommendedActionTour";
import { moduleCreationTourSteps } from "../../../components/guided-tour/recommended-action-tour-steps";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";

const EditParcours = () => {
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);
  const { status: onboardingStatus, step: onboardingStep } = useOnboarding();
  const onboardingNavigationLocked =
    onboardingStatus === "in_progress" &&
    (onboardingStep.startsWith("admin-parcours-tags") ||
      onboardingStep.startsWith("admin-module-"));
  const {
    id,
    moduleFormOpened,
    setModuleFormOpened,
    actualStep,
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
    importedSkills,
    importedObjectives,
    setImportedSkills,
    setImportedObjectives,
    handleUpdateStep,
    handleRetour,
  } = useParcoursEdit();
  const contextualStepsList = useMemo(
    () =>
      stepsList.map((step) => {
        if (step.id === 4) {
          return { ...step, label: getModulesLabel(user, step.label) };
        }
        return step;
      }),
    [stepsList, user],
  );
  const actualStepTitle =
    actualStep.id === 4
      ? getModulesLabel(user, "Modules associés au Parcours")
      : ({
          1: "Informations",
          2: "Objectifs",
          3: "Compétences",
          5: "Calendrier des modules",
          6: "Groupe d'apprenants",
          7: "Aperçu général",
        }[actualStep.id] ?? actualStep.label);
  const renderActualStep = () => {
    switch (actualStep.id) {
      case 1:
        return id && <ParcoursInformations parcoursId={id} />;
      case 2:
        return (
          <ParcoursSection
            title="Importer une liste d'objectifs"
            onResetList={handleResetImportedObjectives}
            readOnly={isTeacher}
            children={[
              <ObjectivesList readOnly={isTeacher} />,
              <ImportObjectives
                importedObjectives={importedObjectives}
                onImport={setImportedObjectives}
                onCloseDrawer={() => {}}
              />,
            ]}
          />
        );
      case 3:
        return (
          <ParcoursSection
            title="Importer des compétences"
            onResetList={handleResetImportedSkills}
            children={[
              <SkillsList />,
              <ImportSkills
                importedSkills={importedSkills}
                onImport={setImportedSkills}
                onCloseDrawer={() => {}}
              />,
            ]}
          />
        );
      case 4:
        return <ModuleComponent setModuleFormOpened={setModuleFormOpened} />;
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
            {infos?.title && formation ? (
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

            <ParcoursStepContent stepId={actualStep.id}>
              <BoxWrapper className="w-full h-auto">
                <Stepper
                  actualStep={actualStep}
                  stepsList={contextualStepsList}
                  updateStep={updateStep}
                  disabled={onboardingNavigationLocked}
                />
              </BoxWrapper>
              <div className="mt-12 w-full">
                <h1 className="text-3xl font-extrabold">{actualStepTitle}</h1>
                <div className="mt-4">{renderActualStep()}</div>
              </div>
              {actualStep.id !== stepsList.length && !moduleFormOpened ? (
                <FloatingBottomNavigation
                  startActions={
                    <button
                      className="btn btn-outline"
                      onClick={handleRetour}
                      disabled={onboardingNavigationLocked}
                    >
                      Retour
                    </button>
                  }
                  endActions={
                    <button
                      className="btn btn-info px-6"
                      onClick={() => handleUpdateStep(actualStep.id)}
                      disabled={onboardingNavigationLocked}
                    >
                      Étape suivante
                    </button>
                  }
                />
              ) : null}
            </ParcoursStepContent>
          </div>
          <RecommendedActionTour
            tutorial="module"
            steps={moduleCreationTourSteps}
          />
        </FadeWrapper>
      ) : (
        <Error404 />
      )}
    </div>
  );
};

export default EditParcours;
