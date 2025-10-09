import { Edit2Icon, Trash2 } from "lucide-react";

type Props = {
  id: number;
  title: string;
  thumb?: string;
};

export default function ModulesList(props: Props) {
  return (
    <div
      key={props.id}
      className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-base-300"
    >
      {/* Image Section */}
      <figure className="relative h-28 bg-base-200">
        {props.thumb ? (
          <img
            src={"data:image/webp;base64," + props.thumb}
            alt={props.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback si l'image ne charge pas
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='18' fill='%23666'%3EImage non disponible%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          // Placeholder SVG
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 text-primary/30"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 1 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
        )}

        {/* Badge avec l'ID du props */}
        <div className="absolute top-3 right-3">
          <div className="badge badge-primary badge-sm">ID: {props.id}</div>
        </div>
      </figure>

      {/* Content Section */}
      <div className="card-body p-4">
        <h2 className="card-title text-lg font-semibold text-base-content line-clamp-2">
          {props.title}
        </h2>

        {/* Actions */}
        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-sm btn-square tooltip tooltip-bottom"
            data-tip="Modifier le module"
            aria-label="Modifier le module"
          >
            <Edit2Icon className="w-4 h-4" />
          </button>
          <button
            className="btn btn-sm btn-square tooltip tooltip-bottom"
            data-tip="Supprimer le module"
            aria-label="Supprimer le module"
          >
            <Trash2 className="w-4 h-4 text-error" />
          </button>
        </div>
      </div>
    </div>
  );
}
