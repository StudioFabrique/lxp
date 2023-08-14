import { useSelector } from "react-redux";

import Objective from "../../../utils/interfaces/objective";

const ObjectivesList = () => {
  const objectivesList = useSelector(
    (state: any) => state.parcoursObjectives.objectives
  );

  return (
    <ul className="flex flex-col gap-y-2">
      {objectivesList.map((item: Objective, index: number) => (
        <li className="p-2 rounded-lg bg-neutral" key={index}>
          {item.description}
        </li>
      ))}
    </ul>
  );
};

export default ObjectivesList;
