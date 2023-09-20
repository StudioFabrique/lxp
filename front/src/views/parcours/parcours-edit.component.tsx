/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Parcours from "../../utils/interfaces/parcours";
import { parcoursAction } from "../../store/redux-toolkit/parcours/parcours";
import { parcoursInformationsAction } from "../../store/redux-toolkit/parcours/parcours-informations";
import useHttp from "../../hooks/use-http";
import useSteps from "../../hooks/use-steps";
import { stepsParcours } from "../../config/steps/steps-parcours";
import { tagsAction } from "../../store/redux-toolkit/tags";
import { parcoursContactsAction } from "../../store/redux-toolkit/parcours/parcours-contacts";
import Loader from "../../components/UI/loader";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import ImageHeader from "../../components/image-header/image-header";
import Error404 from "../../components/error404";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";
import Stepper from "../../components/UI/stepper.-component/stepper.-component";
import ParcoursInformations from "../../components/edit-parcours/informations/parcours-informations";
import ParcoursSection from "../../components/edit-parcours/parcours-section";
import SkillsList from "../../components/edit-parcours/skills/skills-list.component";
import ImportSkills from "../../components/edit-parcours/skills/import-skills.component";
import ImportObjectives from "../../components/edit-parcours/objectives/import-objectives";
import ObjectivesList from "../../components/edit-parcours/objectives/objectives-list";
import { parcoursObjectivesAction } from "../../store/redux-toolkit/parcours/parcours-objectives";
import Module from "../../utils/interfaces/module";
import Calendrier from "../../components/edit-parcours/calendrier/calendrier";
import { parcoursModulesSliceActions } from "../../store/redux-toolkit/parcours/parcours-modules";
import ParcoursModules from "../../components/edit-parcours/modules/parcours-modules";
import toast from "react-hot-toast";
import { testStep } from "../../helpers/parcours-steps-validation";

let initialState = true;

