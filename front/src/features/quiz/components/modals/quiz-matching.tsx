import { isQuizPairs } from "../../utils/map-external-quiz";
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
  nextAction?: { label: string; onClick: () => void };
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

const QuizMatching = ({ quiz, onAnswer, onReport, isAnswered, nextAction }: Props) => {
  const validPairs = isQuizPairs(quiz.data?.pairs);
  const pairs = validPairs ? quiz.data.pairs : [];
  const [positions, setPositions] = useState(() => shuffledPositions(pairs.length));
  const [selected, setSelected] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
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
    if (!validPairs) return;
    const answers = Object.fromEntries(
      positions.map((position, index) => [index, pairs[position].right]),
    ) as Record<number, string>;
    const isCorrect = pairs.every(
      (pair: Pair, index: number) => answers[index] === pair.right,
    );
    onAnswer(isCorrect, { type: "matching", answers });
    setSelected(null);
  };

  if (!validPairs) {
    return (
      <div className="flex flex-col gap-3">
        <p role="alert">Cette question est incomplète. Vous pouvez la signaler.</p>
        <QuizModalButtons isValid={false} onValidate={handleValidate} onReport={onReport} externalId={quiz.id} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-base-content/70">Glissez les réponses pour les échanger, ou sélectionnez-en deux.</p>
      <div className="flex flex-col gap-2">
        {pairs.map((pair: Pair, index: number) => (
          <div key={index} className="grid grid-cols-2 items-stretch gap-3 rounded-box border border-base-300 bg-base-200 p-2.5">
            <div className="flex min-w-0 items-center font-medium break-words">{pair.left}</div>
            <button
              type="button"
              draggable={!isAnswered}
              disabled={isAnswered}
              aria-label={`Réponse associée à ${pair.left} : ${pairs[positions[index]].right}. Sélectionner pour échanger.`}
              aria-pressed={selected === index}
              onClick={() => handleSelect(index)}
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
                if (dragging.current !== null) swap(dragging.current, index);
                setDragOver(null);
                dragging.current = null;
                setDraggingIndex(null);
              }}
              onDragEnd={() => { dragging.current = null; setDraggingIndex(null); setDragOver(null); }}
              className={cn(
                "btn h-auto min-h-12 w-full justify-start gap-2 normal-case text-left whitespace-normal break-words touch-manipulation",
                selected === index ? "btn-primary" : "btn-outline btn-primary",
                dragOver === index && draggingIndex !== index && "ring-2 ring-primary ring-offset-2 ring-offset-base-100",
              )}
            >
              <GripVertical size={18} className="shrink-0 opacity-60" aria-hidden="true" />
              <span className="min-w-0">{pairs[positions[index]].right}</span>
            </button>
          </div>
        ))}
      </div>
      {isAnswered && (
        <section className="rounded-box border-2 border-success bg-success/10 p-4 text-base-content" aria-label="Associations correctes">
          <h3 className="mb-2 font-bold">Associations correctes</h3>
          <dl className="space-y-2">
            {pairs.map((pair, index) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <dt className="font-medium break-words">{pair.left}</dt>
                <dd className="break-words">{pair.right}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      <QuizModalButtons isAnswered={isAnswered} isValid={positions.length === pairs.length} onValidate={handleValidate} onReport={onReport} externalId={quiz.id} nextAction={isAnswered ? nextAction : undefined} />
    </div>
  );
};

export default QuizMatching;
