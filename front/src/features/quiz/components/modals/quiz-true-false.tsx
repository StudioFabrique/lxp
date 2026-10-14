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
              selected === choice ? "btn-primary" : "btn-outline btn-primary",
              isAnswered && "disabled:text-base-content",
              isAnswered && choice === quiz.data.answer &&
                "border-2 border-success bg-success/10 text-base-content disabled:border-success disabled:bg-success/10",
              isAnswered && selected === choice && choice !== quiz.data.answer &&
                "border-2 border-error bg-error/10 text-base-content disabled:border-error disabled:bg-error/10",
            )}
            onClick={() => setSelected(choice)}
            disabled={isAnswered}
          >
            {choice ? "VRAI" : "FAUX"}
            {isAnswered && choice === quiz.data.answer && (
              <span className="badge badge-success">Bonne réponse</span>
            )}
            {isAnswered && selected === choice && choice !== quiz.data.answer && (
              <span className="badge badge-error">Votre réponse</span>
            )}
          </button>
        ))}
      </div>
      <QuizModalButtons
        isAnswered={isAnswered}
        isValid={isValid}
        onValidate={handleValidate}
        onReport={onReport}
        externalId={quiz.id}
        nextAction={isAnswered ? nextAction : undefined}
      />
    </div>
  );
};

export default QuizTrueFalse;
