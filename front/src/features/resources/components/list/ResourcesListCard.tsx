import { Pencil, Trash2 } from "lucide-react";
import { cloneElement, ReactNode, useContext } from "react";
import { Link } from "react-router";
import { ResourceListItem } from "../../views/ResourcesHome";
import { AbilityContext } from "../../../../rbac/AbilityProvider";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import HierarchicalListCard from "../../../../components/UI/hierarchical-list-card/HierarchicalListCard";
import activityIconType from "../../../../utils/helpers/activity-icon-type";

type Props = {
  resourcesList?: ResourceListItem[] | null;
  children?: ReactNode;
  onDeleteResource?: (resource: ResourceListItem) => void;
};

export default function ResourcesListCard({
  resourcesList,
  children,
  onDeleteResource,
}: Props) {
  const ability = useContext(AbilityContext);
  const adminView = Boolean(onDeleteResource);
  const list = Array.isArray(resourcesList) ? resourcesList : [];
  if (!list.length) return <>{children}</>;
  return (
    <section className="grid items-start gap-5 lg:grid-cols-2 xl:grid-cols-3">
      {list.map((resource) => {
        const path = adminView
          ? `/admin/resources/edit/${resource.id}`
          : `/student/ressources/details/${resource.id}`;
        return (
          <HierarchicalListCard
            key={resource.id}
            label="Ressource supplémentaire"
            title={resource.title}
            description={
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <span>{resource.author}</span>
              </div>
            }
            action={
              <div className="flex items-center gap-1">
                {adminView && (
                  <PermissionGuard action="update" object="resource">
                    <Link
                      className="btn btn-square btn-sm btn-ghost tooltip tooltip-left"
                      data-tip="Modifier la ressource"
                      to={path}
                      aria-label={`Modifier la ressource ${resource.title}`}
                    >
                      <Pencil className="size-[1.2em]" />
                    </Link>
                  </PermissionGuard>
                )}
                {onDeleteResource && ability.can("delete", "resource") && (
                  <button
                    type="button"
                    className="btn btn-square btn-sm btn-ghost text-error tooltip tooltip-left"
                    data-tip="Supprimer la ressource"
                    aria-label={`Supprimer la ressource ${resource.title}`}
                    onClick={() => onDeleteResource(resource)}
                  >
                    <Trash2 className="size-[1.2em]" />
                  </button>
                )}
              </div>
            }
            items={(resource.activities ?? []).map((activity) => ({
              id: activity.id,
              title: activity.title ?? "Activité",
              description: `Activité ${activity.order + 1}`,
              icon: cloneElement(activityIconType(activity.type), {
                strokeWidth: 1.5,
              }),
              to: `${path}?activityId=${activity.id}`,
            }))}
            maxItemsShown={3}
            emptyMessage="Aucune activité associée"
            moreItemsLabel={(count) => `Afficher plus d'activités (${count})`}
            overflowTitle={`Activités de ${resource.title}`}
          />
        );
      })}
    </section>
  );
}
