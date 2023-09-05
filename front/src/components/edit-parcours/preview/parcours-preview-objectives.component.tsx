import { useSelector } from "react-redux";

import Objective from "../../../utils/interfaces/objective";
import Wrapper from "../../UI/wrapper/wrapper.component";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";

const ParcoursPreviewObjectives = () => {
  const objectives = useSelector(
    (state: any) => state.parcoursObjectives.objectives
  ) as Objective[];

  return (
    <article>
      <Wrapper>
        <h2 className="text-xl font-bold">Objectifs du parcours</h2>
        <ul className="flex flex-col gap-y-2">
          {objectives.map((objective) => (
            <li key={objective.id}>
              <SubWrapper>{objective.description}</SubWrapper>
            </li>
          ))}
        </ul>
      </Wrapper>
    </article>
  );
};

export default ParcoursPreviewObjectives;
