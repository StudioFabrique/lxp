import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { localeDate } from "../../../../../src/utils/helpers/locale-date";
import { useParams } from "react-router";
import { useParcoursQuery } from "../../hooks/useParcoursQuery";

const Informations = () => {
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(Number(id));

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Informations</h2>
      <div className="flex flex-col gap-y-2">
        <span className="flex gap-x-5">
          <p className="font-bold">Diplôme</p>
          <p>{parcours?.formation.title ?? ""}</p>
        </span>
        <span className="flex gap-x-5">
          <p className="font-bold">Date de début de parcours</p>
          <p className="whitespace-nowrap">
            {localeDate(parcours?.startDate ?? "")}
          </p>
        </span>
        <span className="flex gap-x-5">
          <p className="font-bold">Date de fin de parcours</p>
          <p className="whitespace-nowrap">
            {localeDate(parcours?.endDate ?? "")}
          </p>
        </span>
      </div>
    </Wrapper>
  );
};

export default Informations;
