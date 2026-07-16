import { Edit2Icon, Trash2 } from "lucide-react";
import placeholder from "../../../../../../src/assets/images/cat.webp";
import { ModuleData } from "../../../../../utils/interfaces/new-module";

type ModuleCardProps = {
  module: ModuleData;
  onUpdate: (module: ModuleData) => void;
  onDelete: (id: number) => void;
};

export default function ModuleCard({
  module,
  onUpdate,
  onDelete,
}: ModuleCardProps) {
  const { id, title, thumb } = module;

  return (
    <div className="card h-40 w-80 bg-base-100 image-full shadow-sm overflow-hidden">
      <figure>
        <img
          className="object-cover w-full h-full"
          src={thumb ? `data:image/jpeg;base64,${thumb}` : placeholder}
          alt={`Miniature du module : ${title}`}
        />
      </figure>

      <div className="card-body justify-between items-center rounded-xl p-5 flex flex-col">
        <h2
          className="card-title text-center text-base md:text-lg line-clamp-2"
          title={title}
        >
          {title}
        </h2>

        <div className="card-actions mt-4 flex gap-2">
          <button
            className="btn btn-sm btn-ghost bg-white/90 text-neutral hover:bg-white tooltip tooltip-bottom"
            type="button"
            data-tip="Modifier le module"
            aria-label="Modifier le module"
            onClick={() => onUpdate(module)}
          >
            <Edit2Icon className="w-4 h-4" />
            Modifier
          </button>
          <button
            className="btn btn-sm btn-ghost bg-white/90 text-error hover:bg-white tooltip tooltip-bottom"
            type="button"
            data-tip="Supprimer le module"
            aria-label="Supprimer le module"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="w-4 h-4 text-error" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
