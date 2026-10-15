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
      <span className="flex flex-wrap items-center justify-end gap-2 md:gap-x-4">
        <button
          className="btn btn-primary"
          data-chatbot-target="module-create"
          disabled={showForm || isSubmitting}
          onClick={onCreateNew}
        >
          <PlusCircle />
          Créer un nouveau module
        </button>
        <button
          className="btn btn-primary btn-outline"
          data-chatbot-target="module-add-existing"
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
