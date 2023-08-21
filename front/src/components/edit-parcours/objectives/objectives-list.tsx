import { useSelector } from "react-redux";

import Objective from "../../../utils/interfaces/objective";
import ObjectiveItem from "./objective-item";
import ButtonAdd from "../../UI/button-add/button-add";

const ObjectivesList = () => {
  const objectivesList = useSelector(
    (state: any) => state.parcoursObjectives.objectives
  );

  return (
    <>
      <ul className="flex flex-col gap-y-2">
        {objectivesList.map((item: Objective, index: number) => (
          <li key={index}>
            <ObjectiveItem objective={item} />
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
