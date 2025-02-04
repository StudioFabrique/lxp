import PermissionAddItem from "./permission-add-item";

type Resource = {
  name: string;
  fullName: string;
  description?: string;
  isRole?: boolean;
};

type RemainingResourcesListProps = {
  remainingResources?: Resource[];
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

      {remainingResources?.some((res) => res.isRole) && (
        <div className="flex flex-col gap-2">
          <h3 className="font-bold">Rôles autorisés disponibles</h3>
          {remainingResources
            .filter((res) => res.isRole)
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
