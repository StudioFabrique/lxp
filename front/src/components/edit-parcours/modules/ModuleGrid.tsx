import ElementNotFound from "../../UI/element-not-found";
import ModulesList from "./modules-list";

type Module = {
  id: number;
  title: string;
  thumb: string | null;
};

type ModuleGridProps = {
  modules: Module[];
  onDelete: (id: number) => void;
};

/**
 * Grid display of modules in a responsive layout
 * Shows a message when no modules are available
 */
export default function ModuleGrid({ modules, onDelete }: ModuleGridProps) {
  if (modules.length === 0) {
    return <ElementNotFound message="Aucun module trouvé" />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {modules.map((module) => (
        <ModulesList {...module} key={module.id} onDelete={onDelete} />
      ))}
    </div>
  );
}
