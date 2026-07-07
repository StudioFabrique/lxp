import { displayDate } from "../../../../../../src.legacy/helpers/dispaly-dates";
import type { Activity } from "../../../../../../src.legacy/utils/interfaces/activity";
import SubWrapper from "../../../../../../src.legacy/components/UI/sub-wrapper/sub-wrapper.component";

const ActivityMetadata = ({ activity }: { activity: Activity }) => (
  <SubWrapper>
    <article className="flex items-center justify-between">
      <span>
        <h2 className="text-lg font-bold">{activity.title}</h2>
        <p className="text-sm text-gray-500">{activity.description}</p>
      </span>
      <span className="text-xs italic opacity-50">
        {displayDate(activity.createdAt, activity.updatedAt)}
      </span>
    </article>
  </SubWrapper>
);

export default ActivityMetadata;
