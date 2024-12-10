import { Resource } from "../../../../../utils/interfaces/activity";

type Props = {
  resource: Resource;
};

function ResourceUpdate({ resource }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <span className="flex flex-col gap-y-2">
        <h2>Modification de la ressource</h2>
        <input
          className="input input-primary focus:outline-none"
          type="text"
          defaultValue={resource.label}
        />
      </span>
    </div>
  );
}

export default ResourceUpdate;
