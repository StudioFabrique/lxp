import { useRef, useState } from "react";
import { Quiz, UserAnswer } from "../../interfaces/quiz";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import QuizModalButtons from "./quiz-modal-buttons";
import { cn } from "../../../../utils/cn";
import { shuffleAnswers } from "../../utils/shuffle-answers";

interface Props {
  quiz: Extract<Quiz, { type: "ordering" }>;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  onReport: (externalId: string, comment: string) => Promise<void>;
  isAnswered: boolean;
  nextAction?: { label: string; onClick: () => void };
}

const QuizOrdering = ({ quiz, onAnswer, onReport, isAnswered, nextAction }: Props) => {
  const [items, setItems] = useState(() => {
    const shuffled = shuffleAnswers(
      quiz.data.items.map((text: string, originalIndex: number) => ({ text, originalIndex })),
    );
    if (
      shuffled.length > 1 &&
      shuffled.every((item, index) => item.originalIndex === quiz.data.order[index])
    ) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    return shuffled;
  });
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const dragging = useRef<number | null>(null);

  const moveItem = (from: number, to: number) => {
    if (isAnswered || from === to || to < 0 || to >= items.length) return;
    setItems((previous) => {
      const next = [...previous];
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });
  };

  const handleValidate = () => {
    const currentOrder = items.map((item) => item.originalIndex);
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(quiz.data.order);
    onAnswer(isCorrect, { type: "ordering", items });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-base-content/70">Glissez les éléments dans le bon ordre. Les flèches permettent aussi de les déplacer.</p>
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => (
          <li
            key={item.originalIndex}
            draggable={!isAnswered}
            onDragStart={(event) => {
              dragging.current = index;
              setDraggingIndex(index);
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", String(index));
            }}
            onDragOver={(event) => {
              if (isAnswered) return;
              event.preventDefault();
              setDragOver(index);
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(event) => {
              event.preventDefault();
              if (dragging.current !== null) moveItem(dragging.current, index);
              setDragOver(null);
              dragging.current = null;
              setDraggingIndex(null);
            }}
            onDragEnd={() => { dragging.current = null; setDraggingIndex(null); setDragOver(null); }}
            className={cn(
              "flex items-center gap-2 rounded-box border border-base-300 bg-base-200 p-2 sm:gap-3 sm:p-3",
              !isAnswered && "cursor-grab active:cursor-grabbing",
              dragOver === index && draggingIndex !== index && "ring-2 ring-primary",
            )}
          >
            <GripVertical size={18} className="shrink-0 text-base-content/50" aria-hidden="true" />
            <span className="badge badge-primary badge-outline shrink-0">{index + 1}</span>
            <span className="min-w-0 flex-1 font-medium break-words">{item.text}</span>
            <div className="flex flex-col gap-1">
              <button type="button" className="btn btn-xs btn-circle btn-ghost" disabled={index === 0 || isAnswered} onClick={() => moveItem(index, index - 1)} aria-label={`Monter ${item.text}`}><ArrowUp size={14} /></button>
              <button type="button" className="btn btn-xs btn-circle btn-ghost" disabled={index === items.length - 1 || isAnswered} onClick={() => moveItem(index, index + 1)} aria-label={`Descendre ${item.text}`}><ArrowDown size={14} /></button>
            </div>
          </li>
        ))}
      </ul>
      {(!isAnswered || nextAction) && <QuizModalButtons isValid={items.length === quiz.data.items.length} onValidate={handleValidate} onReport={onReport} externalId={quiz.id} nextAction={isAnswered ? nextAction : undefined} />}
    </div>
  );
};

export default QuizOrdering;
