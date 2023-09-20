import { useNavigate } from "react-router-dom";
import RightArrowIcon from "../UI/svg/right-arrow-icon";
import Wrapper from "../UI/wrapper/wrapper.component";

const ParcoursStatistiques = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <h2>Statistiques du parcours</h2>
      <div className="flex justify-between">
        <span />
        <span onClick={() => navigate("statistiques")} className="self-end">
          <RightArrowIcon />
        </span>
      </div>
    </Wrapper>
  );
};

export default ParcoursStatistiques;
