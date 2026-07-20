import { displayDate } from "../../../helpers/display-dates";
import type { Activity } from "../../../../../../src/utils/interfaces/activity";
import SubWrapper from "../../../../../../src/components/wrappers/SubBoxWrapper";

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
