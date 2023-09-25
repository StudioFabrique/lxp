import { useSelector } from "react-redux";

import Wrapper from "../../UI/wrapper/wrapper.component";
import Module from "../../../utils/interfaces/module";
import PreviewModuleItem from "./preview-module-item";

const ParcoursPreviewModules = () => {
  const modules = useSelector(
    (state: any) => state.parcoursModules.modules
  ) as Module[];

  return (
    <Wrapper>
      <h2 className="text-xl font-bold">Liste des modules</h2>
      <ul className="w-full flex gap-4 overflow-auto">
        {modules.map((module) => (
          <li className="w-[300px]" key={module.id}>
            <PreviewModuleItem module={module} />
          </li>
        ))}
      </ul>
    </Wrapper>
  );
};

export default ParcoursPreviewModules;
