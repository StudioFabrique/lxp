import { ArrowRight, CheckCircle2 } from "lucide-react";
import Lesson from "../../../utils/interfaces/lesson";
import { Dispatch, SetStateAction } from "react";
import useHttp from "../../../hooks/use-http";
import Loader from "../../UI/loader";

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
  const { sendRequest, isLoading } = useHttp();
  const isLessonSelected = selectedLesson?.id === lesson.id;

  const handleBeginReadLesson = () => {
    const applyData = () => {
      setSelectedLesson(
        selectedLesson && isLessonSelected ? undefined : lesson
      );
    };

    sendRequest(
      { path: `/lesson/read/${lesson.id}`, method: "post" },
      applyData
    );
  };

  return (
    <div
      onClick={handleBeginReadLesson}
      className={`flex items-center justify-between rounded-xl p-2 w-full cursor-pointer ${
        isLessonSelected
          ? "bg-primary text-primary-content"
          : "bg-primary/60 text-primary-content"
      }`}
    >
      <p className="max-h-14 overflow-clip">{lesson.title}</p>
      <div>
        {isLoading ? (
          <Loader />
        ) : lesson.lessonsRead && lesson.lessonsRead?.length > 0 ? (
          <CheckCircle2
            className={`w-5 h-5 stroke-green-400
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
