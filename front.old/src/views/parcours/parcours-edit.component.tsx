/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import toast from "react-hot-toast";
import { testStep } from "../../helpers/parcours-steps-validation";
import ParcoursPreview from "../../components/edit-parcours/preview/parcours-preview.component";
import ModulesSection from "../../components/edit-parcours/modules-section/modules.component";
import Calendrier from "../../components/edit-parcours/calendrier/calendrier";
import { parcoursModulesSliceActions } from "../../store/redux-toolkit/parcours/parcours-modules";
import ParcoursStudents from "../../components/edit-parcours/parcours-students/parcours-students.component";
import { parcoursGroupsAction } from "../../store/redux-toolkit/parcours/parcours-groups";
import HeaderIcon from "../../components/UI/svg/header-icon";
import ImageHeaderMutable from "../../components/image-header/image-header-mutable";

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
  const groups = useSelector((state: any) => state.parcoursGroups.groups);
  const formation = useSelector((state: any) => state.parcours.formation);

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
          isPublished: data.isPublished,
          visibility: data.visibility,
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

      if (data.modules.length > 0) {
        dispatch(
          parcoursModulesSliceActions.setModules(
            data.modules.map((item: any) => {
              return {
                ...item.module,
                contacts: item.module.contacts.map(
                  (itemContact: any) => itemContact.contact
                ),
                bonusSkills: item.module.bonusSkills.map(
                  (itemBonusSkills: any) => itemBonusSkills.bonusSkill
                ),
              };
            })
          )
        );
      } else {
        dispatch(parcoursModulesSliceActions.setModules([]));
      }

      if (data.groups.length > 0) {
        dispatch(
          parcoursGroupsAction.setGroupsIds(
            data.groups.map((item: any) => item.group)
          )
        );
      } else {
        dispatch(parcoursGroupsAction.setGroups([]));
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
    const errors = checkStep(id);
    if (errors && errors.length !== 0) {
      validateStep(id, false);
      toast.error(Object.values(errors![0]).toString());
      return;
    }
    validateStep(id, true);
    return errors;
  };

  /**
   * retourne divers messages d'erreurs en fonction de la section vérifiée
   * @param id number
   * @returns any[]
   */
  const checkStep = (id: number) => {
    switch (id) {
      case 1:
        return testStep(id, infos);
      case 2:
        return testStep(id, objectives);
      case 3:
        return testStep(id, skills);
      case 4:
        return testStep(id, modules);
      case 5:
        return testStep(id, {});
      case 6:
        return testStep(id, groups);
      case 7:
        return testStep(id, {
          infos,
          tags,
          contacts,
          objectives,
          skills,
          modules,
          groups,
        });
    }
  };

  /**
   * actualise le stepper et affiche le composant précédent
   * associé à l'étape précédente
   */
  const handleRetour = () => {
    updateStep(actualStep.id - 1);
  };

  const handleResetImportedSkills = () => {
    dispatch(parcoursSkillsAction.importSkills([]));
  };

  const handleResetImportedObjectives = () => {};

  const handlePublishParcours = () => {
    const errors = handleUpdateStep(7);
    if (errors && errors.length === 0) {
      const applyData = (data: any) => {
        if (data.success) {
          toast.success(data.message);
          setTimeout(() => {
            nav("/admin/parcours");
          }, 1000);
        }
      };
      sendRequest(
        {
          path: `/parcours/publish/${1}`,
          method: "put",
        },
        applyData
      );
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-8 py-2">
      {isLoading ? (
        <Loader />
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
            {/* Premiere étape : infos générales du parcours */}
            {actualStep.id === 1 ? (
              <ParcoursInformations parcoursId={id} />
            ) : null}
            {/* Seconde étape : liste des objectifs */}
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
            {/* Troisème étape : liste des compétences */}
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
            {/* Quatrième étape : liste des modules */}
            {actualStep.id === 4 && id ? <ModulesSection /> : null}
            {actualStep.id === 5 ? <Calendrier /> : null}
            {/* Cinquième étape : liste des étudiants */}
            {/* {actualStep.id === 5 ? <ParcoursStudents /> : null} */}
            {/* Etape finale : aperçu du parcours */}
            {actualStep.id === 6 ? <ParcoursStudents /> : null}
            {actualStep.id === 7 ? (
              <ParcoursPreview onEdit={updateStep} />
            ) : null}
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
            {actualStep.id !== stepsList.length ? (
              <button
                className="btn btn-primary"
                onClick={() => handleUpdateStep(actualStep.id)}
              >
                Etape suivante
              </button>
            ) : (
              <div className="flex gap-x-4 items-center">
                <Link className="btn btn-secondary" to="..">
                  Sauvegarder le brouillon
                </Link>
                <button
                  className="btn btn-primary"
                  onClick={handlePublishParcours}
                >
                  Publier
                </button>
              </div>
            )}
          </div>
        </FadeWrapper>
      ) : (
        <Error404 />
      )}
    </div>
  );
};

export default EditParcours;