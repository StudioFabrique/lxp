import { FC } from "react";
import ModuleItemCalendrier from "./module-item-calendrier";
import Module from "../../../utils/interfaces/module";
import Wrapper from "../../UI/wrapper/wrapper.component";

const ModulesListCalendrier: FC<{ modules: Module[] }> = ({ modules }) => {
  return (
    <Wrapper>
      <h2 className="text-xl font-bold">Modules</h2>
      <div className="flex flex-col gap-y-5">
        {modules.map((module) => (
          <ModuleItemCalendrier module={module} key={module.id} />
        ))}
      </div>
    </Wrapper>
  );
};

export default ModulesListCalendrier;
