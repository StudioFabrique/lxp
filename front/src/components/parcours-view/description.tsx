/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";

const Description = () => {
  const infos = useSelector((state: any) => state.parcoursInformations.infos);

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Description</h2>
      <p className="first-letter:uppercase">{infos.description ?? ""}</p>
    </Wrapper>
  );
};

export default Description;
