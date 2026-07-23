import { CheckCircle2, XCircle } from "lucide-react";
import { Quiz, QuizAttempt, UserAnswer } from "../../interfaces/quiz";
import McqDetail from "./mcq-detail";
import TrueFalseDetail from "./true-false-detail";
import MatchingDetail from "./matching-detail";
import OrderingDetail from "./ordering-detail";
import QuizMarkdown from "../quiz-markdown";
import { useState } from "react";

export interface AttemptCardAccordionProps {
  attempt: QuizAttempt;
  index: number;
}

const AttemptCardAccordion = ({
  attempt,
  index,
}: AttemptCardAccordionProps) => {
  const { quiz, isCorrect, userAnswer } = attempt;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="collapse collapse-arrow rounded-xl bg-base-200/60 gap-4">
      <input
        type="checkbox"
        checked={isOpen}
        onChange={() => setIsOpen((prev) => !prev)}
      />
      {/* En-tête */}
      <div className="collapse-title flex items-start gap-3">
        {isCorrect ? (
          <CheckCircle2 className="text-success shrink-0 mt-0.5" size={20} />
        ) : (
          <XCircle className="text-error shrink-0 mt-0.5" size={20} />
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-base-content/40 font-medium">
            Question {index + 1}
          </span>
          <div className="font-semibold">
            <QuizMarkdown>{quiz.question}</QuizMarkdown>
          </div>
        </div>
      </div>

      {/* Détail selon le type */}
      <div className="collapse-content pl-8">
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
        {/* Explication */}
        <div className="text-sm italic text-base-content/50 pt-5">
          <QuizMarkdown>
            {isCorrect ? quiz.trueExplanation : quiz.falseExplanation}
          </QuizMarkdown>
        </div>
      </div>
    </div>
  );
};

export default AttemptCardAccordion;
