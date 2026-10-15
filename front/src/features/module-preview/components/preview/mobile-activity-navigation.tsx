import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../../../../utils/cn";

export type MobileNextAction = {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  onClick: () => void;
};

type MobileActivityNavigationProps = {
  isFirstActivitySelected: boolean;
  /** Action de droite ; `null` quand il n'y a plus rien après (dernière leçon terminée). */
  next: MobileNextAction | null;
  onPreviousActivity: () => void;
};

/** Boutons précédent / suivant de l'activité, déposés dans la barre du bas du mobile. */
export default function MobileActivityNavigation({
  isFirstActivitySelected,
  next,
  onPreviousActivity,
}: MobileActivityNavigationProps) {
  return (
    <>
      <button
        type="button"
        className="btn btn-primary btn-circle"
        onClick={onPreviousActivity}
        disabled={isFirstActivitySelected}
        aria-label="Activité précédente"
      >
        <ArrowLeft className="size-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={cn("btn btn-primary btn-circle", !next && "invisible")}
        onClick={next?.onClick}
        disabled={!next || next.disabled}
        aria-label={next?.label}
        title={next?.label}
      >
        {next?.icon ?? <ArrowRight className="size-5" aria-hidden="true" />}
      </button>
    </>
  );
}
