import { displayDate } from "../../../helpers/dispaly-dates";
import Activity from "../../../utils/interfaces/activity";

const ActivityMetadata = ({ activity }: { activity: Activity }) => (
  <article className="flex items-center justify-between">
    <span>
      <h2 className="text-lg font-bold">{activity.title}</h2>
      <p className="text-sm text-gray-500">{activity.description}</p>
    </span>
    <span className="text-xs italic opacity-50">
      {displayDate(activity.createdAt, activity.updatedAt)}
    </span>
  </article>
);

export default ActivityMetadata;
