import { FC } from "react";
import Module from "../../../utils/interfaces/module";

const ModulesItem: FC<{ module: Module }> = ({ module }) => {
  return (
    <div className="flex h-20 items-center p-5" key={module._id}>
      <span>
        <img
          className="object-cover h-20 w-20 rounded-lg"
          src={module.imageUrl}
          alt="module preview"
        />
      </span>
      <p className="ml-5">{module.title}</p>
    </div>
  );
};

export default ModulesItem;
