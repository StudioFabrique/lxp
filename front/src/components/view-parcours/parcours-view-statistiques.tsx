import { useNavigate } from "react-router-dom";
import Wrapper from "../UI/wrapper/wrapper.component";
import RightArrowIcon from "../UI/svg/right-arrow-icon";

const ParcoursViewStatistiques = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <div className="h-40 flex flex-col justify-between">
        <h2 className="text-2xl w-44 font-bold text-secondary">
          Statistiques du parcours
        </h2>
        <div className="flex justify-between">
          <span />
          <span
            onClick={() => navigate("statistiques")}
            className="self-end w-10 stroke-secondary"
          >
            <RightArrowIcon />
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

export default ParcoursViewStatistiques;
