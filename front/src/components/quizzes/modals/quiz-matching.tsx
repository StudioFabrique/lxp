import { useState, useEffect } from "react";
import { Pair, Quiz, UserAnswer } from "../../../utils/interfaces/quiz";

interface Props {
  quiz: Extract<Quiz, { type: "matching" }>;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  isAnswered: boolean;
}

const QuizMatching = ({ quiz, onAnswer, isAnswered }: Props) => {
  // Mapping entre l'index de gauche et la valeur choisie à droite
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [rightOptions, setRightOptions] = useState<string[]>([]);

  useEffect(() => {
    // On mélange les options de droite pour ne pas donner la réponse dans l'ordre
    const options = quiz.data.pairs.map((p: Pair) => p.right);
    setRightOptions(options.sort(() => Math.random() - 0.5));
  }, [quiz]);

  const handleSelect = (leftIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [leftIndex]: value }));
  };

  const handleValidate = () => {
    let correct = true;
    quiz.data.pairs.forEach((pair: Pair, index: number) => {
      if (answers[index] !== pair.right) {
        correct = false;
      }
    });
    onAnswer(correct, { type: "matching", answers });
  };

  const allAnswered = Object.keys(answers).length === quiz.data.pairs.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {quiz.data.pairs.map((pair: Pair, index: number) => {
          // Valeurs déjà sélectionnées par les autres lignes
          const usedByOthers = new Set(
            Object.entries(answers)
              .filter(([k]) => Number(k) !== index)
              .map(([, v]) => v),
          );

          const isRowAnswered = Boolean(answers[index]);

          return (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-4 p-3 rounded-box transition-colors ${
                isRowAnswered ? "bg-primary/10" : "bg-base-200"
              }`}
            >
              <div className="flex-1 font-medium text-center md:text-right w-full">
                {pair.left}
              </div>
              <div className="hidden md:block w-8 text-center text-primary/50">
                ⟷
              </div>
              <div className="flex-1 w-full">
                <select
                  className={`select select-bordered w-full transition-colors ${
                    isRowAnswered ? "select-primary" : ""
                  }`}
                  value={answers[index] || ""}
                  onChange={(e) => handleSelect(index, e.target.value)}
                  disabled={isAnswered}
                >
                  <option value="" disabled>
                    Sélectionner une réponse…
                  </option>
                  {rightOptions.map((opt, i) => (
                    <option
                      key={i}
                      value={opt}
                      disabled={usedByOthers.has(opt)}
                    >
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
      {!isAnswered && (
        <button
          className="btn btn-secondary self-end mt-4"
          disabled={!allAnswered}
          onClick={handleValidate}
        >
          Valider ma réponse
        </button>
      )}
    </div>
  );
};

export default QuizMatching;
