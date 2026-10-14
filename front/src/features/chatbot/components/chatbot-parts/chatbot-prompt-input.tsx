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
        className="btn btn-circle absolute -right-1 -top-5 z-10 size-7 min-h-0 border-base-300 bg-base-100 p-0 shadow-md"
        onClick={onOpenHistory}
        aria-label="Afficher l’historique de la conversation"
      >
        <History className="size-3.5" aria-hidden="true" />
      </button>
      <div className={cn("flex items-center gap-1 rounded-full border bg-base-100 py-2 pl-5 pr-2 shadow-md focus-within:border-primary", error ? "border-error" : "border-base-300", disabled && "opacity-60")}>
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
