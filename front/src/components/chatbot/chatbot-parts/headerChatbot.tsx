import { Bot, X } from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function HeaderChatbot({ onClose }: Props) {
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
      <button
        className="btn btn-ghost btn-sm btn-circle text-primary-content hover:bg-primary-focus"
        onClick={() => onClose()}
        aria-label="Fermer le chatbot"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
