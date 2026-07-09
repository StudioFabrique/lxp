import Objective from "../../utils/interfaces/objective";
import EditIcon from "../UI/svg/edit-icon";
import BoxWrapper from "../wrappers/BoxWrapper";
import SubBoxWrapper from "../wrappers/SubBoxWrapper";

interface ParcoursPreviewObjectivesProps {
  objectives: Objective[];
  onEdit: (id: number) => void;
}

const PreviewObjectives = (props: ParcoursPreviewObjectivesProps) => {
  const { objectives } = props;

  return (
    <article>
      <BoxWrapper>
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
              <SubBoxWrapper>{objective.description}</SubBoxWrapper>
            </li>
          ))}
        </ul>
      </BoxWrapper>
    </article>
  );
};

export default PreviewObjectives;
