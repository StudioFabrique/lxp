import { X } from "lucide-react";
import ChatbotRadialButton from "./chatbot-radial-button";

type Props = {
  label: string;
  onMore: () => void;
  /** Présent quand une série suivante est affichée : la croix revient aux premières questions. */
  onReset?: () => void;
};

/** Entrée « Autres questions » de l'éventail, d'une autre couleur que les questions, avec une croix pour revenir aux premières. */
export default function ChatbotMoreQuestions({ label, onMore, onReset }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <ChatbotRadialButton label={label} variant="secondary" onClick={onMore} />
      </div>
      {onReset && (
        <button
          type="button"
          className="btn btn-secondary btn-circle size-9 min-h-0 shrink-0 border border-secondary-content/40 p-0 shadow-md"
          onClick={onReset}
          aria-label="Revenir aux premières questions"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
