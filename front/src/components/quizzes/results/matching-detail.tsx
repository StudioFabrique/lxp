import clsx from "clsx";
import { Quiz, UserAnswer } from "../../../utils/interfaces/quiz";

export interface MatchingDetailProps {
  quiz: Extract<Quiz, { type: "matching" }>;
  userAnswer: Extract<UserAnswer, { type: "matching" }>;
}

const MatchingDetail = ({ quiz, userAnswer }: MatchingDetailProps) => {
  const { answers } = userAnswer;
  const { pairs } = quiz.data;

  return (
    <div className="flex flex-col gap-2">
      {pairs.map((pair, i) => {
        const userChoice = answers[i];
        const isCorrect = userChoice === pair.right;

        return (
          <div
            key={i}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm"
          >
            <div className="bg-base-200 rounded-lg px-3 py-2 font-medium">
              {pair.left}
            </div>
            <span className="text-base-content/30">→</span>
            <div className="flex flex-col gap-1">
              <div
                className={clsx(
                  "rounded-lg px-3 py-2",
                  isCorrect
                    ? "bg-success text-success-content"
                    : "bg-error text-error-content line-through",
                )}
              >
                {userChoice}
              </div>
              {!isCorrect && (
                <div className="bg-success/15 text-success rounded-lg px-3 py-2">
                  {pair.right}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchingDetail;
