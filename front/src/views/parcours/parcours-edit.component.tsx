/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Parcours from "../../utils/interfaces/parcours";
import { parcoursAction } from "../../store/redux-toolkit/parcours/parcours";
import { parcoursInformationsAction } from "../../store/redux-toolkit/parcours/parcours-informations";
import useHttp from "../../hooks/use-http";
import useSteps from "../../hooks/use-steps";
import { stepsParcours } from "../../config/steps/steps-parcours";
import { tagsAction } from "../../store/tags";
import { parcoursContactsAction } from "../../store/redux-toolkit/parcours/parcours-contacts";
import Loader from "../../components/UI/loader";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import ImageHeader from "../../components/image-header/image-header";
import ParcoursInformations from "../../components/edit-parcours/parcours-informations";
import Error404 from "../../components/error404";
import Stepper from "../../components/UI/stepper.-component/stepper.-component";
import Skills from "../../components/skills/skills.component";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";

let initialState = true;

const EditParcours = () => {
  const { id } = useParams();
  const { sendRequest, error, isLoading } = useHttp();
  const dispatch = useDispatch();
  const [image, setImage] = useState<string | undefined>(undefined);
  const { actualStep, stepsList, updateStep, validateStep } =
    useSteps(stepsParcours);
  const nav = useNavigate();
  const informationsIsValid = useSelector(
    (state: any) => state.parcoursInformations.isValid
  );

  /**
   * télécharge les données du parcours depuis la bdd et initialise les différentes propriétés du parcours
   */
  useEffect(() => {
    const processData = (data: Parcours) => {
      console.log("parcours", data);

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
      if (data.contacts.length > 0) {
        dispatch(
          parcoursContactsAction.setCurrentContacts(
            data.contacts.map((item: any) => item.contact)
          )
        );
      }
    };
    if (initialState) {
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
   * renvoie l'utilisateur à la page de création du parcours après avoir supprimé de la bdd le parcours qui était en cours d'édition
   */
  const handleCancel = () => {
    if (actualStep.id === 1) {
      const processData = (data: any) => {
        console.log("delete parcours", data);
        nav("/admin/parcours/créer-un-parcours");
      };
      sendRequest(
        {
          path: `/parcours/delete/${id}`,
          method: "delete",
        },
        processData
      );
    }
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
    };
  }, [dispatch]);

  const handleUpdateStep = (id: number) => {
    if (id < actualStep.id || id === 1) {
      updateStep(id);
    } else if (checkStep(actualStep.id) && checkStep(id - 1)) {
      console.log("all good");

      validateStep(actualStep.id, checkStep(actualStep.id));
      updateStep(id);
    }
  };

  const checkStep = (id: number) => {
    switch (id) {
      case 1:
        return informationsIsValid;
      default:
        return false;
    }
  };

  const handleRetour = () => {
    updateStep(actualStep.id - 1);
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-8 py-2">
      {isLoading ? (
        <Loader />
      ) : error.length === 0 ? (
        <FadeWrapper>
          <div className="w-full flex flex-col items-center gap-y-8">
            <ImageHeader image={image} />
            <div className="p-4 rounded-xl w-5/6 bg-secondary/20">
              <Stepper
                actualStep={actualStep}
                stepsList={stepsList}
                updateStep={updateStep}
              />
            </div>
          </div>
          <div className="w-full 2xl:w-4/6 mt-16">
            {actualStep.id === 1 ? (
              <ParcoursInformations parcoursId={id} />
            ) : null}
            {actualStep.id === 2 ? <Skills /> : null}
          </div>
          <div className="w-full 2xl:w-4/6 mt-8 flex justify-between">
            {actualStep.id === 1 ? (
              <button
                className="btn btn-primary btn-outline"
                onClick={handleCancel}
              >
                Annuler
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
              onClick={() => handleUpdateStep(actualStep.id + 1)}
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
