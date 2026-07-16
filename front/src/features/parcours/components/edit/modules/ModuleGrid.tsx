import { ModuleData } from "../../../../../../src/utils/interfaces/new-module";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch w-full">
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
