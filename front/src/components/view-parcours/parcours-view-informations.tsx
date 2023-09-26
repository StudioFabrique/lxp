import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";

const ParcoursViewInformations = () => {
  const infos = useSelector((state: any) => state.parcoursInformations.infos);
  const diplome = useSelector((state: any) => state.parcours.formation);

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-secondary">Informations</h2>
      <div className="flex flex-col gap-y-5">
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

export default ParcoursViewInformations;
