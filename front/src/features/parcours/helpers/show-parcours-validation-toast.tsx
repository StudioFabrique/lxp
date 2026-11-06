import toast from "react-hot-toast";
import { X } from "lucide-react";
import { getValidationStep, goToValidationTarget } from "./parcours-validation-target";

export const PARCOURS_VALIDATION_TOAST_ID = "parcours-validation";

/**
 * Signale la première erreur de validation du parcours comme les autres toasts,
 * avec un bouton « Corriger » qui mène à l'étape et au bloc concernés.
 * Utilise `toast.error` pour conserver l'apparence et l'animation des toasts.
 * Quand l'erreur a une étape à ouvrir, le toast reste affiché jusqu'au clic sur
 * « Corriger » ou sur la croix : un délai fixe disparaissait avant qu'on puisse l'atteindre.
 */
export const showParcoursValidationToast = (
  validationErrors: Array<Record<string, string>>,
  updateStep: (step: number) => void,
): void => {
  const [key, message] = Object.entries(validationErrors[0] ?? {})[0] ?? [];
  if (!key || !message) return;

  toast.error(
    (t) => (
      <span className="flex items-center gap-x-3">
        <span>{message}</span>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={() => {
            toast.dismiss(t.id);
            goToValidationTarget(key, updateStep);
          }}
        >
          Corriger
        </button>
        <button
          type="button"
          className="btn btn-sm btn-ghost btn-square"
          aria-label="Fermer le message"
          onClick={() => toast.dismiss(t.id)}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </span>
    ),
    {
      id: PARCOURS_VALIDATION_TOAST_ID,
      duration: getValidationStep(key) === undefined ? 8000 : Infinity,
    },
  );
};
