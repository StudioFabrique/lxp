import Lesson from "../../../utils/interfaces/lesson";
import { sortArray } from "../../../utils/sortArray";
import Loader from "../../UI/loader";
import Wrapper from "../../UI/wrapper/wrapper.component";
import LessonItem from "./lesson-item";

interface LessonsListProps {
  lessonsList: Lesson[];
  loading: boolean;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}

const LessonsList = (props: LessonsListProps) => {
  return (
    <Wrapper>
      <main className="max-h-[35rem] w-full pr-4 overflow-auto">
        <section className="flex items-center gap-x-2">
          <h2 className="font-bold text-xl mb-8">
            Liste des Leçons
            {props.lessonsList && props.lessonsList.length > 0 ? (
              <p className="text-sm font-normal">{` ${props.lessonsList.length} leçon(s)`}</p>
            ) : (
              <p className="text-sm font-normal">aucune leçon</p>
            )}
          </h2>
          {props.loading ? <Loader /> : null}
        </section>
        <section>
          {props.lessonsList && LessonsList.length > 0 ? (
            <ul className="flex flex-col gap-y-4">
              {sortArray(props.lessonsList, "createdAt").map(
                (lesson: Lesson) => (
                  <li key={lesson.id}>
                    <LessonItem
                      lesson={lesson}
                      onEdit={props.onEdit}
                      onDelete={props.onDelete}
                    />
                  </li>
                )
              )}
            </ul>
          ) : null}
        </section>
      </main>
    </Wrapper>
  );
};

export default LessonsList;
