import { ArrowRight } from "lucide-react";
import Lesson from "../../../utils/interfaces/lesson";

type LessonItemProps = {
  lesson: Lesson;
};

const LessonItem = ({ lesson }: LessonItemProps) => {
  return (
    <div className="flex justify-between bg-primary/50 rounded-xl p-2 w-full">
      <p className="max-h-14 overflow-clip">{lesson.title}</p>
      <ArrowRight />
    </div>
  );
};

export default LessonItem;
