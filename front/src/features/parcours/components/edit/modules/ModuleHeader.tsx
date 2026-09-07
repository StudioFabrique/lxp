import { Copy, PlusCircle } from "lucide-react";

type ModuleHeaderProps = {
  showForm: boolean;
  parcoursId?: number;
  isSubmitting: boolean;
  onCreateNew: () => void;
  onAddExisting: () => void;
};

/**
 * Header component for module management
 * Displays title and action buttons for creating/adding modules
 */
export default function ModuleHeader({
  showForm,
  isSubmitting,
  onCreateNew,
  onAddExisting,
}: ModuleHeaderProps) {
  return (
    <div className="flex items-center justify-end">
      <span className="flex gap-x-4 items-center">
        <button
          className="btn btn-primary"
          disabled={showForm || isSubmitting}
          onClick={onCreateNew}
        >
          <PlusCircle />
          Créer un nouveau module
        </button>
        <button
          className="btn btn-primary"
          disabled={isSubmitting}
          onClick={onAddExisting}
        >
          <Copy />
          Ajouter un module existant
        </button>
      </span>
    </div>
  );
}
