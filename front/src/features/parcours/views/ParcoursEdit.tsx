import { useContext, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

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
import ParcoursStickyStepper from "../components/edit/parcours-sticky-stepper";
import { useParcoursEdit } from "../hooks/useParcoursEdit";
import FloatingBottomNavigation from "../../../components/buttons/FloatingBottomNavigation";
import { AuthContext } from "../../../store/AuthProvider";
import {
  getModulesLabel,
  isTeacherUser,
} from "../../../utils/helpers/user-role";
import useValidateParcours from "../hooks/useValidateParcours";
import { parcoursApi } from "../api/parcours.api";
import { showParcoursValidationToast } from "../helpers/show-parcours-validation-toast";

const EditParcours = () => {
  const { user } = useContext(AuthContext);
  const isTeacher = isTeacherUser(user);
  const navigate = useNavigate();
  const { validateParcours } = useValidateParcours();
  const [isPublishing, setIsPublishing] = useState(false);
  // Emplacement, à droite du titre, où les étapes 4 et 5 placent leur barre d'actions.
  const [titleActionsTarget, setTitleActionsTarget] =
    useState<HTMLDivElement | null>(null);
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
  const handlePublishParcours = async () => {
    if (!id || isPublishing) return;

    const validationErrors = validateParcours();
    if (validationErrors.length > 0) {
      showParcoursValidationToast(validationErrors, updateStep);
      return;
    }

    setIsPublishing(true);
    try {
      const data = await parcoursApi.mutations.publishParcours(id, true);
      if (data.success) {
        toast.success(data.message);
        navigate(`/admin/parcours/view/${id}`);
      }
    } catch {
      toast.error("Erreur lors de la publication");
    } finally {
      setIsPublishing(false);
    }
  };

  const renderActualStep = () => {
    switch (actualStep.id) {
      case 1:
        return id && <ParcoursInformations parcoursId={id} />;
      case 2:
        return (
          <ParcoursSection
            title="Importer une liste d'objectifs"
            fieldKey="objectives"
            onResetList={handleResetImportedObjectives}
            readOnly={isTeacher}
            children={[
              <ObjectivesList readOnly={isTeacher} />,
              <ImportObjectives
                importedObjectives={importedObjectives}
                onImport={setImportedObjectives}
              />,
            ]}
          />
        );
      case 3:
        return (
          <ParcoursSection
            title="Importer des compétences"
            fieldKey="skills"
            onResetList={handleResetImportedSkills}
            children={[
              <SkillsList />,
              <ImportSkills
                importedSkills={importedSkills}
                onImport={setImportedSkills}
              />,
            ]}
          />
        );
      case 4:
        return (
          <ModuleComponent
            setModuleFormOpened={setModuleFormOpened}
            titleActionsTarget={titleActionsTarget}
          />
        );
      case 5:
        return <Calendrier titleActionsTarget={titleActionsTarget} />;
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
          <div className="w-full flex flex-col items-center gap-y-4 md:gap-y-8">
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
              <ParcoursStickyStepper
                actualStep={actualStep}
                stepsList={contextualStepsList}
                updateStep={updateStep}
              />
              <div className="mt-4 w-full md:mt-8" data-chatbot-target="parcours-step-content">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                  <h1 className="text-2xl font-extrabold md:text-3xl">{actualStepTitle}</h1>
                  <div ref={setTitleActionsTarget} className="empty:hidden" />
                </div>
                <div className="mt-6 md:mt-8">{renderActualStep()}</div>
              </div>
              {actualStep.id !== stepsList.length && !moduleFormOpened ? (
                <FloatingBottomNavigation
                  startActions={
                    // Mobile : « Retour » et « Publier » se réduisent à leur icône, le texte reste pour les lecteurs d'écran.
                    <button
                      type="button"
                      className="btn btn-outline max-md:btn-square"
                      data-chatbot-target="parcours-back"
                      onClick={handleRetour}
                    >
                      <ArrowLeft className="size-4 md:hidden" aria-hidden="true" />
                      <span className="max-md:sr-only">Retour</span>
                    </button>
                  }
                  endActions={
                    <>
                      {!isTeacher && !infos?.isPublished && (
                        <button
                          className="btn btn-primary max-md:btn-square"
                          data-chatbot-target="parcours-publish"
                          onClick={handlePublishParcours}
                          disabled={isPublishing}
                        >
                          <Send className="size-4" aria-hidden="true" />
                          <span className="max-md:sr-only">Publier</span>
                        </button>
                      )}
                      <button
                        className="btn btn-info px-3 md:px-6"
                        data-chatbot-target="parcours-next-step"
                        onClick={() => handleUpdateStep(actualStep.id)}
                      >
                        Étape suivante
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </button>
                    </>
                  }
                />
              ) : null}
            </ParcoursStepContent>
          </div>
        </FadeWrapper>
      ) : (
        <Error404 />
      )}
    </div>
  );
};

export default EditParcours;