const EditParcours = () => {
  const { id } = useParams();
  const { sendRequest, error } = useHttp();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [image, setImage] = useState<string | undefined>(undefined);
  const { actualStep, finalStep, stepsList, updateStep, validateStep } =
    useSteps(stepsParcours);
  const nav = useNavigate();
  const infos = useSelector((state: any) => state.parcoursInformations.infos);
  const skills = useSelector((state: any) => state.parcoursSkills.skills);
  const objectives = useSelector(
    (state: any) => state.parcoursObjectives.objectives
  );
  const tags = useSelector((state: any) => state.tags.currentTags);
  const contacts = useSelector(
    (state: any) => state.parcoursContacts.currentContacts
  );
  const modules = useSelector((state: any) => state.parcoursModules.modules);

  /**
   * télécharge les données du parcours depuis la bdd et initialise les différentes propriétés du parcours
   */
  useEffect(() => {
    const processData = (data: Parcours) => {
      // mets en mémoire l'id du parcours pour le rendre disponible aux éléments de la vue
      dispatch(parcoursAction.setParcoursId(data.id));
      dispatch(
        parcoursInformationsAction.updateParcoursInfos({
          title: data.title,
          description: data.description,
        })
      );
      dispatch(
        parcoursInformationsAction.updateParcoursDates({
          startDate: data.startDate,
          endDate: data.endDate,
        })
      );
      dispatch(parcoursAction.setParcoursFormation(data.formation));
      if (data.image) {
        setImage(`data:image/jpeg;base64,${data.image}`);
      }
      if (data.tags.length > 0) {
        dispatch(
          tagsAction.setCurrentTags(data.tags.map((item: any) => item.tag))
        );
      } else {
        dispatch(
          tagsAction.setCurrentTags(
            data.formation.tags.map((item: any) => item.tag)
          )
        );
      }

      if (data.virtualClass) {
        dispatch(parcoursInformationsAction.setVirtualClass(data.virtualClass));
      }

      if (data.contacts.length > 0) {
        dispatch(
          parcoursContactsAction.setCurrentContacts(
            data.contacts.map((item: any) => item.contact)
          )
        );
      }
      if (data.skills.length > 0) {
        dispatch(
          parcoursSkillsAction.setSkillsList(
            data.skills.map((item: any) => item.skill)
          )
        );
      }

      if (data.bonusSkills.length > 0) {
        dispatch(parcoursSkillsAction.setSkillsList(data.bonusSkills));
      }

      if (data.objectives.length > 0) {
        dispatch(
          parcoursObjectivesAction.addImportedObjectivesToObjectives(
            data.objectives
          )
        );
      }

      setIsLoading(false);
    };
    if (initialState) {
      setIsLoading(true);
      sendRequest(
        {
          path: `/parcours/parcours-by-id/${id}`,
        },
        processData
      );
      initialState = false;
    }
  }, [id, dispatch, sendRequest]);

  /**
   * renvoie l'utilisateur à la page de création du parcours
   */
  const handleCancel = () => {
    nav("/admin/parcours/créer-un-parcours");
  };

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
    };
  }, [dispatch]);

  /*   const handleUpdateStep = (id: number) => {
    if (id < actualStep.id || id === 1) {
      updateStep(id);
    } else if (checkStep(actualStep.id) && checkStep(id - 1)) {
      validateStep(actualStep.id, checkStep(actualStep.id));
      updateStep(id);
    }
  }; /*

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
          path: "/parcours/update-image",
          method: "put",
          body: formData,
        },
        processData
      );
    },
    [id, sendRequest]
  );

  /**
   * vérifie si une étape est valide pour pouvoir passer à la suivante
   * si le tableau retourné est vide aucune erreur a été rencontrée
   * @param id number
   */
  const handleUpdateStep = (id: number) => {
    console.log(id);

    const errors = checkStep(id);

    if (errors!.length !== 0) {
      validateStep(id, false);
      toast.error(Object.values(errors![0]).toString());
      return;
    } else {
      if (id === stepsList[stepsList.length - 1].id - 1) {
        const finalErrors = checkStep(id + 1);
        if (finalErrors!.length === 0) {
          validateStep(id, true);
        } else {
          toast.error(Object.values(finalErrors![0]).toString());
          return;
        }
      }
      validateStep(id, true);
    }

    validateStep(id, true);
  };

  /**
   * retourne divers messages d'erreurs en fonction de la section vérifiée
   * @param id number
   * @returns any[]
   */
  const checkStep = (id: number) => {
    switch (id) {
      case 1:
        return testStep(id, infos.title);
      case 2:
        return testStep(id, objectives);
      case 3:
        return testStep(id, skills);
      case 4:
        return testStep(id, modules);
      case 5:
        return testStep(id, {
          infos,
          tags,
          contacts,
          objectives,
          skills,
          modules,
        });
    }
  };

  const handleRetour = () => {
    updateStep(actualStep.id - 1);
  };

  const handleResetImportedSkills = () => {
    dispatch(parcoursSkillsAction.importSkills([]));
  };

  const handleResetImportedObjectives = () => {};

  console.log({ stepsList });

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-8 py-2">
      {isLoading ? (
        <Loader />
      ) : error.length === 0 ? (
        <FadeWrapper>
          <div className="w-full flex flex-col items-center gap-y-8">
            <ImageHeader
              defaultImage="/images/parcours-default.webp"
              image={image}
              onUpdateImage={updateImage}
            />
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
            {actualStep.id === 1 ? (
              <ParcoursInformations parcoursId={id} />
            ) : null}
            {actualStep.id === 2 ? (
              <ParcoursSection
                title="Importer une liste d'objectifs"
                onResetList={handleResetImportedObjectives}
              >
                <ObjectivesList />
                <ImportObjectives onCloseDrawer={() => {}} />
              </ParcoursSection>
            ) : null}
            {actualStep.id === 3 ? (
              <ParcoursSection
                title="Importer des compétences"
                onResetList={handleResetImportedSkills}
              >
                <SkillsList />
                <ImportSkills onCloseDrawer={() => {}} />
              </ParcoursSection>
            ) : null}
            {actualStep.id === 4 ? <ParcoursModules /> : null}
            {actualStep.id === 5 ? <Calendrier /> : null}
          </div>
          <div className="w-full 2xl:w-4/6 mt-8 flex justify-between">
            {actualStep.id === 1 ? (
              <button
                className="btn btn-primary btn-outline"
                onClick={handleCancel}
              >
                Retour
              </button>
            ) : (
              <button
                className="btn btn-primary btn-outline"
                onClick={handleRetour}
              >
                Retour
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={() => handleUpdateStep(actualStep.id)}
            >
              Etape suivante
            </button>
          </div>
        </FadeWrapper>
      ) : (
        <Error404 />
      )}
    </div>
  );
};

export default EditParcours;
