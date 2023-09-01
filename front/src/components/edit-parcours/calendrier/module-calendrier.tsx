import { FC } from "react";
import Module from "../../../utils/interfaces/module";

const ModuleCalendrier: FC<{ module: Module }> = ({ module }) => {
  return (
    <span>
      <p>{module.description}</p>
    </span>
  );
};

export default ModuleCalendrier;
