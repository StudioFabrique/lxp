import { useSelector } from "react-redux";

import Objective from "../../../utils/interfaces/objective";
import Wrapper from "../../UI/wrapper/wrapper.component";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import EditIcon from "../../UI/svg/edit-icon";

interface ParcoursPreviewObjectivesProps {
  onEdit: (id: number) => void;
}

const ParcoursPreviewObjectives = (props: ParcoursPreviewObjectivesProps) => {
  const objectives = useSelector(
    (state: any) => state.parcoursObjectives.objectives
  ) as Objective[];

  return (
    <article>
      <Wrapper>
        <span className="w-full flex justify-between items-center">
          <h2 className="text-xl font-bold">Objectifs du parcours</h2>
          <div
            className="w-6 h-6 text-primary cursor-pointer"
            onClick={() => props.onEdit(2)}
          >
            <EditIcon />
          </div>
        </span>
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
