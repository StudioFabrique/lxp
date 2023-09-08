import React, { FC } from "react";
import { Draggable } from "react-beautiful-dnd";
import Module from "../../../utils/interfaces/module";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import EditIcon from "../../UI/svg/edit-icon";
import EyeIcon from "../../UI/svg/eye-icon";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentModule } from "../../../store/redux-toolkit/parcours/parcours-modules";
import { defaultModuleThumb } from "../../../lib/defautltModuleThumb";

interface LessonItemProps {
  lesson: Module;
  isDisabled: boolean;
  index?: number;
}

const LessonItem: FC<LessonItemProps> = ({ lesson, isDisabled, index }) => {
  const dispatch = useDispatch();

  const classImage: React.CSSProperties = {
    backgroundImage: `url('${
      lesson.thumb ? lesson.thumb : defaultModuleThumb
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
    dispatch(setCurrentModule(module));
  };

  return (
    <Draggable draggableId={lesson.id!.toString()} index={index!}>
      {(provided) => (
        <div
          className="w-full flex flex-col items-center"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="w-[90%] h-full">
            <div className="w-full flex gap-x-2">
              <div className="w-full flex-1 gap-y-4 rounded-lg">
                <SubWrapper>
                  <span className="w-full h-full flex gap-x-2 items-center">
                    <div style={classImage} />
                    <p className="text-sm font-bold tracking-tight text-info">
                      {lesson.title}
                    </p>
                    {isDisabled ? (
                      <p className="text-sm text-primary"> - copie(1)</p>
                    ) : null}
                  </span>
                </SubWrapper>
              </div>
              {isDisabled ? (
                <span className="h-parent flex flex-col justify-between py-1">
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
                    onClick={() => setModuleToEdit(lesson)}
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

export default LessonItem;
