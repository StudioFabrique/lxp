import { useState, useEffect, useMemo, useCallback } from "react";
import { ArrowBigRightDash, ChevronDown } from "lucide-react";

import { Pair, Quiz, UserAnswer } from "../../../utils/interfaces/quiz";
import QuizModalButtons from "./quiz-modal-buttons";
import { cn } from "../../../utils/cn";

interface Props {
  quiz: Extract<Quiz, { type: "matching" }>;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  onReport: (externalId: string, comment: string) => Promise<void>;
  isAnswered: boolean;
}

const QuizMatching = ({ quiz, onAnswer, onReport, isAnswered }: Props) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [rightOptions, setRightOptions] = useState<string[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isValid = quiz.data.pairs.length === Object.keys(answers).length;

  const selectedValues = useMemo(
    () => new Set(Object.values(answers)),
    [answers],
  );

  const handleToggle = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      if (isAnswered) return;
      setOpenIndex((prev) => (prev === index ? null : index));
    },
    [isAnswered],
  );

  const handleOptionClick = useCallback(
    (leftIndex: number, value: string, e: React.MouseEvent) => {
      e.stopPropagation();

      setAnswers((prev) => {
        if (value === "") {
          const next = { ...prev };
          delete next[leftIndex];
          return next;
        }
        return { ...prev, [leftIndex]: value };
      });

      setOpenIndex(null);
    },
    [],
  );

  const handleValidate = () => {
    const isCorrect = quiz.data.pairs.every(
      (pair: Pair, index: number) => answers[index] === pair.right,
    );
    onAnswer(isCorrect, { type: "matching", answers });
    setOpenIndex(null);
  };

  useEffect(() => {
    const options = quiz.data.pairs.map((p: Pair) => p.right);
    setRightOptions([...options].sort(() => Math.random() - 0.5));
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {quiz.data.pairs.map((pair: Pair, index: number) => {
          const isRowAnswered = Boolean(answers[index]);
          const isOpen = openIndex === index;
          const currentAnswer = answers[index];

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

              {/* Dropdown DaisyUI */}
              <div className={cn("dropdown w-full", isOpen && "dropdown-open")}>
                {/* Trigger */}
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
                      !currentAnswer && "text-base-content/40",
                    )}
                  >
                    {currentAnswer ?? "— Sélectionner —"}
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
                    const isSelected = currentAnswer === opt;
                    const isUsed = selectedValues.has(opt) && !isSelected;

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
          isValid={isValid}
          onValidate={handleValidate}
          onReport={onReport}
          externalId={quiz.id}
        />
      )}
    </div>
  );
};

export default QuizMatching;
