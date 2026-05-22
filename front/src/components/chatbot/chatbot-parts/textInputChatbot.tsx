import { Send } from "lucide-react";

type Props = {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function TextInputChatbot({
  prompt,
  setPrompt,
  isLoading,
  handleSubmit,
}: Props) {
  return (
    <div className="p-3 bg-base-100 border-t border-base-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <textarea
            className="textarea textarea-bordered flex-1 focus:outline-none focus:border-primary resize-none min-h-10 max-h-24 text-sm leading-relaxed py-2.5"
            name="prompt"
            placeholder="Posez votre question à l'assistant..."
            rows={1}
            onChange={(e) => setPrompt(e.currentTarget.value)}
            value={prompt}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (prompt.trim()) {
                  handleSubmit(e);
                }
              }
            }}
          />
          <button
            className="btn btn-primary btn-circle shadow-md shrink-0 mb-1"
            type="submit"
            aria-label="Envoyer"
            disabled={isLoading || !prompt.trim()}
          >
            <Send className="w-4 h-4 ml-1" />{" "}
            {/* ml-1 pour centrer visuellement l'icône Send */}
          </button>
        </div>
        <p className="text-[10px] font-medium text-base-content/40 text-right pr-2">
          Crédits : 0/1000
        </p>
      </form>
    </div>
  );
}
