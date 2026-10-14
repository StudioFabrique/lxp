import { X } from "lucide-react";

type Props = {
  message: string;
  /** Rang de l'étape, à partir de 0 ; absent quand le tutoriel n'a rien à montrer. */
  index?: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onStop: () => void;
};

export default function ChatbotTutorialContent({ message, index, total, onPrevious, onNext, onStop }: Props) {
  const isLast = index === undefined || index + 1 >= total;

  return (
    <div className="relative flex flex-col gap-3 text-sm text-base-content">
      <button type="button" className="btn btn-ghost btn-circle absolute -right-2 -top-2 size-6 min-h-0 p-0" onClick={onStop} aria-label="Quitter le tutoriel">
        <X className="size-3.5" />
      </button>
      <p className="mr-5">{message}</p>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-base-content/60" aria-label={index === undefined ? undefined : `Étape ${index + 1} sur ${total}`}>
          {index === undefined ? "" : `${index + 1} / ${total}`}
        </span>
        <div className="flex gap-1">
          {index !== undefined && index > 0 && (
            <button type="button" className="btn btn-ghost btn-xs" onClick={onPrevious}>Précédent</button>
          )}
          <button type="button" className="btn btn-primary btn-xs" onClick={isLast ? onStop : onNext}>
            {isLast ? "Terminer" : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}
