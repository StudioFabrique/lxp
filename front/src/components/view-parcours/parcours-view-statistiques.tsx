import { useNavigate } from "react-router-dom";
import RightArrowIcon from "../UI/svg/right-arrow-icon";
import Wrapper from "../UI/wrapper/wrapper.component";

const ParcoursViewStatistiques = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <div className="h-40 flex flex-col justify-between">
        <h2 className="text-2xl w-44 font-bold text-primary">
          Statistiques du parcours
        </h2>
        <div className="flex justify-between">
          <span />
          <span onClick={() => navigate("statistiques")} className="self-end">
            <RightArrowIcon />
          </span>
        </div>
      </div>
    </Wrapper>
  );
};

export default ParcoursViewStatistiques;
