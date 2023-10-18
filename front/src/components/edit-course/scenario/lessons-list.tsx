import Lesson from "../../../utils/interfaces/lesson";
import { sortArray } from "../../../utils/sortArray";
import Wrapper from "../../UI/wrapper/wrapper.component";
import LessonItem from "./lesson-item";

interface LessonsListProps {
  lessonsList: Lesson[];
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}

const LessonsList = (props: LessonsListProps) => {
  return (
    <Wrapper>
      <main className="max-h-[35rem] w-full pr-4 overflow-y-scroll scrollbar scrollbar-track-primary scrollbar-thumb-secondary">
        <section>
          <h2 className="font-bold text-xl mb-8">
            Liste des Leçons{" "}
            {props.lessonsList && props.lessonsList.length > 0 ? (
              <p className="text-sm font-normal">{` (${props.lessonsList.length} leçons)`}</p>
            ) : (
              " (aucune leçon)"
            )}
          </h2>
        </section>
        <section>
          <ul className="flex flex-col gap-y-4">
            {sortArray(props.lessonsList, "id").map((lesson: Lesson) => (
              <li key={lesson.id}>
                <LessonItem
                  lesson={lesson}
                  onEdit={props.onEdit}
                  onDelete={props.onDelete}
                />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </Wrapper>
  );
};

export default LessonsList;
