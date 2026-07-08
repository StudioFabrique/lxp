import { ModuleData } from "../../../../../../src/utils/interfaces/new-module";
import ElementNotFound from "../../../../../../src.legacy/components/UI/element-not-found";
import ModulesList from "./modules-list";

type ModuleGridProps = {
  modules: ModuleData[];
  onUpdate: (module: ModuleData) => void;
  onDelete: (id: number) => void;
};

/**
 * Grid display of modules in a responsive layout
 * Shows a message when no modules are available
 */
export default function ModuleGrid({
  modules,
  onUpdate,
  onDelete,
}: ModuleGridProps) {
  if (modules.length === 0) {
    return <ElementNotFound message="Aucun module trouvé" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
      {modules.map((module) => (
        <ModulesList
          {...module}
          key={module.id}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
