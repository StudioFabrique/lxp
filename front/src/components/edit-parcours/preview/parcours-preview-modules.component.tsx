import { useSelector } from "react-redux";

import Wrapper from "../../UI/wrapper/wrapper.component";
import Module from "../../../utils/interfaces/module";

const ParcoursPreviewModules = () => {
  const modules = useSelector(
    (state: any) => state.parcoursModule.modules
  ) as Module[];

  const classImage: React.CSSProperties = {
    backgroundImage: `url('${"/images/parcours-default.jpg"}')`,
    width: "100%",
    minHeight: "7rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <Wrapper>
      <h2 className="text-xl font-bold">Liste des modules</h2>
      <ul className="w-full flex gap-4 flex-wrap">
        {modules.map((module) => (
          <li className="w-[15vw]" key={module.id}>
            <div className="grid grid-rows-2 bg-secondary/10 rounded-lg">
              <span style={classImage}></span>
              <span className="w-full h-full px-4 flex justify-center items-center">
                <p>{module.title}</p>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

export default ParcoursPreviewModules;
