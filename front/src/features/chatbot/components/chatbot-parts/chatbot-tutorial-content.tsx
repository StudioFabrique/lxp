import { X } from "lucide-react";
import { cn } from "../../../../utils/cn";

type Props = {
  message: string;
  /** Rang de l'étape, à partir de 0 ; absent quand le tutoriel n'a rien à montrer. */
  index?: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onStop: () => void;
  /** Présent pour un guide automatique : « Ne plus afficher » remplace Précédent / Suivant / Terminer, la croix suffit à le fermer. */
  onNeverShowAgain?: () => void;
};

export default function ChatbotTutorialContent({ message, index, total, onPrevious, onNext, onStop, onNeverShowAgain }: Props) {
  const isLast = index === undefined || index + 1 >= total;

  return (
    <div className="relative flex flex-col gap-3 text-sm text-base-content">
      <button type="button" className="btn btn-ghost btn-circle absolute -right-2 -top-2 size-6 min-h-0 p-0" onClick={onStop} aria-label="Quitter le tutoriel">
        <X className="size-3.5" />
      </button>
      <p className="mr-5">{message}</p>
      <div className={cn("flex items-center justify-between gap-2", onNeverShowAgain && "justify-end")}>
        {onNeverShowAgain ? (
          <button type="button" className="btn btn-primary btn-xs h-5 min-h-0 rounded-full px-2 text-[0.65rem] font-normal" onClick={onNeverShowAgain}>
            Ne plus afficher
          </button>
        ) : (
          <span className="text-xs text-base-content/60" aria-label={index === undefined ? undefined : `Étape ${index + 1} sur ${total}`}>
            {index === undefined || total <= 1 ? "" : `${index + 1} / ${total}`}
          </span>
        )}
        {!onNeverShowAgain && (
          <div className="flex gap-1">
            {index !== undefined && index > 0 && (
              <button type="button" className="btn btn-ghost btn-xs" onClick={onPrevious}>Précédent</button>
            )}
            <button type="button" className="btn btn-primary btn-xs" onClick={isLast ? onStop : onNext}>
              {isLast ? "Terminer" : "Suivant"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
