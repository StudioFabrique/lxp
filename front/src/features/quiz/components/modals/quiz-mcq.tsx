import { useState } from "react";
import { Quiz, UserAnswer } from "../../interfaces/quiz";
import QuizModalButtons from "./quiz-modal-buttons";
import { cn } from "../../../../utils/cn";
import { shuffleAnswers } from "../../utils/shuffle-answers";

interface Props {
  quiz: Extract<Quiz, { type: "mcq" }>;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  onReport: (externalId: string, comment: string) => Promise<void>;
  isAnswered: boolean;
  nextAction?: { label: string; onClick: () => void };
}

const QuizMcq = ({ quiz, onAnswer, onReport, isAnswered, nextAction }: Props) => {
  const [optionIndexes] = useState(() =>
    shuffleAnswers(quiz.data.options.map((_, index) => index)),
  );
  const [selected, setSelected] = useState<number | null>(null);

  const isValid = selected !== null;

  const handleValidate = () => {
    if (isValid) {
      onAnswer(selected === quiz.data.answerIndex, {
        type: "mcq",
        selectedIndex: selected,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {optionIndexes.map((index) => (
          <button
            key={index}
            className={cn(
              "btn justify-start h-auto min-h-12 normal-case text-left",
              selected === index ? "btn-primary" : "btn-outline btn-primary",
              isAnswered && "disabled:text-base-content",
              isAnswered && index === quiz.data.answerIndex &&
                "border-2 border-success bg-success/10 text-base-content disabled:border-success disabled:bg-success/10",
              isAnswered && selected === index && index !== quiz.data.answerIndex &&
                "border-2 border-error bg-error/10 text-base-content disabled:border-error disabled:bg-error/10",
            )}
            onClick={() => setSelected(index)}
            disabled={isAnswered}
          >
            {quiz.data.options[index]}
            {isAnswered && index === quiz.data.answerIndex && (
              <span className="badge badge-success ml-auto shrink-0">Bonne réponse</span>
            )}
            {isAnswered && selected === index && index !== quiz.data.answerIndex && (
              <span className="badge badge-error ml-auto shrink-0">Votre réponse</span>
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

export default QuizMcq;
