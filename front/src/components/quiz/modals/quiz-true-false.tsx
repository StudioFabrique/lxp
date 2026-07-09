import { useState } from "react";
import { cn } from "../../../utils/helpers/style-helpers";
import { Quiz, UserAnswer } from "../../../utils/interfaces/quiz";
import QuizModalButtons from "./quiz-modal-buttons";

interface Props {
  quiz: Extract<Quiz, { type: "true_false" }>;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  onReport: (externalId: string, comment: string) => Promise<void>;
  isAnswered: boolean;
}

const QuizTrueFalse = ({ quiz, onAnswer, onReport, isAnswered }: Props) => {
  const [selected, setSelected] = useState<boolean | null>(null);

  const isValid = selected !== null;

  const handleValidate = () => {
    if (isValid) {
      onAnswer(selected === quiz.data.answer, {
        type: "true_false",
        selected: selected,
      });
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 w-full">
        <button
          className={cn(
            "btn flex-1",
            selected === true ? "btn-primary" : "btn-outline btn-secondary",
          )}
          onClick={() => setSelected(true)}
          disabled={isAnswered}
        >
          VRAI
        </button>
        <button
          className={cn(
            "btn flex-1",
            selected === false ? "btn-primary" : "btn-outline btn-secondary",
          )}
          onClick={() => setSelected(false)}
          disabled={isAnswered}
        >
          FAUX
        </button>
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

export default QuizTrueFalse;
