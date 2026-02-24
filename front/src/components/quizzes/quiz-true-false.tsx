import { useState } from "react";
import { Quiz } from "../../utils/interfaces/quiz";

interface Props {
  quiz: Extract<Quiz, { type: "true_false" }>;
  onAnswer: (isCorrect: boolean) => void;
  isAnswered: boolean;
}

const QuizTrueFalse = ({ quiz, onAnswer, isAnswered }: Props) => {
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleValidate = () => {
    if (selected !== null) {
      onAnswer(selected === quiz.data.answer);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 w-full">
        <button
          className={`btn flex-1 ${selected === true ? "btn-primary" : "btn-outline btn-neutral"}`}
          onClick={() => setSelected(true)}
          disabled={isAnswered}
        >
          VRAI
        </button>
        <button
          className={`btn flex-1 ${selected === false ? "btn-primary" : "btn-outline btn-neutral"}`}
          onClick={() => setSelected(false)}
          disabled={isAnswered}
        >
          FAUX
        </button>
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

export default QuizTrueFalse;
