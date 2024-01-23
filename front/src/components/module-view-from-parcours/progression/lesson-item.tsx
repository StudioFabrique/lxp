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
  return (
    <div
      onClick={() =>
        setSelectedLesson(
          selectedLesson && selectedLesson.id === lesson.id ? undefined : lesson
        )
      }
      className={`flex items-center justify-between rounded-xl p-2 w-full cursor-pointer ${
        selectedLesson?.id === lesson.id
          ? "bg-primary text-white"
          : "bg-primary/50"
      }`}
    >
      <p className="max-h-14 overflow-clip">{lesson.title}</p>
      {lesson.readBy && lesson.readBy?.length > 0 ? (
        <CheckCircle2 />
      ) : (
        <ArrowRight />
      )}
    </div>
  );
};

export default LessonItem;
