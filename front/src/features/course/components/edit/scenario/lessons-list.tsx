import { useCourseDispatch } from "../../../store/CourseContext";

import Lesson from "../../../../../../src/utils/interfaces/lesson";
import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import LessonItem from "./lesson-item";
import { CheckCircle, Loader2 } from "lucide-react";
import { DndWrapper } from "../../../../../components/UI/DndWrapper";

interface LessonsListProps {
  lessonsList: Lesson[];
  loading: boolean;
  success: boolean;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}

const LessonsList = (props: LessonsListProps) => {
  const dispatch = useCourseDispatch();

  const onDragEnd = (sourceIndex: number, destinationIndex: number) => {
    const items = Array.from(props.lessonsList);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);
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
            <DndWrapper
              droppableId="lessons"
              items={props.lessonsList}
              isLoading={props.loading}
              onDragEnd={onDragEnd}
              getItemId={(lesson) => lesson.id!}
              renderItem={(lesson) => (
                <LessonItem
                  lesson={lesson}
                  onEdit={props.onEdit}
                  onDelete={props.onDelete}
                />
              )}
            />
          ) : null}
        </section>
      </main>
    </Wrapper>
  );
};

export default LessonsList;
