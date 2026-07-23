import { Copy } from "lucide-react";
import { SourceModule } from "../../../interfaces/new-module";

type ModuleListItemProps = {
  module: SourceModule;
  currentParcoursId: number;
  onCopyModule: (module: SourceModule) => void;
};

export default function ModuleListItem({
  module,
  currentParcoursId,
  onCopyModule,
}: ModuleListItemProps) {
  const isCurrentParcours = module.parcours.id === currentParcoursId;
  return (
    <li className="rounded-xl bg-base-100 border border-base-300 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold">{module.title}</p>
          <p className="text-xs text-base-content/65">
            Parcours : {module.parcours.title}
            {isCurrentParcours ? " (actuel)" : ""}
          </p>
          <p className="mt-2 text-xs text-base-content/65">
            {module.courses.length} cours
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm shrink-0"
          onClick={() => onCopyModule(module)}
        >
          <Copy className="h-4 w-4" />
          Dupliquer
        </button>
      </div>
    </li>
  );
}
