import { X } from "lucide-react";

type Props = { onTriggerQuiz: () => void; onDismiss: () => void };

/** Proposition de quiz faite à l'apprenant qui reste longtemps sur une activité. */
export default function ChatbotQuizSuggestion({ onTriggerQuiz, onDismiss }: Props) {
  return (
    <div className="relative flex flex-col gap-2 text-sm text-base-content">
      <button type="button" className="btn btn-ghost btn-circle absolute -right-2 -top-2 size-6 min-h-0 p-0" onClick={onDismiss} aria-label="Ignorer la proposition de quiz">
        <X className="size-3.5" />
      </button>
      <p className="mr-5">Vous êtes bloqué ? Vous pouvez générer un quiz pour vous aider.</p>
      <button type="button" className="btn btn-primary btn-xs self-end" onClick={onTriggerQuiz}>Générer un quiz</button>
    </div>
  );
}
