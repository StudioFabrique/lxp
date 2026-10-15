import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../../../../utils/cn";

export type MobileNextAction = {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  onClick: () => void;
};

export type MobileActivityPosition = {
  /** Rang de l'activité affichée dans sa leçon, à partir de 1. */
  current: number;
  total: number;
};

type MobileActivityNavigationProps = {
  isFirstActivitySelected: boolean;
  /** Affiché entre les deux boutons de la barre, au milieu de l'espace libre. */
  position?: MobileActivityPosition | null;
  /** Action de droite ; `null` quand il n'y a plus rien après (dernière leçon terminée). */
  next: MobileNextAction | null;
  onPreviousActivity: () => void;
};

/** Position et boutons précédent / suivant de l'activité, déposés dans la barre du bas du mobile. */
export default function MobileActivityNavigation({
  isFirstActivitySelected,
  position = null,
  next,
  onPreviousActivity,
}: MobileActivityNavigationProps) {
  return (
    <>
      {/* Occupe l'espace entre « Sommaire » et les flèches pour se centrer dans la barre. */}
      <span
        className="min-w-0 flex-1 text-center text-sm font-semibold tabular-nums"
        aria-label={
          position
            ? `Activité ${position.current} sur ${position.total}`
            : undefined
        }
      >
        {position ? `${position.current}/${position.total}` : null}
      </span>
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
