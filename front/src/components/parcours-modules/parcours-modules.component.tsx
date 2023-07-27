import { FC, useState } from "react";
import ModulesForm from "./modules-form/modules-form";
import Module from "../../utils/interfaces/module";
import Wrapper from "../UI/wrapper/wrapper.component";

interface IParcoursModules {}

const ParcoursModules: FC<IParcoursModules> = (props) => {
  const [modules, setModules] = useState<Module[]>([]);

  const handleAddModule = (module: Module) => {};

  return (
    <div className="p-5 grid grid-cols-3">
      <Wrapper>
        <ModulesForm onSubmit={handleAddModule} />
      </Wrapper>
    </div>
  );
};

export default ParcoursModules;
