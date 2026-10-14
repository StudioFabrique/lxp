import type { ReactNode, RefObject } from "react";
import type { ChatbotHelp } from "./AuthChatbotHostContext";
import AuthChatbotRadialMenu from "./AuthChatbotRadialMenu";
import { cn } from "../../../utils/cn";

type Props = {
  message: ReactNode;
  help?: ChatbotHelp;
  id: string;
  anchorRef: RefObject<HTMLButtonElement | null>;
  bubbleRef?: RefObject<HTMLDivElement | null>;
  onOverlapChange?: (overlap: boolean) => void;
  selected: number | null;
  onQuestionSelect: (index: number, answer: ReactNode) => void;
};

export default function AuthChatbotQuestions({ message, help, id, anchorRef, bubbleRef, onOverlapChange, selected, onQuestionSelect }: Props) {
  const questions = [
    { label: "Que dois-je faire à cette étape ?", answer: help?.action ?? message },
    { label: "Comment passer à la suite ?", answer: help?.next ?? "Renseignez les informations demandées, puis utilisez le bouton en bas de l’étape pour continuer." },
    { label: "Puis-je revenir en arrière ?", answer: help?.back ?? "Utilisez le bouton Précédent lorsqu’il est disponible pour revenir à l’étape précédente." },
  ];
  const items = questions.map((question, index) => ({
    key: question.label,
    node: (
      <button type="button" className={cn("btn h-auto min-h-11 w-full whitespace-normal rounded-full border px-4 py-3 text-sm font-normal shadow-md", selected === index ? "btn-primary border-primary-content/40 ring-2 ring-base-content ring-offset-2 ring-offset-base-100" : "btn-secondary border-secondary-content/40")}
        aria-pressed={selected === index}
        onClick={() => {
          onQuestionSelect(index, question.answer);
        }}>
        {question.label}
      </button>
    ),
  }));

  return <AuthChatbotRadialMenu id={id} items={items} anchorRef={anchorRef} bubbleRef={bubbleRef} onOverlapChange={onOverlapChange} />;
}
