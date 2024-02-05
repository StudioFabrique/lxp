import { ArrowRight, CheckCircle2 } from "lucide-react";
import Lesson from "../../../utils/interfaces/lesson";
import { Dispatch, SetStateAction } from "react";

type LessonItemProps = {
  lesson: Lesson;
  selectedLesson: Lesson | undefined;
  setSelectedLesson: Dispatch<SetStateAction<Lesson | undefined>>;
};

const LessonItem = ({
  lesson,
  selectedLesson,
  setSelectedLesson,
}: LessonItemProps) => {
  const isLessonSelected = selectedLesson?.id === lesson.id;

  return (
    <div
      onClick={() =>
        setSelectedLesson(
          selectedLesson && isLessonSelected ? undefined : lesson
        )
      }
      className={`flex items-center justify-between rounded-xl p-2 w-full cursor-pointer ${
        isLessonSelected ? "bg-primary text-white" : "bg-primary/50"
      }`}
    >
      <p className="max-h-14 overflow-clip">{lesson.title}</p>
      <div>
        {lesson.readBy && lesson.readBy?.length > 0 ? (
          <CheckCircle2
            className={`w-5 h-5 ${
              isLessonSelected ? "stroke-secondary" : "stroke-primary"
            }`}
          />
        ) : (
          <ArrowRight />
        )}
      </div>
    </div>
  );
};

export default LessonItem;
