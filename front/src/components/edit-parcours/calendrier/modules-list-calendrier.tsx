import { FC } from "react";
import ModuleCalendrier from "./module-calendrier";
import Module from "../../../utils/interfaces/module";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { useSelector } from "react-redux";

const ModulesListCalendrier = () => {
  const modules: Module[] = useSelector(
    (state: any) => state.parcoursModule.modules
  ) as Module[];

  return (
    <Wrapper>
      <h2 className="text-xl font-bold">Modules</h2>
      <div className="flex flex-col gap-y-2">
        {modules.map((module) => (
          <ModuleCalendrier module={module} key={module.id} />
        ))}
      </div>
    </Wrapper>
  );
};

export default ModulesListCalendrier;
