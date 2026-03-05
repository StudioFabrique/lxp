/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";
import Objective from "../../utils/interfaces/objective";

const Objectifs = () => {
  const objectives = useSelector(
    (state: any) => state.parcoursObjectives.objectives,
  ) as Objective[];

  const objectivesList =
    objectives.length > 0 ? (
      objectives.map((objective) => (
        <div
          key={objective.id}
          className="bg-base-200 border border-base-300 p-4 rounded-lg text-base-content shadow-sm"
        >
          <p className="first-letter:uppercase">{objective.description}</p>
        </div>
      ))
    ) : (
      <p>Aucun objectifs</p>
    );

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Objectifs</h2>
      <div className="flex flex-col gap-y-2 overflow-y-auto h-[60vh]">
        {objectivesList}
      </div>
    </Wrapper>
  );
};

export default Objectifs;
