import { ResourceListItem } from "../../views/resources/hooks/useResources";
import ElementNotFound from "../UI/element-not-found";

type Props = {
  resourcesList: ResourceListItem[];
};

export default function ResourcesListCard({ resourcesList }: Props) {
  return (
    <>
      {resourcesList && resourcesList.length > 0 ? (
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 text-lg font-semibold">
          {resourcesList.map((resource) => (
            <span
              key={resource.id}
              className="w-full border border-primary/50 rounded-md p-4 mb-4 h-[8rem] flex justify-center items-center hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <h3>{resource.title}</h3>
            </span>
          ))}
        </div>
      ) : (
        <ElementNotFound message="Aucune ressource supplémentaire trouvée" />
      )}
    </>
  );
}
