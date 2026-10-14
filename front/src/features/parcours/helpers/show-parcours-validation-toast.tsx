import toast from "react-hot-toast";
import { getValidationStep, goToValidationTarget } from "./parcours-validation-target";

/**
 * Signale la première erreur de validation du parcours comme les autres toasts,
 * avec un bouton « Corriger » qui mène à l'étape et au bloc concernés.
 * Utilise `toast.error` pour conserver l'apparence et l'animation des toasts.
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
      </span>
    ),
    {
      id: "parcours-validation",
      duration: getValidationStep(key) === undefined ? 4000 : 8000,
    },
  );
};
