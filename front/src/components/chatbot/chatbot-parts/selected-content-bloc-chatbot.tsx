import Markdown from "react-markdown";
import { X } from "lucide-react";

type Props = {
  textSelection: string;
  onDismiss: () => void;
};

export default function SelectedContentBlocChatbot({
  textSelection,
  onDismiss,
}: Props) {
  return (
    <div className="flex flex-col items-end gap-2">
      <span className="text-[11pt] text-primary/70">
        Le texte selectionné sera pris en compte dans la question
      </span>
      <div className="flex gap-2 p-2 bg-info text-info-content rounded-lg w-[80%] text-[11.5pt]">
        <Markdown>{textSelection}</Markdown>
        <button
          onClick={onDismiss}
          className="btn btn-secondary btn-ghost btn-circle btn-xs"
        >
          <X />
        </button>
      </div>
    </div>
  );
}
