import { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { History, Send } from "lucide-react";
import { chatbotPromptSchema, type ChatbotPromptValues } from "../../chatbot-prompt.schema";
import { cn } from "../../../../utils/cn";

type Props = {
  onSubmitPrompt: (prompt: string) => void;
  /** Ouvre la fenêtre de conversation complète. */
  onOpenHistory: () => void;
  /** IA indisponible : le champ est grisé, l'historique reste consultable. */
  disabled?: boolean;
  autoFocus?: boolean;
};

/** Question libre de l'éventail : une seule ligne, validée comme les autres formulaires avant tout appel à l'IA. */
export default function ChatbotPromptInput({ onSubmitPrompt, onOpenHistory, disabled = false, autoFocus = true }: Props) {
  const inputId = useId();
  const errorId = useId();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ChatbotPromptValues>({
    resolver: zodResolver(chatbotPromptSchema),
    defaultValues: { prompt: "" },
  });
  const error = errors.prompt?.message;

  return (
    <form
      noValidate
      className="relative flex flex-col gap-1"
      onSubmit={handleSubmit(({ prompt }) => {
        reset();
        onSubmitPrompt(prompt);
      })}
    >
      <button
        type="button"
        className="btn btn-circle group absolute -right-2 -top-4 z-10 size-8 min-h-0 border-base-300 bg-base-100 p-0 shadow-md transition-all duration-200 hover:scale-110 hover:border-secondary hover:bg-secondary hover:text-secondary-content hover:shadow-lg focus-visible:scale-110 focus-visible:border-secondary focus-visible:bg-secondary focus-visible:text-secondary-content"
        onClick={onOpenHistory}
        aria-label="Afficher l’historique de la conversation"
      >
        <History className="size-4 transition-transform duration-300 group-hover:-rotate-[60deg] group-focus-visible:-rotate-[60deg]" aria-hidden="true" />
      </button>
      <div className={cn("flex items-center gap-2 rounded-full border bg-base-100 py-3 pl-6 pr-3 shadow-md focus-within:border-primary", error ? "border-error" : "border-base-300", disabled && "opacity-60")}>
        <label htmlFor={inputId} className="sr-only">Poser une question à l’assistant virtuel</label>
        <input
          id={inputId}
          type="text"
          autoComplete="off"
          // Ouvert au clic sur l'assistant virtuel, l'éventail est fait pour écrire tout de suite.
          autoFocus={autoFocus}
          disabled={disabled}
          placeholder={disabled ? "Assistant indisponible" : "Poser une question"}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="min-w-0 flex-1 bg-transparent text-base text-base-content outline-none placeholder:text-base-content/50"
          {...register("prompt")}
        />
        <button type="submit" className="btn btn-primary btn-circle" aria-label="Envoyer la question" disabled={disabled || isSubmitting}>
          <Send className="size-4" />
        </button>
      </div>
      {error && <p id={errorId} role="alert" className="px-3 text-xs text-error">{error}</p>}
    </form>
  );
}
