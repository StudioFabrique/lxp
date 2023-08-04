import { FC } from "react";
import ModulesItem from "./modules-item/modules-item.component";
import { useSelector } from "react-redux";
import Module from "../../../utils/interfaces/module";

const ModulesList: FC<{}> = ({}) => {
  const modules: Module[] = useSelector(
    (state: any) => state.parcoursModule.modules
  );

  return (
    <div className="flex flex-col gap-y-10 p-10 bg-secondary rounded-lg overflow-y-auto">
      <p className="font-bold text-2xl">Liste des modules</p>
      {modules.length > 0 ? (
        modules.map((module) => (
          <ModulesItem key={module._id} module={module} />
        ))
      ) : (
        <p>Aucun modules créés</p>
      )}
    </div>
  );
};

export default ModulesList;
