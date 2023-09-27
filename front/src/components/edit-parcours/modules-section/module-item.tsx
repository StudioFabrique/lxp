import React, { FC } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import Wrapper from "../../UI/wrapper/wrapper.component";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import Module from "../../../utils/interfaces/module";
import EditIcon from "../../UI/svg/edit-icon";
import { defaultModuleThumb } from "../../../lib/defautltModuleThumb";
interface ModuleItemProps {
  module: Module;
  index?: number;
  isSource: boolean;
  onDeleteModule: (id: string) => void;
}

const ModuleItem: FC<ModuleItemProps> = ({
  module,
  isSource,
  index,
  onDeleteModule,
}) => {
  const dispatch = useDispatch();
  const editionMode = useSelector(
    (state: any) => state.parcoursModules.editionMode
  );
  const newModule = useSelector(
    (state: any) => state.parcoursModules.newModule
  );

  const parcoursTitle = useSelector(
    (state: any) => state.parcoursInformations.infos.title
  );

  const classImage: React.CSSProperties = {
    backgroundImage: `url('${
      module.thumb ? module.thumb : defaultModuleThumb
    }')`,
    width: "50px",
    height: "50px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "5px",
    marginRight: "10px",
  };

  const setModuleToEdit = (module: Module) => {
    dispatch(parcoursModulesSliceActions.toggleEditionMode(true));
    dispatch(parcoursModulesSliceActions.setCurrentModule(module));
  };

  return (
    <Draggable
      isDragDisabled={editionMode || newModule}
      draggableId={module.id!.toString()}
      index={index!}
    >
      {(provided) => (
        <div
          className="w-full flex flex-col items-center"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="w-[99%] h-full">
            <div className="w-full flex gap-x-2">
              <div className="w-full flex-1 gap-y-4 rounded-lg">
                <Wrapper>
                  <span className="w-full h-full flex gap-x-2 items-center">
                    <div style={classImage} />
                    <p className="w-[80%] text-sm font-bold tracking-tight text-info">
                      {isSource
                        ? module.title
                        : `${module.title} - ${parcoursTitle}`}
                    </p>
                  </span>
                </Wrapper>
              </div>
              {!isSource ? (
                <span className="h-parent flex flex-col justify-between py-1">
                  {/* TODO : implémenter le lien vers la vue édition du module */}
                  <button
                    className="btn btn-primary btn-circle rounded-md btn-sm"
                    aria-label="voir le module"
                    onClick={() => onDeleteModule(module.id!.toString())}
                  >
                    <div className="w-6 h-6">
                      <DeleteIcon />
                    </div>
                  </button>
                  <button
                    className="btn btn-primary btn-circle rounded-md btn-sm"
                    onClick={() => setModuleToEdit(module)}
                    disabled={newModule}
                    aria-label="modifier le module"
                  >
                    <div className="w-6 h-6">
                      <EditIcon />
                    </div>
                  </button>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default ModuleItem;
