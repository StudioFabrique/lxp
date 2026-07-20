import { ModuleData } from "../../../interfaces/new-module";
import ElementNotFound from "../../../../../components/UI/element-not-found";
import ModuleCard from "./ModuleCard";

type ModuleGridProps = {
  modules: ModuleData[];
  onUpdate: (module: ModuleData) => void;
  onDelete: (id: number) => void;
};

export default function ModuleGrid({
  modules,
  onUpdate,
  onDelete,
}: ModuleGridProps) {
  if (modules.length === 0) {
    return <ElementNotFound message="Aucun module trouvé" />;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {modules.map((module) => (
        <ModuleCard
          module={module}
          key={module.id}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
