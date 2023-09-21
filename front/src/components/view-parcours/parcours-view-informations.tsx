import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";

const ParcoursViewInformations = () => {
  const infos = useSelector((state: any) => state.parcoursInformations.infos);
  const diplome = useSelector((state: any) => state.parcours.formation);

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Informations</h2>
      <div>
        <span className="flex gap-x-5">
          <p className="font-bold">Diplôme</p>
          <p>{diplome?.title ?? ""}</p>
        </span>
        <span className="flex gap-x-5">
          <p className="font-bold">Date de début de parcours</p>
          <p>{infos.startDate}</p>
        </span>
        <span className="flex gap-x-5">
          <p className="font-bold">Date de fin de parcours</p>
          <p>{infos.endDate}</p>
        </span>
      </div>
    </Wrapper>
  );
};

export default ParcoursViewInformations;
