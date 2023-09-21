import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";

const ParcoursViewDescription = () => {
  const infos = useSelector((state: any) => state.parcoursInformations.infos);

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">description</h2>
      <p>{infos.description ?? ""}</p>
    </Wrapper>
  );
};

export default ParcoursViewDescription;
