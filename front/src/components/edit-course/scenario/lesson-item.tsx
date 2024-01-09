import { Trash2 } from "lucide-react";
import Lesson from "../../../utils/interfaces/lesson";
import DocumentIcon from "../../UI/svg/document-icon";
import EditIcon from "../../UI/svg/edit-icon";
import Can from "../../UI/can/can.component";

interface LessonItemProps {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}

const LessonItem = (props: LessonItemProps) => {
  return (
    <main className="w-full flex gap-x-2">
      <article className="w-full h-full flex items-center gap-x-4 p-5 rounded-lg bg-secondary/20">
        <div className="w-8 h-8 text-primary">
          <DocumentIcon />
        </div>
        <p className="flex-1">{props.lesson.title}</p>
      </article>
      <span className="flex flex-col justify-between">
        <button
          className="btn btn-primary btn-sm btn-circle rounded-md"
          onClick={() => props.onEdit(props.lesson)}
        >
          <div className="w-5 h-5">
            <EditIcon />
          </div>
        </button>
        <Can action="delete" object="lesson">
          <button
            className="btn btn-primary btn-sm btn-circle rounded-md"
            onClick={() => props.onDelete(props.lesson)}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </Can>
      </span>
    </main>
  );
};

export default LessonItem;
