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
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square text-primary"
            onClick={() => props.onEdit(2)}
            aria-label="Modifier les objectifs du parcours"
          >
            <span className="size-5">
              <EditIcon />
            </span>
          </button>
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
