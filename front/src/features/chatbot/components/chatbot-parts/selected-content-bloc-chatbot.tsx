import Markdown from "react-markdown";
import { X, FileText } from "lucide-react";

type Props = {
  textSelection: string;
  onDismiss: () => void;
};

export default function SelectedContentBlocChatbot({
  textSelection,
  onDismiss,
}: Props) {
  return (
    <div className="flex flex-col items-end gap-1.5 my-2 w-[85%] ml-auto">
      <div className="flex items-center gap-1.5 px-1 text-xs font-medium text-base-content/60">
        <FileText className="w-3.5 h-3.5 text-primary" />
        <span>Inclus dans votre question</span>
      </div>

      <div className="relative w-full p-3 bg-base-200/70 backdrop-blur-sm border-primary rounded-xl shadow-sm transition-all duration-200 flex items-start gap-3 group">
        <div className="flex-1 text-sm text-base-content/80 leading-relaxed max-h-28 overflow-y-auto pr-1 scrollbar-thin">
          <Markdown>{textSelection}</Markdown>
        </div>

        <button
          onClick={onDismiss}
          className="btn btn-ghost btn-circle btn-xs shrink-0 text-base-content/40 hover:text-error hover:bg-error/10 transition-colors"
          title="Supprimer la sélection"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
