import { useState } from "react";
import { cn } from "../../../../utils/cn";
import { Quiz, UserAnswer } from "../../interfaces/quiz";
import QuizModalButtons from "./quiz-modal-buttons";
import { shuffleAnswers } from "../../utils/shuffle-answers";

interface Props {
  quiz: Extract<Quiz, { type: "true_false" }>;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  onReport: (externalId: string, comment: string) => Promise<void>;
  isAnswered: boolean;
  nextAction?: { label: string; onClick: () => void };
}

const QuizTrueFalse = ({ quiz, onAnswer, onReport, isAnswered, nextAction }: Props) => {
  const [choices] = useState(() => shuffleAnswers([true, false]));
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
        {choices.map((choice) => (
          <button
            key={String(choice)}
            className={cn(
              "btn flex-1",
              selected === choice ? "btn-primary" : "btn-outline btn-secondary",
            )}
            onClick={() => setSelected(choice)}
            disabled={isAnswered}
          >
            {choice ? "VRAI" : "FAUX"}
          </button>
        ))}
      </div>
      {(!isAnswered || nextAction) && (
        <QuizModalButtons
          isValid={isValid}
          onValidate={handleValidate}
          onReport={onReport}
          externalId={quiz.id}
          nextAction={isAnswered ? nextAction : undefined}
        />
      )}
    </div>
  );
};

export default QuizTrueFalse;
