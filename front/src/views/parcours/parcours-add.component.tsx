import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import useHttp from "../../hooks/use-http";
import { stepsParcours } from "../../config/steps/steps-parcours";
import useSteps from "../../hooks/use-steps";
import { parcoursAction } from "../../store/redux-toolkit/parcours/parcours";
import Parcours from "../../utils/interfaces/parcours";
import { parcoursInformationsAction } from "../../store/redux-toolkit/parcours/parcours-informations";
import { LoaderIcon } from "react-hot-toast";
import Error404 from "../../components/UI/error404";
import ParcoursHeader from "../../components/groups-header/groups-header.component";
import ImageHeader from "../../components/UI/image-header/image-header.component";
import Stepper from "../../components/UI/stepper.component/stepper.component";

const EditParcours = () => {
  const { parcoursId } = useParams();
  const { sendRequest, isLoading, error } = useHttp();
  const dispatch = useDispatch();
  const [image, setImage] = useState<string | undefined>(undefined);
  const { actualStep, stepsList, updateStep } = useSteps(stepsParcours);

  useEffect(() => {
    const processData = (data: Parcours) => {
      console.log({ data });
      dispatch(parcoursAction.setParcoursId(data.id));
      dispatch(
        parcoursInformationsAction.updateParcoursInfos({ title: data.title })
      );
      dispatch(parcoursAction.setParcoursFormation(data.formation));
      if (data.image) {
        setImage(`data:image/jpeg;base64,${data.image}`);
      }
    };
    sendRequest(
      {
        path: `/parcours/parcours-by-id/1`,
      },
      processData
    );
  }, [parcoursId, dispatch, sendRequest]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center p-8">
      {isLoading ? (
        <LoaderIcon />
      ) : error.length > 0 ? (
        <Error404 />
      ) : (
        <div className="flex flex-col gap-y-8">
          <ParcoursHeader />
          <ImageHeader image={image} />
          <Stepper
            actualStep={actualStep}
            stepsList={stepsList}
            updateStep={updateStep}
          />
        </div>
      )}
    </div>
  );
};

export default EditParcours;
