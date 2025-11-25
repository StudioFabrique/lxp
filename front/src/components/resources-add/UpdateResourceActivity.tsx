import { Activity } from "../../utils/interfaces/activity";

type Props = {
  activity: Activity;
};

export default function UpdateResourceActivity(props: Props) {
  return <div>Update Resource Activity - {props.activity.type}</div>;
}
