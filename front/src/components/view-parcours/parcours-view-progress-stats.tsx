import { useNavigate } from "react-router-dom";
import Wrapper from "../UI/wrapper/wrapper.component";
import RightArrowIcon from "../UI/svg/right-arrow-icon";

const ParcoursViewProgressStats = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <div className="h-40 flex flex-col justify-between">
        <h2 className="text-2xl w-44 font-bold text-primary">
          Votre avancement dans le parcours
        </h2>
        <div className="flex justify-between">
          <div>{/* modules with progress */}</div>
          <div
            onClick={() => navigate("statistiques")}
            className="self-end w-10 stroke-primary"
          >
            <RightArrowIcon />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ParcoursViewProgressStats;
