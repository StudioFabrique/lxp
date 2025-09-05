import { ResourceListItem } from "../../views/resources/hooks/useResources";
import ElementNotFound from "../UI/element-not-found";

type Props = {
  resourcesList: ResourceListItem[];
};

export default function ResourcesListCard({ resourcesList }: Props) {
  return (
    <>
      {resourcesList && resourcesList.length > 0 ? (
        <ul>
          {resourcesList.map((resource) => (
            <li
              key={resource.id}
              className="border border-gray-300 rounded-md p-4 mb-4"
            >
              <h3 className="text-lg font-semibold">{resource.title}</h3>
              <p className="text-sm text-gray-600">By {resource.author}</p>
              <p className="text-sm text-gray-500">
                Created at: {new Date(resource.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <ElementNotFound message="Aucune ressource supplémentaire trouvée" />
      )}
    </>
  );
}
