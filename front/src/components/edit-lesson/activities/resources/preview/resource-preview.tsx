import Activity from "../../../../../utils/interfaces/activity";

type Props = {
  activity: Activity;
};

function ResourcePreview({ activity }: Props) {
  return <pre>{JSON.stringify(activity, null, 2)}</pre>;
}

export default ResourcePreview;
