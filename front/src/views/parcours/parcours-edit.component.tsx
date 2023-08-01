/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import Parcours from "../../utils/interfaces/parcours";
import { stepsParcours } from "../../config/steps/steps-parcours";
import useSteps from "../../hooks/use-steps";
import useHttp from "../../hooks/use-http";
import { parcoursAction } from "../../store/redux-toolkit/parcours/parcours";
import { parcoursInformationsAction } from "../../store/redux-toolkit/parcours/parcours-informations";
import Loader from "../../components/UI/loader";
import ImageHeader from "../../components/image-header/image-header";
import Stepper from "../../components/UI/stepper.component/stepper.component";
import ParcoursInformations from "../../components/edit-parcours/parcours-informations";
import ParcoursHeader from "../../components/edit-parcours/parcours-header";

let initialState = true;

const EditParcours = () => {
  const { id } = useParams();
  const { sendRequest, isLoading } = useHttp();
  const dispatch = useDispatch();
  const [image, setImage] = useState<string | undefined>(undefined);
  const { actualStep, stepsList, updateStep } = useSteps(stepsParcours);

  console.log("edit rendering");

  useEffect(() => {
    const processData = (data: Parcours) => {
      console.log({ data });
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

  return (
    <div className="w-full h-full flex flex-col justify-start items-center p-8">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex flex-col gap-y-8">
            <ParcoursHeader />
            <ImageHeader image={image} />
            <Stepper
              actualStep={actualStep}
              stepsList={stepsList}
              updateStep={updateStep}
            />
          </div>
          <div className="w-full 2xl:w-4/6">
            {actualStep.id === 1 ? (
              <ParcoursInformations parcoursId={id} />
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default EditParcours;
