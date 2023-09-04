import { FC, useEffect, useState } from "react";
import Module from "../../../utils/interfaces/module";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceAction } from "../../../store/redux-toolkit/parcours/parcours-modules";
import { useSelector } from "react-redux";

const ModuleCalendrier: FC<{ module: Module }> = ({ module }) => {
  const currentModule: Module | null = useSelector(
    (state: any) => state.parcoursModules.currentModule
  );
  const dispatch = useDispatch();

  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    dispatch(parcoursModulesSliceAction.updateCurrentParcoursModule(module.id));
  };

  useEffect(() => {
    if (currentModule?.id === module.id) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [currentModule?.id]);

  return (
    <div
      onClick={handleClick}
      className={`${
        isSelected ? "bg-secondary-focus" : "bg-secondary"
      } text-black p-5 rounded-lg hover:bg-primary hover:cursor-pointer`}
    >
      <p>{module.title}</p>
    </div>
  );
};

export default ModuleCalendrier;
