import Objective from "../../utils/interfaces/objective";
import Wrapper from "../UI/wrapper/wrapper.component";

type ObjectifsProps = {
  objectives: Objective[];
};

const Objectifs = ({ objectives }: ObjectifsProps) => {
  return (
    <Wrapper>
      <div className="flex flex-col gap-2 p-2">
        <h3 className="text-xl font-bold">Objectifs du module</h3>
        <ul className="list-disc pl-5">
          {objectives.map((objective) => (
            <li key={objective.id}>{objective.description}</li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
};

export default Objectifs;
