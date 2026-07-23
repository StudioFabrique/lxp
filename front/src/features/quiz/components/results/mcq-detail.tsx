import { Quiz, UserAnswer } from "../../interfaces/quiz";
import { cn } from "../../../../utils/cn";

export interface McqDetailProps {
  quiz: Extract<Quiz, { type: "mcq" }>;
  userAnswer: Extract<UserAnswer, { type: "mcq" }>;
}

const McqDetail = ({ quiz, userAnswer }: McqDetailProps) => {
  const { selectedIndex } = userAnswer;
  const { answerIndex, options } = quiz.data;

  return (
    <div className="flex flex-col gap-2">
      {options.map((option, i) => {
        const isSelected = i === selectedIndex;
        const isCorrect = i === answerIndex;

        return (
          <div
            key={i}
            className={cn(
              "rounded-lg px-4 py-2 text-sm",
              isSelected &&
                isCorrect &&
                "bg-success text-success-content border-2 border-primary",
              isSelected &&
                !isCorrect &&
                "bg-error text-error-content border-2 border-primary",
              !isSelected && isCorrect && "bg-success/15 text-success",
              !isSelected && !isCorrect && "bg-base-200 text-base-content/40",
            )}
          >
            {option}
          </div>
        );
      })}
    </div>
  );
};

export default McqDetail;
