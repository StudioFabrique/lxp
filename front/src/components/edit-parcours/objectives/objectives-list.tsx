import { useDispatch, useSelector } from "react-redux";

import Objective from "../../../utils/interfaces/objective";
import ObjectiveItem from "./objective-item";
import ButtonAdd from "../../UI/button-add/button-add";
import useHttp from "../../../hooks/use-http";
import { parcoursObjectivesAction } from "../../../store/redux-toolkit/parcours/parcours-objectives";

const ObjectivesList = () => {
  const objectivesList = useSelector(
    (state: any) => state.parcoursObjectives.objectives
  );
  const { sendRequest } = useHttp();
  const dispatch = useDispatch();

  const handleDeletion = (id: number) => {
    const applyData = (data: {
      id: number;
      success: boolean;
      message: string;
    }) => {
      dispatch(parcoursObjectivesAction.deleteObjective(id));
    };
    sendRequest(
      {
        path: `/objective/${id}`,
        method: "delete",
      },
      applyData
    );
  };

  return (
    <>
      <ul className="flex flex-col gap-y-2">
        {objectivesList.map((item: Objective, index: number) => (
          <li key={index}>
            <ObjectiveItem objective={item} onDelete={handleDeletion} />
          </li>
        ))}
      </ul>
      <div className="mt-2">
        <ButtonAdd
          label="Ajouter un objectif"
          outline={true}
          onClickEvent={() => {}}
        />
      </div>
    </>
  );
};

export default ObjectivesList;

// TODO AJOUTER LE DRAWER
