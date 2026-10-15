import { useId } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { cn } from "../../../../utils/cn";
import QuestionMarkTooltip from "../../../../components/UI/question-mark-tooltip/question-mark-tooltip";
import { ROLE_LABEL_MAX_LENGTH } from "../../helpers/role-labels";

type RoleLabelFieldProps = {
  label: string;
  description: string;
  defaultLabel: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  disabled?: boolean;
  /** Côté d'ouverture de l'infobulle : `left` pour la colonne de droite, afin de ne pas déborder. */
  tooltipPosition?: "right" | "left";
};

/** Champ de saisie du libellé d'un rôle, avec rappel de sa valeur par défaut. */
const RoleLabelField = ({
  label,
  description,
  defaultLabel,
  registration,
  error,
  disabled,
  tooltipPosition = "right",
}: RoleLabelFieldProps) => {
  const fieldId = useId();
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex items-center gap-2">
        <label htmlFor={fieldId} className="text-sm font-semibold text-base-content">
          {label}
        </label>
        <QuestionMarkTooltip
          tooltipPosition={tooltipPosition}
          tooltipValue={description}
        />
      </div>
      <input
        {...registration}
        id={fieldId}
        type="text"
        autoComplete="off"
        maxLength={ROLE_LABEL_MAX_LENGTH}
        placeholder={defaultLabel}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${hintId} ${errorId}` : hintId}
        className={cn(
          "input input-lg w-full rounded-lg border-none bg-base-200 px-5 text-sm text-base-content focus:outline-none focus:ring-2 focus:ring-primary",
          error && "input-error",
        )}
      />
      <span id={hintId} className="text-xs text-base-content/60">
        Valeur par défaut : {defaultLabel}.
      </span>
      {error && (
        <span id={errorId} role="alert" className="text-sm text-error">
          {error.message}
        </span>
      )}
    </div>
  );
};

export default RoleLabelField;
