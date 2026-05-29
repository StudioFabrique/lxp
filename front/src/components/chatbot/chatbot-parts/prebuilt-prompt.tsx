import { useContext, useMemo } from "react";
import { ChatbotContext } from "../../../store/chatbotContext";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { prebuiltPrompt } from "../../../config/ai/ai-texts.json";

type Props = {
  setPrebuiltPrompt: (prompt: string) => void;
};

export default function PrebuiltPrompt({ setPrebuiltPrompt }: Props) {
  const { currentCourseId } = useContext(ChatbotContext);

  const handleClick = (question: string) => {
    setPrebuiltPrompt(question);
  };

  // Sélectionne 3 questions aléatoires uniques pour générer des suggestions de prompts
  const suggestedPrompts = useMemo(() => {
    const allPrompts = [...prebuiltPrompt.suggestedPrompts];
    return allPrompts.sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  if (!currentCourseId) return null;

  return (
    <div className="flex flex-col gap-3 p-1">
      {/* En-tête */}
      <div className="flex items-center gap-2 text-xs font-medium text-base-content/60 px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
        <span>Besoin d'un coup de pouce sur ce cours ?</span>
      </div>

      {/* Grille de suggestions */}
      <div className="flex flex-col gap-2 w-full">
        {suggestedPrompts.map((question, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(question)}
            className="group flex items-start justify-between gap-3 text-left p-3 rounded-xl bg-base-200/50 border border-base-300/70 hover:bg-base-100 hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.99]"
          >
            <span className="text-xs text-base-content/80 group-hover:text-base-content transition-colors leading-relaxed line-clamp-2">
              {question}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
          </button>
        ))}
      </div>
    </div>
  );
}
