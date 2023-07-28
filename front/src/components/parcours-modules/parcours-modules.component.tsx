import { Dispatch, FC, SetStateAction, useState } from "react";
import ModulesForm from "./modules-form/modules-form";
import Module from "../../utils/interfaces/module";
import Wrapper from "../UI/wrapper/wrapper.component";
import ModulesList from "./modules-list/modules-list.component";

interface IParcoursModules {
  modules: Module[];
  setModules: Dispatch<SetStateAction<Module[]>>;
}

const ParcoursModules: FC<IParcoursModules> = (props) => {
  const handleAddModule = (module: Module) => {
    props.setModules((currentModules) => [...currentModules, module]);
  };

  return (
    <div className="m-5 ml-32 mr-32">
      <Wrapper>
        <div className="p-5 grid grid-cols-3">
          <ModulesForm onSubmit={handleAddModule} />
          <ModulesList modules={props.modules} />
        </div>
      </Wrapper>
    </div>
  );
};

export default ParcoursModules;
