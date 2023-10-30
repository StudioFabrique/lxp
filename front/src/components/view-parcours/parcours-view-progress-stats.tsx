import { useNavigate } from "react-router-dom";
import Wrapper from "../UI/wrapper/wrapper.component";
import RightArrowIcon from "../UI/svg/right-arrow-icon";
import { useSelector } from "react-redux";
import Module from "../../utils/interfaces/module";
import { CSSProperties } from "react";

const ParcoursViewProgressStats = () => {
  const navigate = useNavigate();

  const modules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];

  const radialStyle = {
    "--value": 70,
  } as CSSProperties;

  return (
    <Wrapper>
      <div className="flex flex-col justify-between">
        <div className="flex gap-10 items-center">
          <h2 className="text-2xl w-44 font-bold text-primary">
            Votre avancement dans le parcours
          </h2>
          <div className="flex gap-10">
            {modules
              ?.filter((x, i) => i < 4)
              .map((module, i) => (
                <div className="flex flex-col justify-center gap-1 items-center bg-secondary-focus text-primary-focus font-bold w-[8em] h-[8em] rounded-xl">
                  <p className="radial-progress" style={radialStyle}>
                    70 %
                  </p>
                  <p>{`Module ${i}`}</p>
                </div>
              ))}
            {/* modules with progress */}
          </div>
        </div>
        <div
          onClick={() => navigate("statistiques")}
          className="self-end w-10 stroke-primary"
        >
          <RightArrowIcon />
        </div>
      </div>
    </Wrapper>
  );
};

export default ParcoursViewProgressStats;
