import { FC } from "react";
import Module from "../../../utils/interfaces/module";

const ModulesList: FC<{ modules: Module[] }> = ({ modules }) => {
  return (
    <div>
      {modules.map((module) => (
        <span className="flex" key={module._id}>
          <img src={module.imageUrl} alt="module preview" />
          <p>{module.description}</p>
        </span>
      ))}
    </div>
  );
};

export default ModulesList;
