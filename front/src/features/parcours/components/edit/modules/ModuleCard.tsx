import { Edit2Icon, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router";
import placeholder from "../../../../../../src/assets/images/cat.webp";
import { ModuleData } from "../../../interfaces/new-module";
import AppImage from "../../../../../components/UI/image/app-image";
import { cn } from "../../../../../utils/cn";

type ModuleCardProps = {
  module: ModuleData;
  selected?: boolean;
  onUpdate: (module: ModuleData) => void;
  onDelete: (id: number) => void;
};

export default function ModuleCard({
  module,
  selected,
  onUpdate,
  onDelete,
}: ModuleCardProps) {
  const { id, title, thumb } = module;

  return (
    <article
      className={cn(
        "card h-44 w-full bg-base-100 image-full shadow-sm overflow-hidden border border-base-300",
        selected ? "border-2 border-info" : "",
      )}
    >
      <figure className="rounded-xl">
        <AppImage
          className="object-cover w-full h-full"
          src={thumb}
          fallbackSrc={placeholder}
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

        <div className="card-actions mt-4 flex w-full justify-center gap-2">
          <button
            className="btn btn-sm btn-ghost bg-white/90 text-neutral hover:bg-white"
            type="button"
            title="Modifier le module"
            aria-label="Modifier le module"
            onClick={() => onUpdate(module)}
          >
            <Edit2Icon className="w-4 h-4" />
            Modifier
          </button>
          <Link
            className="btn btn-sm btn-ghost bg-white/90 text-primary hover:bg-white"
            to={`/admin/parcours/module/${module.id}`}
            title="Accéder au module"
            aria-label="Accéder au module"
          >
            <Eye className="w-4 h-4" />
            Aperçu
          </Link>
          <button
            className="btn btn-sm btn-ghost bg-white/90 text-error hover:bg-white"
            type="button"
            title="Supprimer le module"
            aria-label="Supprimer le module"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="w-4 h-4 text-error" />
            Supprimer
          </button>
        </div>
      </div>
    </article>
  );
}
