import { CheckCircle2, XCircle } from "lucide-react";
import { Quiz, QuizAttempt, UserAnswer } from "../../../utils/interfaces/quiz";
import McqDetail from "./mcq-detail";
import TrueFalseDetail from "./true-false-detail";
import MatchingDetail from "./matching-detail";
import OrderingDetail from "./ordering-detail";

export interface AttemptCardProps {
  attempt: QuizAttempt;
  index: number;
}

const AttemptCard = ({ attempt, index }: AttemptCardProps) => {
  const { quiz, isCorrect, userAnswer } = attempt;

  return (
    <div className="rounded-xl bg-base-200/50 p-4 flex flex-col gap-4">
      {/* En-tête */}
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <CheckCircle2 className="text-success shrink-0 mt-0.5" size={20} />
        ) : (
          <XCircle className="text-error shrink-0 mt-0.5" size={20} />
        )}
        <p className="font-semibold">
          <span className="text-base-content/40 mr-2">
            Question {index + 1}
          </span>
          {quiz.question}
        </p>
      </div>

      {/* Détail selon le type */}
      <div className="pl-8">
        {userAnswer.type === "mcq" && (
          <McqDetail
            quiz={quiz as Extract<Quiz, { type: "mcq" }>}
            userAnswer={userAnswer as Extract<UserAnswer, { type: "mcq" }>}
          />
        )}
        {userAnswer.type === "true_false" && (
          <TrueFalseDetail
            quiz={quiz as Extract<Quiz, { type: "true_false" }>}
            userAnswer={
              userAnswer as Extract<UserAnswer, { type: "true_false" }>
            }
          />
        )}
        {userAnswer.type === "matching" && (
          <MatchingDetail
            quiz={quiz as Extract<Quiz, { type: "matching" }>}
            userAnswer={userAnswer as Extract<UserAnswer, { type: "matching" }>}
          />
        )}
        {userAnswer.type === "ordering" && (
          <OrderingDetail
            quiz={quiz as Extract<Quiz, { type: "ordering" }>}
            userAnswer={userAnswer as Extract<UserAnswer, { type: "ordering" }>}
          />
        )}
      </div>

      {/* Explication */}
      <p className="text-sm italic text-base-content/50 pl-8">
        {isCorrect ? quiz.trueExplanation : quiz.falseExplanation}
      </p>
    </div>
  );
};

export default AttemptCard;
