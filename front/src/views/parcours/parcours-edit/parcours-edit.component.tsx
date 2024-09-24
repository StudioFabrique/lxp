/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router-dom";

import FadeWrapper from "../../../components/UI/fade-wrapper/fade-wrapper";
import Loader from "../../../components/UI/loader";
import Stepper from "../../../components/UI/stepper.-component/stepper.-component";
import HeaderIcon from "../../../components/UI/svg/header-icon";
import Calendrier from "../../../components/edit-parcours/calendrier/calendrier";
import ParcoursInformations from "../../../components/edit-parcours/informations/parcours-informations";
import ModulesSection from "../../../components/edit-parcours/modules-section/modules.component";
import ImportObjectives from "../../../components/edit-parcours/objectives/import-objectives";
import ObjectivesList from "../../../components/edit-parcours/objectives/objectives-list";
import ParcoursSection from "../../../components/edit-parcours/parcours-section";
import ParcoursStudents from "../../../components/edit-parcours/parcours-students/parcours-students.component";
import ParcoursPreview from "../../../components/edit-parcours/preview/parcours-preview.component";
import ImportSkills from "../../../components/edit-parcours/skills/import-skills.component";
import SkillsList from "../../../components/edit-parcours/skills/skills-list.component";
import Error404 from "../../../components/error404";
import ImageHeaderMutable from "../../../components/image-header/image-header-mutable";
import { stepsParcours } from "../../../config/steps/steps-parcours";
import { testModules } from "../../../helpers/parcours-steps-validation";
import useHttp from "../../../hooks/use-http";
import useSteps from "../../../hooks/use-steps";
import { parcoursAction } from "../../../store/redux-toolkit/parcours/parcours";
import { parcoursContactsAction } from "../../../store/redux-toolkit/parcours/parcours-contacts";
import { parcoursGroupsAction } from "../../../store/redux-toolkit/parcours/parcours-groups";
import { parcoursInformationsAction } from "../../../store/redux-toolkit/parcours/parcours-informations";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";
import { parcoursObjectivesAction } from "../../../store/redux-toolkit/parcours/parcours-objectives";
import { parcoursSkillsAction } from "../../../store/redux-toolkit/parcours/parcours-skills";
import { tagsAction } from "../../../store/redux-toolkit/tags";
import Module from "../../../utils/interfaces/module";
import useParcoursService from "./hooks/use-parcours-services";

let initialState = true;

const EditParcours = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { sendRequest } = useHttp();
  const dispatch = useDispatch();
  const { actualStep, finalStep, stepsList, updateStep, validateStep } =
    useSteps(stepsParcours);
  const infos = useSelector((state: any) => state.parcoursInformations.infos);
  const formation = useSelector((state: any) => state.parcours.formation);
  const { image, getParcours, isLoading, error } = useParcoursService();
  const modules = useSelector(
    (state: any) => state.parcoursModules.modules,
  ) as Module[];
  const checkStep = useRef(true);

  const step = searchParams.get("step");

  /**
   * télécharge les données du parcours depuis la bdd et initialise les différentes propriétés du parcours
   */
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

  /**
   * réinitialise les données du parcours lorsque l'utilisateur quitte la page
   */
  useEffect(() => {
    return () => {
      initialState = true;
      dispatch(parcoursAction.reset());
      dispatch(parcoursInformationsAction.reset());
      dispatch(tagsAction.reset());
      dispatch(parcoursContactsAction.reset());
      dispatch(parcoursSkillsAction.reset());
      dispatch(parcoursObjectivesAction.reset());
      dispatch(parcoursModulesSliceActions.resetModule());
      dispatch(parcoursGroupsAction.resetGroups());
    };
  }, [dispatch]);

  /**
   * enregistrement de l'image du parcours dans la bdd
   */
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

  /**
   * valide l'étape en cours et affiche le composant
   * correspondant à l'étape suivante de la création de
   * cours
   * @param id number
   */
  const handleUpdateStep = (id: number) => {
    if (id === 4 && (!modules || !testModules(modules))) {
      id += 1;
    }
    validateStep(id, true);
  };

  /**
   * actualise le stepper et affiche le composant précédent
   * associé à l'étape précédente
   */
  const handleRetour = () => {
    if (actualStep.id === 6 && (!modules || !testModules(modules))) {
      updateStep(4);
    } else updateStep(actualStep.id - 1);
  };

  const handleResetImportedSkills = () => {
    dispatch(parcoursSkillsAction.importSkills([]));
  };

  const handleResetImportedObjectives = () => {};

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-8 py-2">
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
                isPublished
              >
                <HeaderIcon />
              </ImageHeaderMutable>
            ) : null}
            {/* Etapes du parcours */}
            <div className="p-4 rounded-xl w-5/6 bg-secondary/20">
              <Stepper
                actualStep={actualStep}
                finalStep={finalStep}
                stepsList={stepsList}
                updateStep={updateStep}
              />
            </div>
          </div>
          <div className="w-full 2xl:w-4/6 mt-16">
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
            {actualStep.id === 4 && id ? <ModulesSection /> : null}
            {actualStep.id === 5 ? <Calendrier /> : null}
            {actualStep.id === 6 ? <ParcoursStudents /> : null}
            {actualStep.id === 7 ? (
              <ParcoursPreview onEdit={updateStep} />
            ) : null}
          </div>
          <div className="w-full 2xl:w-4/6 mt-8 flex justify-between">
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
                    className="btn btn-primary"
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
