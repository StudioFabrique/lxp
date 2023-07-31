import { FC, useState } from "react";
import ModulesForm from "./modules-form/modules-form";
import Module from "../../utils/interfaces/module";
import Wrapper from "../UI/wrapper/wrapper.component";
import ModulesList from "./modules-list/modules-list.component";

/* interface IParcoursModules {
  modules: Module[];
  setModules: Dispatch<SetStateAction<Module[]>>;
} */

const ParcoursModules: FC</* IParcoursModules */ {}> = (props) => {
  const [modules, setModules] = useState<Module[]>([]);

  const handleAddModule = (module: Module) => {
    module._id = (modules.length + 1).toString();
    console.log(module);
    setModules((currentModules) => [...currentModules, module]);
  };

  const handleDeleteModule = (_id: string) => {
    setModules((currentModules) =>
      currentModules.filter((module) => module._id !== _id)
    );
  };

  return (
    <div className="p-5 ml-32 mr-32 h-full">
      <Wrapper>
        <div className=" grid grid-cols-3 h-full">
          <ModulesForm onSubmit={handleAddModule} />
          <ModulesList modules={modules} onDelete={handleDeleteModule} />
        </div>
      </Wrapper>
    </div>
  );
};

export default ParcoursModules;
