import { GripVertical, Pen, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Activity from "../../utils/interfaces/activity";
import Can from "../UI/can/can.component";
import BookIcon from "../UI/svg/book-icon";

type Props = {
  activity: Activity;
  index: number;
  onDeleteActivity: (activityId: number) => void;
};

export default function ActivityListItem({
  activity,
  index,
  onDeleteActivity,
}: Props) {
  return (
    <article className="flex justify-between items-center">
      <div className="flex items-center gap-x-4">
        <GripVertical className="w-10 h-10 text-primary/50" />
        <div className="w-10 h-10 text-primary">
          <BookIcon />
        </div>
        <span className="flex flex-col justify-center items-start">
          <p className="text-base-content/50 text-xs">
            Activité n°{index + 1} -{" "}
            {activity.type === "text" ? "blog" : activity.type}
          </p>
          <span className="flex gap-x-2">
            <p className="font-bold">{activity.title}</p>
            <p>-</p>
            <p>{activity.description}</p>
          </span>
        </span>
      </div>
      <span className="flex items-center gap-x-4">
        <Can action="update" object="lesson">
          <Link
            to={`/admin/course/edit/${activity.id}`}
            className="hover:text-primary-focus transition-colors"
          >
            <Pen className="w-4 h-4 text-primary" />
          </Link>
        </Can>
        <Can action="delete" object="lesson">
          <button
            onClick={() => onDeleteActivity(activity.id)}
            className="hover:text-error-focus transition-colors"
          >
            <Trash2 className="w-4 h-4 text-error" />
          </button>
        </Can>
      </span>
    </article>
  );
}
