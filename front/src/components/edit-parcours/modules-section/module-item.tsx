/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from "react";
import { useSelector } from "react-redux";

import Wrapper from "../../UI/wrapper/wrapper.component";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import Module from "../../../utils/interfaces/module";
import EditIcon from "../../UI/svg/edit-icon";
import { defaultModuleThumb } from "../../../lib/defautltModuleThumb";
import DuplicateIcon from "../../UI/svg/duplicate-icon";
import ToolTipWarning from "../../UI/tooltip-warning/tooltip-warning";
import { notValidModuleTooltip } from "../../../lib/not-valid-module";
interface ModuleItemProps {
  module: Module;
  fromSource: boolean;
  onEdit: (id: number) => void;
  onSelect: (id: number) => void;
  onDeleteModule: (id: number) => void;
}

const ModuleItem: FC<ModuleItemProps> = ({
  module,
  fromSource,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onEdit = (_id: number) => {},
  onSelect,
  onDeleteModule,
}) => {
  const parcoursTitle = useSelector(
    (state: any) => state.parcoursInformations.infos.title
  );
  const isFormOpen = useSelector(
    (state: any) => state.parcoursModules.isFormOpen
  ) as boolean;

  console.log("module", module);

  const classImage: React.CSSProperties = {
    backgroundImage: `url('${
      module.thumb
        ? `data:image/jpeg;base64,${module.thumb}`
        : defaultModuleThumb
    }')`,
    width: "50px",
    height: "50px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "5px",
    marginRight: "10px",
  };

  // un module item de la iste des modules du parcours n'est pas valide par défaut
  let notValid = !fromSource;

  // teste si un module du parcours est valide
  if (module.contacts !== undefined && module.bonusSkills !== undefined) {
    notValid =
      !fromSource &&
      (module.contacts.length === 0 || module.bonusSkills.length === 0);
  }

  // définit le style d'un module du parcours
  const style = notValid
    ? "w-full flex-1 gap-y-4 rounded-lg relative border border-error"
    : "w-full flex-1 gap-y-4 rounded-lg relative";

  // définit le style de l'icone dupliquer en fonction de l'était du formulaire (affiché ou non)
  const selectBaseStyle =
    "tooltip tooltip-bottom cursor-pointer w-4 h-4 absolute top-4 right-4 ";
  const selectStyle = isFormOpen
    ? selectBaseStyle + "text-primary/30"
    : selectBaseStyle + "text-primary";

  return (
    <div className="w-[99%] h-full">
      <div className="w-full flex gap-x-2">
        <div className={style}>
          <Wrapper>
            <span className="w-full h-full flex gap-x-2 items-center">
              <div style={classImage} />
              <p className="w-[80%] text-sm font-bold tracking-tight text-info">
                {fromSource
                  ? module.title
                  : `${module.title} - ${parcoursTitle}`}
              </p>
            </span>
            {fromSource ? (
              <div
                className={selectStyle}
                data-tip="Cliquez pour dupliquer"
                onClick={() => onSelect(module.id!)}
              >
                <DuplicateIcon />
              </div>
            ) : null}
            {notValid ? (
              <ToolTipWarning message={notValidModuleTooltip} />
            ) : null}
          </Wrapper>
        </div>
        {!fromSource ? (
          <span className="h-parent flex flex-col justify-between py-1">
            {/* TODO : implémenter le lien vers la vue édition du module */}{" "}
            <button
              className="btn btn-primary btn-circle rounded-md btn-sm"
              onClick={() => onEdit(module.id!)}
              aria-label="modifier le module"
              disabled={isFormOpen}
            >
              <div className="w-6 h-6">
                <EditIcon />
              </div>
            </button>
            <button
              className="btn btn-primary btn-circle rounded-md btn-sm"
              aria-label="voir le module"
              onClick={() => onDeleteModule(module.id!)}
              disabled={isFormOpen}
            >
              <div className="w-6 h-6">
                <DeleteIcon />
              </div>
            </button>
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ModuleItem;
