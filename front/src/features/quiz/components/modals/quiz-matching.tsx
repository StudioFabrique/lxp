import { useRef, useState } from "react";
import { GripVertical } from "lucide-react";
import { Pair, Quiz, UserAnswer } from "../../interfaces/quiz";
import QuizModalButtons from "./quiz-modal-buttons";
import { cn } from "../../../../utils/cn";

interface Props {
  quiz: Extract<Quiz, { type: "matching" }>;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  onReport: (externalId: string, comment: string) => Promise<void>;
  isAnswered: boolean;
}

// Un cycle aléatoire évite de placer une réponse à sa position initiale.
const shuffledPositions = (length: number) => {
  const positions = Array.from({ length }, (_, index) => index);
  for (let index = length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * index);
    [positions[index], positions[other]] = [positions[other], positions[index]];
  }
  return positions;
};

const QuizMatching = ({ quiz, onAnswer, onReport, isAnswered }: Props) => {
  const [positions, setPositions] = useState(() => shuffledPositions(quiz.data.pairs.length));
  const [selected, setSelected] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const dragging = useRef<number | null>(null);

  const swap = (from: number, to: number) => {
    if (isAnswered || from === to) return;
    setPositions((previous) => {
      const next = [...previous];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
    setSelected(null);
  };

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    if (selected === null) setSelected(index);
    else if (selected === index) setSelected(null);
    else swap(selected, index);
  };

  const handleValidate = () => {
    const answers = Object.fromEntries(
      positions.map((position, index) => [index, quiz.data.pairs[position].right]),
    ) as Record<number, string>;
    const isCorrect = quiz.data.pairs.every(
      (pair: Pair, index: number) => answers[index] === pair.right,
    );
    onAnswer(isCorrect, { type: "matching", answers });
    setSelected(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-base-content/70">Glissez les réponses pour les échanger, ou sélectionnez-en deux.</p>
      <div className="flex flex-col gap-3">
        {quiz.data.pairs.map((pair: Pair, index: number) => (
          <div key={index} className="grid grid-cols-2 items-stretch gap-3 rounded-box border border-base-300 bg-base-200 p-3">
            <div className="flex min-w-0 items-center font-medium break-words">{pair.left}</div>
            <button
              type="button"
              draggable={!isAnswered}
              disabled={isAnswered}
              aria-label={`Réponse associée à ${pair.left} : ${quiz.data.pairs[positions[index]].right}. Sélectionner pour échanger.`}
              aria-pressed={selected === index}
              onClick={() => handleSelect(index)}
              onDragStart={(event) => {
                dragging.current = index;
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
                if (dragging.current !== null) swap(dragging.current, index);
                setDragOver(null);
                dragging.current = null;
              }}
              onDragEnd={() => { dragging.current = null; setDragOver(null); }}
              className={cn(
                "btn btn-outline btn-secondary h-auto min-h-12 w-full justify-start gap-2 normal-case text-left whitespace-normal break-words touch-manipulation",
                selected === index && "btn-primary",
                dragOver === index && dragging.current !== index && "ring-2 ring-primary ring-offset-2 ring-offset-base-100",
              )}
            >
              <GripVertical size={18} className="shrink-0 opacity-60" aria-hidden="true" />
              <span className="min-w-0">{quiz.data.pairs[positions[index]].right}</span>
            </button>
          </div>
        ))}
      </div>
      {!isAnswered && <QuizModalButtons isValid={positions.length === quiz.data.pairs.length} onValidate={handleValidate} onReport={onReport} externalId={quiz.id} />}
    </div>
  );
};

export default QuizMatching;
