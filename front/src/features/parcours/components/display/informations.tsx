import { useParcoursSelector } from "../../store/ParcoursContext";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";

const Informations = () => {
  const infos = useParcoursSelector((state) => state.parcoursInformations.infos);
  const diplome = useParcoursSelector((state) => state.parcours.formation);

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Informations</h2>
      <div className="flex flex-col gap-y-2">
        <span className="flex gap-x-5">
          <p className="font-bold">Diplôme</p>
          <p>{diplome?.title ?? ""}</p>
        </span>
        <span className="flex gap-x-5">
          <p className="font-bold">Date de début de parcours</p>
          <p className="whitespace-nowrap">
            {new Date(infos.startDate).toLocaleDateString()}
          </p>
        </span>
        <span className="flex gap-x-5">
          <p className="font-bold">Date de fin de parcours</p>
          <p className="whitespace-nowrap">
            {new Date(infos.endDate).toLocaleDateString()}
          </p>
        </span>
      </div>
    </Wrapper>
  );
};

export default Informations;
