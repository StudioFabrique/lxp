import { GripVertical, Pen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Activity from "../../../utils/interfaces/activity";
import BookIcon from "../../UI/svg/book-icon";
import Can from "../../UI/can/can.component";
import { useDispatch } from "react-redux";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";
import { useMemo } from "react";
import { displayDate } from "../../../helpers/dispaly-dates";

type Props = {
  activity: Activity;
  index: number;
  onDeleteActivity: (activity: Activity) => void;
};

export default function ActivityListItem({
  activity,
  index,
  onDeleteActivity,
}: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const date = useMemo(
    () => displayDate(activity.createdAt, activity.updatedAt),
    [activity.createdAt, activity.updatedAt]
  );

  const handleGoToActivity = () => {
    console.log({ activity });
    dispatch(lessonActions.setActivity(activity));
    navigate(`preview/${activity.id}`);
  };

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
        <p className="text-base-content/50 text-xs italic">{date}</p>
        <Can action="update" object="lesson">
          <button
            onClick={handleGoToActivity}
            className="hover:text-primary-focus transition-colors"
          >
            <Pen className="w-6 h-6 text-primary" />
          </button>
        </Can>
        <Can action="delete" object="lesson">
          <button
            onClick={() => onDeleteActivity(activity)}
            className="hover:text-error-focus transition-colors"
          >
            <Trash2 className="w-6 h-6 text-error" />
          </button>
        </Can>
      </span>
    </article>
  );
}
