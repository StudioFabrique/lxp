import { useSelector } from "react-redux";
import Wrapper from "../../UI/wrapper/wrapper.component";
import ParcoursContenuItem from "./parcours-contenu-item";
import Module from "../../../utils/interfaces/module";

const ParcoursContenu = () => {
  const modules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];

  return (
    <Wrapper>
      <h2>Contenu du parcours</h2>
      <div className="grid grid-cols-2 gap-x-10">
        <div className="flex flex-col gap-y-5">
          {modules.map((module, i) => (
            <ParcoursContenuItem
              key={module.id}
              module={module}
              iterationCount={i + 1}
            />
          ))}
        </div>
        <div className="">
          <p>test</p>
        </div>
      </div>
    </Wrapper>
  );
};

export default ParcoursContenu;
