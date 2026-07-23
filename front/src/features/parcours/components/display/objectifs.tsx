import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { useParams } from "react-router";
import { useParcoursQuery } from "../../hooks/useParcoursQuery";

const Objectifs = () => {
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(id ? Number(id) : undefined);
  const objectives = parcours?.objectives ?? [];

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
