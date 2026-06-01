import { useState } from "react";
import { Quiz, UserAnswer } from "../../../utils/interfaces/quiz";
import QuizModalButtons from "./quiz-modal-buttons";

interface Props {
  quiz: Extract<Quiz, { type: "mcq" }>;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  onReport: () => void;
  isAnswered: boolean;
}

const QuizMcq = ({ quiz, onAnswer, onReport, isAnswered }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleValidate = () => {
    if (selected !== null) {
      onAnswer(selected === quiz.data.answerIndex, {
        type: "mcq",
        selectedIndex: selected,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quiz.data.options.map((option: string, index: number) => (
          <button
            key={index}
            className={`btn justify-start h-auto min-h-12 normal-case text-left ${
              selected === index ? "btn-primary" : "btn-outline btn-neutral"
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
          onValidate={handleValidate}
          onReport={onReport}
          isAnswered={isAnswered}
        />
      )}
    </div>
  );
};

export default QuizMcq;
