import { ModuleData } from "../../../interfaces/new-module";
import ElementNotFound from "../../../../../components/UI/element-not-found";
import ModuleCard from "./ModuleCard";

type ModuleGridProps = {
  modules: ModuleData[];
  selectedModuleId?: number;
  onUpdate: (module: ModuleData) => void;
  onDelete: (id: number) => void;
};

export default function ModuleGrid({
  modules,
  selectedModuleId,
  onUpdate,
  onDelete,
}: ModuleGridProps) {
  if (modules.length === 0) {
    return <ElementNotFound message="Aucun module trouvé" />;
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {modules.map((module) => (
        <ModuleCard
          module={module}
          key={module.id}
          onUpdate={onUpdate}
          onDelete={onDelete}
          selected={module.id === selectedModuleId}
        />
      ))}
    </div>
  );
}
