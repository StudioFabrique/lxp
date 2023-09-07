import React, { FC } from "react";
import { Draggable } from "react-beautiful-dnd";
import Module from "../../../utils/interfaces/module";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";

interface LessonItemProps {
  lesson: Module;
  isDisabled: boolean;
  onRemoveLesson?: (lessonId: string) => void;
  index?: number;
}

const LessonItem: FC<LessonItemProps> = ({
  lesson,
  isDisabled,
  onRemoveLesson,
  index,
}) => {
  let classImage: React.CSSProperties;
  if (lesson.thumb) {
    classImage = {
      backgroundImage: `url('${lesson.thumb}')`,
      width: "50px",
      height: "50px",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      borderRadius: "5px",
      marginRight: "10px",
    };
  }

  return (
    <Draggable draggableId={lesson.id!.toString()} index={index!}>
      {(provided) => (
        <div
          className="w-full flex flex-col items-center"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className="w-[90%]">
            <SubWrapper>
              <div className="w-full flex flex-col gap-y-4 rounded-lg">
                <span className="flex gap-x-2 items-center">
                  {lesson.thumb ? <div style={classImage}></div> : null}
                  <p className="text-sm font-bold tracking-tight text-info">
                    {lesson.title}
                  </p>
                  {isDisabled ? (
                    <p className="text-sm text-primary"> - copie(1)</p>
                  ) : null}
                </span>
              </div>
            </SubWrapper>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default LessonItem;
