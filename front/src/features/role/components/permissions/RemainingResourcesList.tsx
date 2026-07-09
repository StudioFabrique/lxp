import PermissionAddItem from "./PermissionAddItem";
import type { PermissionItem } from "../../api/role.api";

type RemainingResourcesListProps = {
  remainingResources?: PermissionItem[];
  roleProtection: number;
  onAddPermission: (name: string) => void;
};

const RemainingResourcesList = ({
  remainingResources,
  roleProtection,
  onAddPermission,
}: RemainingResourcesListProps) => {
  return (
    <div className="flex flex-col gap-5 overflow-x-hidden h-[85vh]">
      {remainingResources?.some((res) => !res.isRole) && (
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Permissions disponibles</h3>
          {remainingResources
            .filter((res) => !res.isRole)
            .map((res) => (
              <PermissionAddItem
                key={res.name}
                name={res.name}
                fullName={res.fullName}
                description={res.description}
                isRole={res.isRole}
                inactive={roleProtection >= 2}
                onAddPermission={onAddPermission}
              />
            ))}
        </div>
      )}

      {!remainingResources?.length && <p>Aucune permissions à ajouter</p>}
    </div>
  );
};

export default RemainingResourcesList;
