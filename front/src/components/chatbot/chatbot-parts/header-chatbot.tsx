// header-chatbot.tsx
import {
  Bot,
  Expand,
  LucideMessageCirclePlus,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";

type Props = {
  size: "small" | "large" | "full";
  showFullScreenButton: boolean;
  onClose: () => void;
  onChangeSize: () => void;
  onNewChat: () => void;
};

export default function HeaderChatbot({
  size,
  showFullScreenButton,
  onClose,
  onChangeSize,
  onNewChat,
}: Props) {
  return (
    <div className="bg-primary text-primary-content px-4 py-3 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full p-1 shadow-inner">
          <Bot className="w-full h-full object-contain text-black" />
        </div>
        <div>
          <h2 className="text-lg font-bold leading-tight">Chatbot ANDRIA</h2>
          <p className="text-xs opacity-80">Assistant virtuel</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="btn btn-ghost tooltip tooltip-left btn-sm btn-circle transition-colors"
          onClick={onNewChat}
          title="Nouvelle discussion"
          aria-label="Nouvelle discussion"
          data-tip="Nouvelle discussion"
        >
          <LucideMessageCirclePlus className="w-5 h-5" />
        </button>

        {showFullScreenButton && (
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-circle transition-colors"
            onClick={() => onChangeSize()}
            aria-label="Changer la taille"
          >
            {size === "full" ? (
              <Minimize2 className="w-5 h-5" />
            ) : size === "small" ? (
              <Maximize2 className="w-5 h-5" />
            ) : (
              <Expand className="w-5 h-5" />
            )}
          </button>
        )}

        <button
          type="button"
          className="btn btn-ghost btn-sm btn-circle"
          onClick={onClose}
          aria-label="Fermer le chatbot"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
