import PermissionAddItem from "./permission-add-item";

// Type définissant la structure d'une ressource (permission ou rôle)
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

// Composant affichant la liste des permissions et rôles disponibles
const RemainingResourcesList = ({
  remainingResources,
  roleProtection,
  onAddPermission,
}: RemainingResourcesListProps) => {
  return (
    <div className="flex flex-col gap-5 overflow-x-hidden h-[85vh]">
      {/* Affichage des permissions si il en existe */}
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

      {/* Affichage des permissions de type rôles si il en existe */}
      {/* {remainingResources?.some((res) => res.isRole) && (
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
      )} */}

      {/* Message si aucune permission n'est disponible */}
      {!remainingResources?.length && <p>Aucune permissions à ajouter</p>}
    </div>
  );
};

export default RemainingResourcesList;
