/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import {
  useParcoursSelector,
  useParcoursDispatch,
} from "../store/ParcoursContext";

import FadeWrapper from "../../../../src.legacy/components/UI/fade-wrapper/fade-wrapper";
import Loader from "../../../../src.legacy/components/UI/loader";
import Stepper from "../../../../src.legacy/components/UI/stepper.-component/stepper.-component";
import HeaderIcon from "../../../../src.legacy/components/UI/svg/header-icon";
import Calendrier from "../components/edit/calendrier/calendrier";
import ParcoursInformations from "../components/edit/informations/parcours-informations";
import ImportObjectives from "../components/edit/objectives/import-objectives";
import ObjectivesList from "../components/edit/objectives/objectives-list";
import ParcoursSection from "../components/edit/parcours-section";
import ParcoursStudents from "../components/edit/students/parcours-students.component";
import ParcoursPreview from "../components/edit/preview/parcours-preview.component";
import ImportSkills from "../components/edit/skills/import-skills.component";
import SkillsList from "../components/edit/skills/skills-list.component";
import Error404 from "../../../../src.legacy/components/error404";
import ImageHeaderMutable from "../../../../src.legacy/components/image-header/image-header-mutable";
import { stepsParcours } from "../../../../src.legacy/config/steps/steps-parcours";
import { testModules } from "../../../../src.legacy/helpers/parcours-steps-validation";
import useHttp from "../../../../src.legacy/hooks/use-http";
import useSteps from "../../../../src.legacy/hooks/use-steps";
import useParcoursService from "../hooks/useParcoursServices";
import ModuleComponent from "../components/edit/modules/module";

let initialState = true;

const EditParcours = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { sendRequest } = useHttp();
  const dispatch = useParcoursDispatch();
  const { actualStep, finalStep, stepsList, updateStep, validateStep } =
    useSteps(stepsParcours);
  const infos = useParcoursSelector(
    (state) => state.parcoursInformations.infos,
  );
  const formation = useParcoursSelector((state) => state.parcours.formation);
  const { image, getParcours, isLoading, error } = useParcoursService();
  const modules = useParcoursSelector((state) => state.parcoursModules.modules);
  const checkStep = useRef(true);

  const step = searchParams.get("step");

  useEffect(() => {
    if (id !== undefined && initialState) {
      getParcours(+id);
      initialState = false;
    }
  }, [id, getParcours]);

  useEffect(() => {
    if (step && checkStep.current) {
      updateStep(+step);
      checkStep.current = false;
    }
  }, [step, updateStep]);

  useEffect(() => {
    return () => {
      initialState = true;
      dispatch({ type: "RESET_PARCOURS" });
      dispatch({ type: "RESET_PARCOURS_INFORMATIONS" });
      dispatch({ type: "RESET_TAGS" });
      dispatch({ type: "RESET_CONTACTS" });
      dispatch({ type: "RESET_SKILLS" });
      dispatch({ type: "RESET_OBJECTIVES" });
      dispatch({ type: "RESET_MODULES" });
      dispatch({ type: "RESET_GROUPS" });
    };
  }, [dispatch]);

  const updateImage = useCallback(
    (image: File) => {
      const formData = new FormData();
      formData.append("parcoursId", id!);
      formData.append("image", image);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const processData = (_data: any) => {};
      sendRequest(
        {
          path: `/parcours/update-image/${id}`,
          method: "put",
          body: formData,
        },
        processData,
      );
    },
    [id, sendRequest],
  );

  const handleUpdateStep = (id: number) => {
    validateStep(id, true);
  };

  const handleRetour = () => {
    if (actualStep.id === 6 && (!modules || !testModules(modules))) {
      updateStep(4);
    } else updateStep(actualStep.id - 1);
  };

  const handleResetImportedSkills = () => {
    dispatch({ type: "IMPORT_SKILLS", payload: [] });
  };

  const handleResetImportedObjectives = () => {};

  return (
    <div className="w-full h-full flex flex-col justify-start items-center">
      {isLoading ? (
        <div className="h-[100vh] flex items-center">
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
          <div className="w-full mt-16">
            {actualStep.id === 1 && id ? (
              <ParcoursInformations parcoursId={id} />
            ) : null}
            {actualStep.id === 2 ? (
              <ParcoursSection
                section="Objectifs"
                title="Importer une liste d'objectifs"
                onResetList={handleResetImportedObjectives}
              >
                <ObjectivesList />
                <ImportObjectives onCloseDrawer={() => {}} />
              </ParcoursSection>
            ) : null}
            {actualStep.id === 3 ? (
              <ParcoursSection
                section="Compétences"
                title="Importer des compétences"
                onResetList={handleResetImportedSkills}
              >
                <SkillsList />
                <ImportSkills onCloseDrawer={() => {}} />
              </ParcoursSection>
            ) : null}
            {actualStep.id === 4 && id ? <ModuleComponent /> : null}
            {actualStep.id === 5 ? <Calendrier /> : null}
            {actualStep.id === 6 ? <ParcoursStudents /> : null}
            {actualStep.id === 7 ? (
              <ParcoursPreview onEdit={updateStep} />
            ) : null}
          </div>
          <div className="w-full mt-8 flex justify-between">
            {actualStep.id !== stepsList.length ? (
              <>
                {actualStep.id === 1 ? (
                  <Link
                    className="btn btn-primary btn-outline"
                    to="/admin/parcours"
                  >
                    Retour
                  </Link>
                ) : (
                  <button
                    className="btn btn-primary btn-outline"
                    onClick={handleRetour}
                  >
                    Retour
                  </button>
                )}
                {actualStep.id !== stepsList.length ? (
                  <button
                    className="btn btn-primary z-1"
                    onClick={() => handleUpdateStep(actualStep.id)}
                  >
                    Etape suivante
                  </button>
                ) : null}
              </>
            ) : null}
          </div>
        </FadeWrapper>
      ) : (
        <Error404 />
      )}
    </div>
  );
};

export default EditParcours;
