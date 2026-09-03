import { useContext } from "react";
import { ModuleData } from "../../../interfaces/new-module";
import ElementNotFound from "../../../../../components/UI/element-not-found";
import ModuleCard from "./ModuleCard";
import { AuthContext } from "../../../../../store/AuthProvider";
import { isTeacherUser } from "../../../../../utils/helpers/user-role";

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
  const { user } = useContext(AuthContext);

  if (modules.length === 0) {
    return (
      <ElementNotFound
        message={
          isTeacherUser(user) ? "Aucun module affecté" : "Aucun module trouvé"
        }
      />
    );
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
