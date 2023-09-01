import { FC } from "react";
import ModulesForm from "./modules-form";
import Wrapper from "../../UI/wrapper/wrapper.component";
import ModulesList from "./modules-list/modules-list.component";

const ParcoursModules: FC<{}> = () => {
  return (
    <div className="w-full max-lg:mx-0">
      <Wrapper>
        <div className="w-full grid grid-cols-2 max-lg:grid-cols-1 max-lg:grid-rows-2 ">
          <ModulesForm />
          <ModulesList />
        </div>
      </Wrapper>
    </div>
  );
};

export default ParcoursModules;
