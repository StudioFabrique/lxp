import Lesson from "../../../utils/interfaces/lesson";
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
      <main className="h-full w-full">
        <section>
          <h2 className="font-bold text-xl mb-8">Liste des Leçons</h2>
        </section>
        <section>
          <ul className="flex flex-col gap-y-4">
            {props.lessonsList.map((lesson: Lesson) => (
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
