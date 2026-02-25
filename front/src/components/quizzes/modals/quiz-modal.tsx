import { Quiz } from "../../../utils/interfaces/quiz";
import QuizMatching from "../quiz-matching";
import QuizMcq from "../quiz-mcq";
import QuizOrdering from "../quiz-ordering";
import QuizTrueFalse from "../quiz-true-false";

interface QuizModalProps {
  isOpen: boolean;
  quiz?: Quiz;
  currentIndex: number;
  totalQuizzes: number;
  isAnswered: boolean;
  isCorrect: boolean;
  onClose: () => void;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

const QuizModal = ({
  isOpen,
  quiz,
  currentIndex,
  totalQuizzes,
  isAnswered,
  isCorrect,
  onClose,
  onAnswer,
  onNext,
}: QuizModalProps) => {
  if (!isOpen || !quiz) return null;

  const renderQuizComponent = () => {
    switch (quiz.type) {
      case "mcq":
        return (
          <QuizMcq quiz={quiz} onAnswer={onAnswer} isAnswered={isAnswered} />
        );
      case "matching":
        return (
          <QuizMatching
            quiz={quiz}
            onAnswer={onAnswer}
            isAnswered={isAnswered}
          />
        );
      case "ordering":
        return (
          <QuizOrdering
            quiz={quiz}
            onAnswer={onAnswer}
            isAnswered={isAnswered}
          />
        );
      case "true_false":
        return (
          <QuizTrueFalse
            quiz={quiz}
            onAnswer={onAnswer}
            isAnswered={isAnswered}
          />
        );
      default:
        return <p>Type de quiz non supporté.</p>;
    }
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-11/12 max-w-3xl flex flex-col gap-6">
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="font-bold text-lg text-primary">
            Quiz d'auto-évaluation {currentIndex + 1} / {totalQuizzes}
          </h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Question et Composant */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xl font-medium">{quiz.question}</h4>
          {renderQuizComponent()}
        </div>

        {/* Feedback après réponse */}
        {isAnswered && (
          <div
            className={`alert ${
              isCorrect ? "alert-success" : "alert-error"
            } shadow-lg`}
          >
            <div>
              <h3 className="font-bold">
                {isCorrect ? "Bonne réponse !" : "Mauvaise réponse."}
              </h3>
              <div className="text-sm">
                {isCorrect ? quiz.trueExplanation : quiz.falseExplanation}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="modal-action">
          {isAnswered && (
            <button className="btn btn-primary" onClick={onNext}>
              {currentIndex === totalQuizzes - 1
                ? "Terminer"
                : "Question suivante"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
