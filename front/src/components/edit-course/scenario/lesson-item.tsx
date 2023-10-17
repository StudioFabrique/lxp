import Lesson from "../../../utils/interfaces/lesson";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import DocumentIcon from "../../UI/svg/document-icon";
import EditIcon from "../../UI/svg/edit-icon";

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
          className="btn btn-primary btn-sm btn-circle rounded-lg"
          onClick={() => props.onEdit(props.lesson)}
        >
          <EditIcon />
        </button>
        <button
          className="btn btn-primary btn-sm btn-circle rounded-lg"
          onClick={() => props.onDelete(props.lesson)}
        >
          <DeleteIcon />
        </button>
      </span>
    </main>
  );
};

export default LessonItem;
