import { useState } from "react";
import { Quiz, UserAnswer } from "../../../utils/interfaces/quiz";
import QuizModalButtons from "./quiz-modal-buttons";

interface Props {
  quiz: Extract<Quiz, { type: "mcq" }>;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  onReport: (externalId: string, comment: string) => Promise<void>;
  isAnswered: boolean;
}

const QuizMcq = ({ quiz, onAnswer, onReport, isAnswered }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);

  const isValid = selected !== null;

  const handleValidate = () => {
    if (isValid) {
      onAnswer(selected === quiz.data.answerIndex, {
        type: "mcq",
        selectedIndex: selected,
      });
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quiz.data.options.map((option: string, index: number) => (
          <button
            key={index}
            className={`btn justify-start h-auto min-h-12 normal-case text-left ${
              selected === index ? "btn-primary" : "btn-outline btn-secondary"
            }`}
            onClick={() => setSelected(index)}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
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

export default QuizMcq;
