/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";
import Objective from "../../utils/interfaces/objective";

const Objectifs = () => {
  const objectives = useSelector(
    (state: any) => state.parcoursObjectives.objectives
  ) as Objective[];

  const objectivesList =
    objectives.length > 0 ? (
      objectives.map((objective) => (
        <div
          key={objective.id}
          className="bg-secondary p-4 rounded-lg text-secondary-content"
        >
          <p className="font-bold first-letter:uppercase">
            {objective.description}
          </p>
          <p>Ipsume Litus lorem cand</p>
        </div>
      ))
    ) : (
      <p>Aucun objectifs</p>
    );

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Objectifs</h2>
      <div className="flex flex-col gap-y-5 overflow-y-auto h-[60vh]">
        {objectivesList}
      </div>
    </Wrapper>
  );
};

export default Objectifs;
