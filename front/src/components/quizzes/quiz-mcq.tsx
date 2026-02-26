import { useState } from "react";
import { Quiz } from "../../utils/interfaces/quiz";

interface Props {
  quiz: Extract<Quiz, { type: "mcq" }>;
  onAnswer: (isCorrect: boolean) => void;
  isAnswered: boolean;
}

const QuizMcq = ({ quiz, onAnswer, isAnswered }: Props) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleValidate = () => {
    if (selected !== null) {
      onAnswer(selected === quiz.data.answerIndex);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {quiz.data.options.map((option: string, index: number) => (
          <button
            key={index}
            className={`btn justify-start h-auto min-h-12 normal-case text-left ${
              selected === index
                ? "btn-primary"
                : "btn-outline btn-neutral text-secondary/80"
            }`}
            onClick={() => setSelected(index)}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
      {!isAnswered && (
        <button
          className="btn btn-secondary self-end mt-4"
          disabled={selected === null}
          onClick={handleValidate}
        >
          Valider ma réponse
        </button>
      )}
    </div>
  );
};

export default QuizMcq;
