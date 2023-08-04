/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

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
import Stepper from "../../components/UI/stepper.component/stepper.component";
import ParcoursInformations from "../../components/edit-parcours/parcours-informations";
import Error404 from "../../components/error404";

let initialState = true;

const EditParcours = () => {
  const { id } = useParams();
  const { sendRequest, error, isLoading } = useHttp();
  const dispatch = useDispatch();
  const [image, setImage] = useState<string | undefined>(undefined);
  const { actualStep, stepsList, updateStep } = useSteps(stepsParcours);
  const nav = useNavigate();

  console.log("Edit rendering");

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
    if (initialState && id) {
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
  const handleRetour = () => {
    if (actualStep.id === 1) {
      const processData = (data: any) => {
        console.log("delete parcours", data);
        nav("/admin/parcours/add");
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
    };
  }, [dispatch]);

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
          <div className="w-full 2xl:w-4/6">
            {actualStep.id === 1 ? (
              <ParcoursInformations parcoursId={id} />
            ) : null}
          </div>
          <div className="w-full 2xl:w-4/6 mt-8 flex justify-between">
            {actualStep.id === 1 ? (
              <button
                className="btn btn-primary btn-outline"
                onClick={handleRetour}
              >
                Annuler
              </button>
            ) : null}
            <button className="btn btn-primary">Etape suivante</button>
          </div>
        </FadeWrapper>
      ) : (
        <Error404 />
      )}
    </div>
  );
};

export default EditParcours;
