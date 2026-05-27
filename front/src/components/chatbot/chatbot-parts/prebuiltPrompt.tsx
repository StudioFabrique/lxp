import { useContext } from "react";
import { ChatbotContext } from "../../../store/chatbotContext";
import { Sparkles, ArrowUpRight } from "lucide-react";

type Props = {
  setPrebuiltPrompt: (prompt: string) => void;
};

export default function PrebuiltPrompt({ setPrebuiltPrompt }: Props) {
  const { currentActivityName } = useContext(ChatbotContext);

  const handleClick = (question: string) => {
    setPrebuiltPrompt(question);
  };

  // Liste de questions contextualisées et variées pour l'activité
  const suggestedPrompts = [
    `Quelles sont les notions clés abordées dans l’activité "${currentActivityName}" ?`,
    `Pour mieux comprendre l'activité, donne-moi un exemple concret ou une analogie.`,
    `Par quoi devrais-je commencer pour résoudre l'activité "${currentActivityName}" ?`,
    `Peux-tu me résumer l'objectif principal de cet exercice ?`,
  ];

  if (!currentActivityName) return null;

  return (
    <div className="flex flex-col gap-3 p-1">
      {/* En-tête */}
      <div className="flex items-center gap-2 text-xs font-medium text-base-content/60 px-1">
        <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
        <span>Besoin d'un coup de pouce sur cette activité ?</span>
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
