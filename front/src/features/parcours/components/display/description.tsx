import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { useParams } from "react-router";
import { useParcoursQuery } from "../../hooks/useParcoursQuery";

const Description = () => {
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(Number(id));

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Description</h2>
      <p className="first-letter:uppercase">{parcours?.description ?? ""}</p>
    </Wrapper>
  );
};

export default Description;
