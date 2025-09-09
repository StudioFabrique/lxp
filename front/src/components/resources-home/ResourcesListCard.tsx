import { Edit, Trash2 } from "lucide-react";
import { ResourceListItem } from "../../views/resources/hooks/useResources";
import ElementNotFound from "../UI/element-not-found";
import ArrowTopRightIcon from "../UI/svg/arrow-top-right-icon";

type Props = {
  resourcesList: ResourceListItem[];
};

export default function ResourcesListCard({ resourcesList }: Props) {
  return (
    <>
      {resourcesList && resourcesList.length > 0 ? (
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4 text-lg font-semibold text-center">
          {resourcesList.map((resource) => (
            <span
              key={resource.id}
              className="w-full border border-primary/50 rounded-md p-4 mb-4 h-[12rem] flex flex-col justify-between items-center hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <span className="flex flex-col">
                <h3>{resource.title}</h3>
                <div className="flex-1" />
              </span>
              <div className="w-full">
                <div className="divider" />
                <div className="flex justify-around items-center">
                  <button
                    aria-label="modifier la ressource"
                    className="tooltip tooltip-bottom cursor-pointer"
                    data-tip="Modifier la ressource"
                  >
                    <Edit className="text-primary w-4 h-4" />
                  </button>
                  <button
                    aria-label="supprimer la ressource tooltip-bottom"
                    className="tooltip tooltip-bottom cursor-pointer"
                    data-tip="Supprimer la ressource"
                  >
                    <Trash2 className="text-error w-4 h-4" />
                  </button>
                  <button
                    className="text-primary w-4 h-4 cursor-pointer tooltip tooltip-bottom"
                    data-tip="Aperçu de la ressource"
                    aria-label="Aperçu de la ressource"
                  >
                    <ArrowTopRightIcon />
                  </button>
                </div>
              </div>
            </span>
          ))}
        </div>
      ) : (
        <ElementNotFound message="Aucune ressource supplémentaire trouvée" />
      )}
    </>
  );
}
