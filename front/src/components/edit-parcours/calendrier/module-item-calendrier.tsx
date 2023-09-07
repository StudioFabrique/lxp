import { FC, useEffect, useState } from "react";
import Module from "../../../utils/interfaces/module";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";
import { useSelector } from "react-redux";

const ModuleItemCalendrier: FC<{ module: Module }> = ({ module }) => {
  const currentModule: Module | null = useSelector(
    (state: any) => state.parcoursModules.currentModule
  );

  const dispatch = useDispatch();

  const image = URL.createObjectURL(
    new Blob([new Uint8Array(module.image.data)], {
      type: "application/octet-stream",
    })
  );

  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    dispatch(
      parcoursModulesSliceActions.updateCurrentParcoursModule(module.id)
    );
  };

  useEffect(() => {
    if (currentModule?.id === module.id) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [currentModule?.id, module.id]);

  return (
    <div
      onClick={handleClick}
      className={`${
        isSelected ? "bg-secondary-focus" : "bg-secondary"
      } flex items-center gap-x-4 text-black p-3 rounded-lg hover:bg-primary hover:cursor-pointer`}
    >
      <span className="w-[20%]">
        <img
          className="object-fill  rounded-md"
          src={image}
          alt="module preview"
        />
      </span>
      <p>{module.title}</p>
    </div>
  );
};

export default ModuleItemCalendrier;
