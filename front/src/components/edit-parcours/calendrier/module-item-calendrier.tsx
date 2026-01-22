/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from "react";
import Module from "../../../utils/interfaces/module";
import { useDispatch, useSelector } from "react-redux";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";
import ToolTipWarning from "../../UI/tooltip-warning/tooltip-warning";
import { notValidModuleTooltip } from "../../../lib/not-valid-module";
import defaultModuleThumb from "../../../assets/images/module-default-thumb.png";

const ModuleItemCalendrier: FC<{ module: Module }> = ({ module }) => {
  const currentModule: Module | null = useSelector(
    (state: any) => state.parcoursModules.currentModule,
  );
  const dispatch = useDispatch();
  const [isSelected, setIsSelected] = useState(false);

  // Check if module is valid
  let notValid = true;
  if (module.contacts !== undefined && module.bonusSkills !== undefined) {
    notValid = module.contacts.length === 0 || module.bonusSkills.length === 0;
  }

  const handleClick = () => {
    dispatch(
      parcoursModulesSliceActions.updateCurrentParcoursModule(module.id),
    );
  };

  useEffect(() => {
    setIsSelected(currentModule?.id === module.id);
  }, [currentModule?.id, module.id]);

  return (
    <>
      {currentModule && (
        <div
          onClick={handleClick}
          onKeyDown={handleClick}
          className={`${
            isSelected ? "bg-primary" : "bg-secondary/80"
          } flex items-center gap-x-3 w-max text-base-100 p-3 rounded-lg hover:bg-primary-focus hover:cursor-pointer relative`}
        >
          {notValid && (
            <ToolTipWarning absolutePos message={notValidModuleTooltip} />
          )}
          <span className="w-8 h-8">
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
          <div className="flex flex-col w-full gap-2">
            <h3 className="font-medium max-w-54 text-sm">{module.title}</h3>
            <div className="space-y-1">
              <p className="text-xs opacity-80 flex items-center gap-1">
                <span className="font-medium">Du </span>
                {module.minDate ? (
                  new Date(module.minDate).toLocaleDateString("fr-FR")
                ) : (
                  <span className="italic">Non définie</span>
                )}
              </p>
              <div className="text-xs opacity-80 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="font-medium">jusqu'au</span>
                  {module.maxDate ? (
                    new Date(module.maxDate).toLocaleDateString("fr-FR")
                  ) : (
                    <span className="italic">Non définie</span>
                  )}
                </div>
                <p className="whitespace-nowrap badge badge-neutral badge-sm">
                  {module.duration} H
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModuleItemCalendrier;
