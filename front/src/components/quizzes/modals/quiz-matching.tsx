import { useState, useEffect } from "react";
import { ArrowBigRightDash, ChevronDown } from "lucide-react";
import { cn } from "../../../utils";
import { Pair, Quiz, UserAnswer } from "../../../utils/interfaces/quiz";
import QuizModalButtons from "./quiz-modal-buttons";

interface Props {
  quiz: Extract<Quiz, { type: "matching" }>;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  onReport: () => void;
  isAnswered: boolean;
}

const QuizMatching = ({ quiz, onAnswer, onReport, isAnswered }: Props) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [rightOptions, setRightOptions] = useState<string[]>([]);
  // Index de la ligne dont le dropdown est ouvert (null = tous fermés)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const options = quiz.data.pairs.map((p: Pair) => p.right);
    setRightOptions(options.sort(() => Math.random() - 0.5));
  }, [quiz]);

  // Fermer tous les dropdowns quand le quiz est validé
  useEffect(() => {
    if (isAnswered) setOpenIndex(null);
  }, [isAnswered]);

  // Fermer au clic en dehors
  useEffect(() => {
    const close = () => setOpenIndex(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleToggle = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAnswered) return;
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleSelect = (leftIndex: number, value: string) => {
    if (value === "") {
      setAnswers((prev) => {
        const next = { ...prev };
        delete next[leftIndex];
        return next;
      });
    } else {
      setAnswers((prev) => ({ ...prev, [leftIndex]: value }));
    }
  };

  const handleOptionClick = (
    leftIndex: number,
    value: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    handleSelect(leftIndex, value);
    setOpenIndex(null);
  };

  const handleValidate = () => {
    let correct = true;
    quiz.data.pairs.forEach((pair: Pair, index: number) => {
      if (answers[index] !== pair.right) correct = false;
    });
    onAnswer(correct, { type: "matching", answers });
  };

  const allAnswered = Object.keys(answers).length === quiz.data.pairs.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {quiz.data.pairs.map((pair: Pair, index: number) => {
          const usedByOthers = new Set(
            Object.entries(answers)
              .filter(([k]) => Number(k) !== index)
              .map(([, v]) => v),
          );

          const isRowAnswered = Boolean(answers[index]);
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={cn(
                "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,2fr)] items-center gap-3 p-3 rounded-box transition-colors",
                isRowAnswered ? "bg-primary/10" : "bg-base-200",
              )}
            >
              <div className="font-medium min-w-0">{pair.left}</div>

              <ArrowBigRightDash
                size={18}
                className="shrink-0 text-primary/50"
              />

              {/* Dropdown DaisyUI contrôlé */}
              <div
                className={cn("dropdown w-full", isOpen && "dropdown-open")}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Trigger — stylé comme un select DaisyUI */}
                <div
                  tabIndex={0}
                  role="button"
                  onClick={(e) => handleToggle(index, e)}
                  className={cn(
                    "select select-bordered w-full flex items-center justify-between cursor-pointer transition-colors bg-none",
                    isRowAnswered && "select-primary",
                    isAnswered && "pointer-events-none opacity-60",
                  )}
                >
                  <span
                    className={cn(
                      "truncate text-sm",
                      !answers[index] && "text-base-content/40",
                    )}
                  >
                    {answers[index] ?? "— Sélectionner —"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </div>

                {/* Liste d'options */}
                <ul className="dropdown-content menu bg-base-100 rounded-box z-50 w-full mt-1 p-1 shadow-lg border border-base-200">
                  {/* Option de désélection */}
                  <li>
                    <button
                      type="button"
                      className="text-base-content/40 text-sm"
                      onClick={(e) => handleOptionClick(index, "", e)}
                    >
                      — Sélectionner —
                    </button>
                  </li>

                  {rightOptions.map((opt, i) => {
                    const isUsed = usedByOthers.has(opt);
                    const isSelected = answers[index] === opt;

                    return (
                      <li key={i}>
                        <button
                          type="button"
                          disabled={isUsed}
                          onClick={(e) => handleOptionClick(index, opt, e)}
                          className={cn(
                            "text-sm",
                            isSelected && "active",
                            isUsed && "opacity-30 cursor-not-allowed",
                          )}
                        >
                          {opt}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {!isAnswered && (
        <QuizModalButtons
          onValidate={handleValidate}
          onReport={onReport}
          isAnswered={!allAnswered}
        />
      )}
    </div>
  );
};

export default QuizMatching;
