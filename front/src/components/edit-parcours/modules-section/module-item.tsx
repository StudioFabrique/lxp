import React, { FC } from "react";
import { useSelector } from "react-redux";

import Wrapper from "../../UI/wrapper/wrapper.component";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import Module from "../../../utils/interfaces/module";
import EditIcon from "../../UI/svg/edit-icon";
import { defaultModuleThumb } from "../../../lib/defautltModuleThumb";
interface ModuleItemProps {
  module: Module;
  fromSource: boolean;
  onEdit: (id: number) => void;
  onDeleteModule: (id: number) => void;
}

const ModuleItem: FC<ModuleItemProps> = ({
  module,
  fromSource,
  onEdit = (id: number) => {},
  onDeleteModule,
}) => {
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

  const setModuleToEdit = (id: number) => {
    onEdit(id);
  };

  return (
    <div className="w-[99%] h-full">
      <div className="w-full flex gap-x-2">
        <div className="w-full flex-1 gap-y-4 rounded-lg">
          <Wrapper>
            <span className="w-full h-full flex gap-x-2 items-center">
              <div style={classImage} />
              <p className="w-[80%] text-sm font-bold tracking-tight text-info">
                {fromSource
                  ? module.title
                  : `${module.title} - ${parcoursTitle}`}
              </p>
            </span>
          </Wrapper>
        </div>
        {!fromSource ? (
          <span className="h-parent flex flex-col justify-between py-1">
            {/* TODO : implémenter le lien vers la vue édition du module */}
            <button
              className="btn btn-primary btn-circle rounded-md btn-sm"
              aria-label="voir le module"
              onClick={() => onDeleteModule(module.id!)}
            >
              <div className="w-6 h-6">
                <DeleteIcon />
              </div>
            </button>
            <button
              className="btn btn-primary btn-circle rounded-md btn-sm"
              onClick={() => setModuleToEdit(module.id!)}
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
  );
};

export default ModuleItem;
