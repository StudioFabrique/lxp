import { useParcoursSelector } from "../../store/ParcoursContext";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";

const Description = () => {
  const infos = useParcoursSelector((state) => state.parcoursInformations.infos);

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Description</h2>
      <p className="first-letter:uppercase">{infos.description ?? ""}</p>
    </Wrapper>
  );
};

export default Description;
