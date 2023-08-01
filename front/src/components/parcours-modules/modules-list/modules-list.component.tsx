import { FC } from "react";
import Module from "../../../utils/interfaces/module";
import ModulesItem from "./modules-item.component";

const ModulesList: FC<{
  modules: Module[];
  onDelete: (_id: string) => void;
}> = ({ modules, onDelete }) => {
  return (
    <div className="flex flex-col gap-y-10 p-5 bg-primary col-span-2 rounded-lg overflow-y-auto">
      {modules.map((module) => (
        <ModulesItem key={module._id} module={module} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ModulesList;
