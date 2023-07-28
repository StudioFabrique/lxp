import { FC } from "react";
import Module from "../../../utils/interfaces/module";
import ModulesItem from "./modules-item.component";

const ModulesList: FC<{ modules: Module[] }> = ({ modules }) => {
  return (
    <div className="flex flex-col gap-y-10 p-5 bg-primary col-span-2 rounded-lg">
      {modules.map((module) => (
        <ModulesItem module={module} />
      ))}
    </div>
  );
};

export default ModulesList;
