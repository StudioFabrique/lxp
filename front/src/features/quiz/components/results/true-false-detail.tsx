import { Quiz, UserAnswer } from "../../interfaces/quiz";
import { cn } from "../../../../utils/cn";

export interface TrueFalseDetailProps {
  quiz: Extract<Quiz, { type: "true_false" }>;
  userAnswer: Extract<UserAnswer, { type: "true_false" }>;
}

const TrueFalseDetail = ({ quiz, userAnswer }: TrueFalseDetailProps) => {
  const { selected } = userAnswer;
  const { answer } = quiz.data;

  return (
    <div className="flex gap-3">
      {([true, false] as const).map((value) => {
        const isSelected = selected === value;
        const isCorrect = answer === value;

        return (
          <div
            key={String(value)}
            className={cn(
              "flex-1 text-center rounded-lg px-6 py-2 font-medium text-sm",
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
            {value ? "VRAI" : "FAUX"}
          </div>
        );
      })}
    </div>
  );
};

export default TrueFalseDetail;
