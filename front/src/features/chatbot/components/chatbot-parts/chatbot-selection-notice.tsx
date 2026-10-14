import { X } from "lucide-react";

type Props = { textSelection: string; onDismiss: () => void };

/** Passage sélectionné dans l'activité, joint à la prochaine question tant qu'il n'est pas retiré. */
export default function ChatbotSelectionNotice({ textSelection, onDismiss }: Props) {
  return (
    <div className="relative flex flex-col gap-1 text-sm text-base-content">
      <button type="button" className="btn btn-ghost btn-circle absolute -right-2 -top-2 size-6 min-h-0 p-0" onClick={onDismiss} aria-label="Retirer le passage sélectionné">
        <X className="size-3.5" />
      </button>
      <p className="mr-5 text-xs font-medium text-base-content/60">Une question sur ce passage ?</p>
      <blockquote className="line-clamp-4 border-l-2 border-primary pl-2 text-xs italic">{textSelection}</blockquote>
    </div>
  );
}
