import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { defaultModuleThumb } from "../../../lib/defautltModuleThumb";
import Module from "../../../utils/interfaces/module";
import Wrapper from "../../UI/wrapper/wrapper.component";
import EyeIcon from "../../UI/svg/eye-icon";
import {
  addModule,
  removeModule,
  setCurrentModule,
  toggleEditionMode,
} from "../../../store/redux-toolkit/parcours/parcours-modules";
import EditIcon from "../../UI/svg/edit-icon";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import AddIcon from "../../UI/svg/add-icon";

interface ModuleItemProps {
  module: Module;
}

const ModuleItem = (props: ModuleItemProps) => {
  const { module } = props;
  const dispatch = useDispatch();

  const classImage: React.CSSProperties = {
    backgroundImage: `url('${
      props.module.thumb ? props.module.thumb : defaultModuleThumb
    }')`,
    width: "50px",
    height: "50px",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "5px",
    marginRight: "10px",
  };

  const style = `w-full h-full flex gap-x-2 items-center ${
    module.isSelected ? "opacity-20" : ""
  }`;

  const setModuleToEdit = (module: Module) => {
    dispatch(setCurrentModule(module));
    dispatch(toggleEditionMode());
  };

  const handleAddModule = () => {
    dispatch(addModule(module));
  };

  return (
    <Wrapper>
      <div className="w-full flex gap-x-2 items-center">
        <span className={style}>
          <div style={classImage} />
          <p className="text-sm font-bold tracking-tight text-info">
            {module.title}
          </p>
        </span>
        {module.contacts && module.contacts.length > 0 ? (
          <span className="h-parent flex justify-between gap-x-2">
            {/* TODO : implémenter le lien vers la vue édition du module */}
            <Link
              className="btn btn-primary btn-circle rounded-md btn-sm"
              to="#"
            >
              <div className="w-6 h-6">
                <EyeIcon />
              </div>
            </Link>
            <button
              className="btn btn-primary btn-circle rounded-md btn-sm"
              onClick={() => setModuleToEdit(module)}
            >
              <div className="w-6 h-6">
                <EditIcon />
              </div>
            </button>
            <button
              className="btn btn-primary btn-circle rounded-md btn-sm"
              onClick={() => dispatch(removeModule(module.id!))}
            >
              <div className="w-6 h-6">
                <DeleteIcon />
              </div>
            </button>
          </span>
        ) : (
          <button
            className="btn btn-primary btn-circle rounded-md btn-sm"
            onClick={() => handleAddModule()}
          >
            <div className="w-6 h-6">
              <AddIcon />
            </div>
          </button>
        )}
      </div>
    </Wrapper>
  );
};

export default ModuleItem;
