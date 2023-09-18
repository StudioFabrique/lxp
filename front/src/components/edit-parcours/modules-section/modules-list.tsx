import Module from "../../../utils/interfaces/module";
import { ReactNode } from "react";
import ModuleItem from "./module-item";

interface ModulesListProps {
  modules: Module[];
}

const ModulesList = (props: ModulesListProps) => {
  let content: ReactNode;

  if (props.modules.length > 0) {
    content = (
      <ul className="w-full flex flex-col gap-y-4">
        {props.modules.map((module) => (
          <li className="w-full" key={module.id}>
            <ModuleItem module={module} />
          </li>
        ))}
      </ul>
    );
  }

  return <>{content}</>;
};
export default ModulesList;
