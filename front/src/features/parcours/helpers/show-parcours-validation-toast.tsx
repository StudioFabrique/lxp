import toast from "react-hot-toast";
import { X } from "lucide-react";
import { getValidationStep, goToValidationTarget } from "./parcours-validation-target";

export const PARCOURS_VALIDATION_TOAST_ID = "parcours-validation";

/**
 * Signale d'un coup tout ce qui empêche la publication du parcours, comme les autres toasts :
 * une ligne par manque, chacune avec un bouton « Corriger » qui mène à l'étape et au bloc concernés.
 * Le toast reste affiché jusqu'à un clic sur « Corriger » ou sur la croix : un délai fixe
 * disparaissait avant qu'on puisse l'atteindre.
 */
export const showParcoursValidationToast = (
  validationErrors: Array<Record<string, string>>,
  updateStep: (step: number) => void,
): void => {
  const items = validationErrors.flatMap((error) => Object.entries(error));
  if (items.length === 0) return;

  toast.error(
    (t) => (
      <div className="flex flex-col gap-y-2">
        <div className="flex items-start justify-between gap-x-3">
          <p className="font-semibold">
            {items.length > 1
              ? "Avant de publier, complétez ces points"
              : "Avant de publier, complétez ce point"}
          </p>
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-square"
            aria-label="Fermer le message"
            onClick={() => toast.dismiss(t.id)}
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <ul className="flex flex-col gap-y-2">
          {items.map(([key, message]) => (
            <li key={key} className="flex items-center justify-between gap-x-3">
              <span>{message}</span>
              <button
                type="button"
                className="btn btn-sm btn-primary shrink-0"
                onClick={() => {
                  toast.dismiss(t.id);
                  goToValidationTarget(key, updateStep);
                }}
              >
                Corriger
              </button>
            </li>
          ))}
        </ul>
      </div>
    ),
    {
      id: PARCOURS_VALIDATION_TOAST_ID,
      duration: items.some(([key]) => getValidationStep(key) !== undefined)
        ? Infinity
        : 8000,
    },
  );
};
