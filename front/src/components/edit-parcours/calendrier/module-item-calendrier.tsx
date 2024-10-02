/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import Module from "../../../utils/interfaces/module";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";
import { useSelector } from "react-redux";
import ToolTipWarning from "../../UI/tooltip-warning/tooltip-warning";
import { notValidModuleTooltip } from "../../../lib/not-valid-module";
import defaultModuleThumb from "../../../assets/images/module-default-thumb.png";

const ModuleItemCalendrier: FC<{ module: Module }> = ({ module }) => {
  const currentModule: Module | null = useSelector(
    (state: any) => state.parcoursModules.currentModule,
  );

  const dispatch = useDispatch();

  const [isSelected, setIsSelected] = useState(false);

  // un module item de la iste des modules du parcours n'est pas valide par défaut
  let notValid = true;

  // teste si un module du parcours est valide
  if (module.contacts !== undefined && module.bonusSkills !== undefined) {
    notValid = module.contacts.length === 0 || module.bonusSkills.length === 0;
  }

  const handleClick = () => {
    dispatch(
      parcoursModulesSliceActions.updateCurrentParcoursModule(module.id),
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
    <>
      {currentModule ? (
        <div
          onClick={handleClick}
          className={`${
            isSelected ? "bg-primary" : "bg-secondary/80"
          } flex items-center gap-x-4 text-base-100 p-4 rounded-lg hover:bg-primary-focus hover:cursor-pointer relative`}
        >
          {notValid ? <ToolTipWarning message={notValidModuleTooltip} /> : null}
          <span className="w-10 h-10">
            <img
              className="h-full object-cover rounded-md"
              src={
                module.thumb
                  ? `data:image/jpeg;base64,${module.thumb}`
                  : defaultModuleThumb
              }
              alt="module preview"
            />
          </span>
          <p>{module.title}</p>
        </div>
      ) : null}
    </>
  );
};

export default ModuleItemCalendrier;
