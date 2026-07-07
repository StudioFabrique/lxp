/* eslint-disable @typescript-eslint/no-explicit-any */
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useCourseDispatch } from "../../../store/CourseContext";

import Lesson from "../../../../../../src.legacy/utils/interfaces/lesson";
import Wrapper from "../../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import LessonItem from "./lesson-item";
import { CheckCircle, Loader2 } from "lucide-react";

interface LessonsListProps {
  lessonsList: Lesson[];
  loading: boolean;
  success: boolean;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}

const LessonsList = (props: LessonsListProps) => {
  const dispatch = useCourseDispatch();

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(props.lessonsList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    dispatch({ type: "REORDER_LESSONS", payload: items });
  };

  return (
    <Wrapper>
      <main className="max-h-[35rem] w-full pr-4 overflow-auto">
        <section className="flex items-center gap-x-2">
          <h2 className="font-bold text-xl mb-8">
            <span className="flex items-center gap-x-2">
              <p>Contenu de cours</p>
              {props.loading ? (
                <Loader2 className="w-4 h-4 text-primary animate animate-spin" />
              ) : null}
              {props.success ? (
                <CheckCircle className="w-4 h-4 text-success" />
              ) : null}
            </span>
            {props.lessonsList && props.lessonsList.length > 0 ? (
              <p className="text-sm font-normal">{` ${props.lessonsList.length} leçon(s)`}</p>
            ) : (
              <p className="text-sm font-normal">Aucun contenu</p>
            )}
          </h2>
        </section>
        <section>
          {props.lessonsList && props.lessonsList.length > 0 ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="lessons">
                {(provided: any) => (
                  <ul
                    className="flex flex-col gap-y-4"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {props.lessonsList.map((lesson: Lesson, index: number) => (
                      <Draggable
                        key={lesson.id}
                        draggableId={lesson.id!.toString()}
                        index={index}
                      >
                        {(provided: any) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <LessonItem
                              lesson={lesson}
                              onEdit={props.onEdit}
                              onDelete={props.onDelete}
                            />
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          ) : null}
        </section>
      </main>
    </Wrapper>
  );
};

export default LessonsList;
