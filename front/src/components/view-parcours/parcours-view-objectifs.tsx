import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";
import Objective from "../../utils/interfaces/objective";

const ParcoursViewObjectifs = () => {
  const objectives = useSelector(
    (state: any) => state.parcoursObjectives.objectives
  ) as Objective[];

  const objectivesList =
    objectives.length > 0 ? (
      objectives.map((objective, i) => (
        <div className="bg-secondary p-4 rounded-lg">
          <p className="font-bold">{`Objectif ${i + 1}`}</p>
          <p>{objective.description}</p>
        </div>
      ))
    ) : (
      <p>Aucun objectifs</p>
    );

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Objectifs</h2>
      <div>{objectivesList}</div>
    </Wrapper>
  );
};

export default ParcoursViewObjectifs;
