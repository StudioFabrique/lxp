import { Telescope } from "lucide-react";
import Objective from "../../../utils/interfaces/objective";
import Wrapper from "../../UI/wrapper/wrapper.component";

type ObjectifsProps = {
  objectives: Objective[];
};

const Objectifs = ({ objectives }: ObjectifsProps) => {
  return (
    <Wrapper additionalClassname="w-full">
      <div className="flex flex-col gap-2 p-2">
        <div className="flex gap-2">
          <Telescope />
          <h3 className="text-xl font-bold">Objectifs du module</h3>
        </div>
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
