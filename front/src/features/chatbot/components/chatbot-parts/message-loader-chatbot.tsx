import { BotMessageSquare } from "lucide-react";

export default function MessageLoaderChatbot() {
  return (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <BotMessageSquare />
      </div>
      <div className="chat-header text-xs opacity-50 mb-1">Assistant</div>
      <div
        className="chat-bubble chat-bubble-base-200 bg-base-100 text-base-content border border-base-300 shadow-sm flex items-center h-10"
        role="status"
        aria-label="L'assistant écrit une réponse"
      >
        <span className="loading loading-dots loading-sm text-primary" aria-hidden="true" />
      </div>
    </div>
  );
}
