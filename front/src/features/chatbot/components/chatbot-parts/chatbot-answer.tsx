import { Maximize2, RotateCw, X } from "lucide-react";
import type { ChatbotValues } from "../../interfaces/chatbot";
import ChatbotMarkdown from "./chatbot-markdown";
import ChatbotSources from "./chatbot-sources";
import { cn } from "../../../../utils/cn";

type Props = {
  message: ChatbotValues;
  routeRoot: string;
  /** Présent seulement si l'erreur peut être relancée (IA indisponible). */
  onRetry?: () => void;
  onExpand: () => void;
  onDismiss: () => void;
};

/** Réponse de l'assistant virtuel dans sa bulle : défilante si elle est longue, avec de quoi l'agrandir ou la fermer. */
export default function ChatbotAnswer({ message, routeRoot, onRetry, onExpand, onDismiss }: Props) {
  const isGeneralKnowledge = message.mode && message.mode !== "course_content";

  return (
    <div className="relative text-sm text-base-content">
      <div className="absolute -right-2 -top-2 z-10 flex">
        <button type="button" className="btn btn-ghost btn-circle size-6 min-h-0 p-0" onClick={onExpand} aria-label="Agrandir la réponse dans la fenêtre de conversation">
          <Maximize2 className="size-3" />
        </button>
        <button type="button" className="btn btn-ghost btn-circle size-6 min-h-0 p-0" onClick={onDismiss} aria-label="Fermer la réponse">
          <X className="size-3.5" />
        </button>
      </div>
      <div className={cn("max-h-60 overflow-y-auto pr-1", message.type === "error" && "text-error")}>
        <div className="prose prose-sm max-w-none text-inherit [&>:first-child]:mr-12 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          <ChatbotMarkdown>{message.message}</ChatbotMarkdown>
        </div>
        {isGeneralKnowledge && (
          <p className="mt-2 text-xs italic text-base-content/70">
            Cette réponse utilise des connaissances générales externes au cours.
          </p>
        )}
        {message.sources && message.sources.length > 0 && (
          <ChatbotSources sources={message.sources} routeRoot={routeRoot} onNavigate={onDismiss} />
        )}
        {onRetry && (
          <button type="button" className="btn btn-outline btn-sm mt-2 gap-1" onClick={onRetry}>
            <RotateCw className="size-3" />
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}
