import { KeyboardEvent, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { cn } from "../../../utils/style-helpers";

type Props = {
  prompt: string;
  isSubmitButtonAnimated: boolean;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleEveryInputInput: () => void;
};

export default function TextInputChatbot({
  prompt,
  isSubmitButtonAnimated,
  setPrompt,
  isLoading,
  handleSubmit,
  handleEveryInputInput,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isLoading) {
        handleSubmit(e);
      }
    }
    handleEveryInputInput();
  };

  // Gestion de l'élasticité du textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
    }
  }, [prompt]);

  return (
    <div className="p-2.5 bg-base-100 border-t border-base-300 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.05)]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        {/* Conteneur moderne style "pilule/capsule" */}
        <div className="relative flex items-end bg-base-200/60 border border-base-300 rounded-2xl p-1.5 transition-all duration-200 focus-within:border-primary focus-within:bg-base-100 focus-within:ring-2 focus-within:ring-primary/10">
          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 resize-none min-h-10 max-h-35 text-sm leading-relaxed pl-3 pr-12 py-2 text-base-content placeholder:text-base-content/40 custom-scrollbar disabled:opacity-50"
            name="prompt"
            disabled={isLoading}
            autoFocus
            placeholder="Posez votre question à l'assistant..."
            rows={1}
            onChange={(e) => setPrompt(e.currentTarget.value)}
            value={prompt}
            onKeyDown={handleKeyDown}
          />

          {/* Bouton d'envoi positionné à l'intérieur */}
          <button
            className={cn(
              "absolute right-2 bottom-2 btn btn-sm btn-primary btn-ghost btn-circle",
              {
                "animate-pulse transition ease-in-out duration-75":
                  isSubmitButtonAnimated,
              },
            )}
            type="submit"
            aria-label="Envoyer"
            disabled={isLoading || !prompt.trim()}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
