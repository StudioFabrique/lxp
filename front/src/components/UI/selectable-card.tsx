import { ReactNode, MouseEvent } from "react";
import { Eye, Trash2 } from "lucide-react";
import ToolTipWarning from "./tooltip-warning/tooltip-warning";

type SelectableCardProps = {
  // Données
  title?: string;
  subtitle?: string | ReactNode;
  icon?: ReactNode;

  // État
  isSelected?: boolean;

  // Actions
  onAction?: () => void;
  actionLabel?: string;
  actionIcon?: ReactNode;

  onDelete?: () => void;
  deleteTooltip?: string;

  // Style
  className?: string;

  error?: string;
};

const SelectableCard = ({
  title,
  subtitle,
  icon,
  isSelected = false,
  onAction,
  actionLabel = "Voir",
  actionIcon = <Eye className="w-4 h-4" />,
  onDelete,
  deleteTooltip = "Supprimer",
  className = "",
  error,
}: SelectableCardProps) => {
  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div
      className={`
        card shadow-sm border transition-all duration-200 hover:shadow-md
        ${isSelected ? "border-primary ring-1 ring-primary" : "border-base-200"}
        ${error ? "bg-error/10" : "bg-base-300"}
        ${className}
        w-full overflow-hidden {/* Ajout: assure que la card ne dépasse pas son parent */}
      `}
    >
      <div className="card-body p-1 px-4">
        <div className="flex justify-between items-center w-full gap-4">
          {/* PARTIE GAUCHE : Contenu */}
          <div className="flex gap-4 items-center flex-1 min-w-0">
            {icon && <div className="flex-shrink-0">{icon}</div>}

            <div className="flex flex-col min-w-0 gap-1 w-full">
              <h3
                className="card-title text-base font-bold text-base-content flex gap-2 items-center"
                title={title}
              >
                <span className="truncate">{title}</span>

                {error && (
                  <div className="flex-shrink-0">
                    <ToolTipWarning
                      absolutePos
                      tooltipPos="tooltip-left"
                      message={error}
                    />
                  </div>
                )}
              </h3>

              {subtitle && (
                <div className="text-xs text-base-content/70 truncate">
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          {/* PARTIE DROITE : Actions */}
          <div
            className={`flex gap-2 flex-none items-center ${error ? "mr-5" : ""}`}
          >
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="btn btn-sm btn-square btn-ghost text-error hover:bg-error/10 tooltip tooltip-left"
                data-tip={deleteTooltip}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {onAction && (
              <button
                onClick={onAction}
                className={`btn btn-sm ${
                  isSelected
                    ? "btn-outline btn-primary"
                    : "btn-ghost btn-secondary"
                }`}
              >
                {actionIcon}
                <span className="hidden 2xl:inline whitespace-nowrap">
                  {actionLabel}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectableCard;
