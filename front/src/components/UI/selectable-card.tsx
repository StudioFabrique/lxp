import { ReactNode, MouseEvent } from "react";
import { Eye, Trash2 } from "lucide-react";

type SelectableCardProps = {
  // Données
  title?: string;
  subtitle?: string | ReactNode;
  icon?: ReactNode; // L'icône principale à gauche du titre

  // État
  isSelected?: boolean;

  // Actions
  onAction?: () => void; // Action principale (ex: Prévisualiser)
  actionLabel?: string; // Texte du bouton d'action (ex: "Aperçu")
  actionIcon?: ReactNode; // Icône du bouton d'action

  onDelete?: () => void; // Si fourni, affiche le bouton poubelle
  deleteTooltip?: string;

  // Style
  className?: string;
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
}: SelectableCardProps) => {
  // Gestionnaire pour la suppression avec stopPropagation
  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  return (
    <div
      className={`
        card bg-base-100 shadow-sm border transition-all duration-200 hover:shadow-md
        ${isSelected ? "border-primary ring-1 ring-primary" : "border-base-200"}
        ${className}
      `}
    >
      <div className="card-body p-3">
        <div className="flex justify-between items-center gap-3">
          {/* PARTIE GAUCHE : Contenu */}
          <div className="flex flex-col items-center min-w-0 gap-1">
            <h3
              className="card-title text-base font-bold text-base-content truncate flex gap-2 items-center"
              title={title}
            >
              {icon && <div className="flex-shrink-0">{icon}</div>}
              <span className="truncate">{title}</span>
            </h3>

            {subtitle && (
              <div className="text-xs text-base-content/70">{subtitle}</div>
            )}
          </div>

          {/* PARTIE DROITE : Actions */}
          <div className="flex gap-2 flex-none items-center">
            {/* Bouton Supprimer (Affiché seulement si onDelete est fourni) */}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="btn btn-sm btn-square btn-ghost text-error hover:bg-error/10 tooltip tooltip-left"
                data-tip={deleteTooltip}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            {/* Bouton d'Action Principale */}
            {onAction && (
              <button
                onClick={onAction}
                className={`btn btn-sm ${
                  isSelected
                    ? "btn-primary text-base-100"
                    : "btn-outline btn-primary"
                }`}
              >
                {actionIcon}
                <span className="hidden xl:inline">{actionLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectableCard;
