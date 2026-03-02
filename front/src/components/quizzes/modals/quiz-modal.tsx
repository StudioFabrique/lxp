import { Quiz } from "../../../utils/interfaces/quiz";
import QuizMatching from "../quiz-matching";
import QuizMcq from "../quiz-mcq";
import QuizOrdering from "../quiz-ordering";
import QuizTrueFalse from "../quiz-true-false";
import { Loader2 } from "lucide-react";

interface QuizModalProps {
  isOpen: boolean;
  quiz?: Quiz;
  currentIndex: number;
  totalQuizzes: number;
  isAnswered: boolean;
  isCorrect: boolean;
  isStreaming: boolean;
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
  isStreaming,
  onClose,
  onAnswer,
  onNext,
}: QuizModalProps) => {
  if (!isOpen) return null;

  const renderQuizComponent = () => {
    if (!quiz) return null;
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

  // Savoir si on attend la question suivante
  const isWaitingForNextQuestion =
    isAnswered && isStreaming && currentIndex === totalQuizzes - 1;

  return (
    <div className={`modal modal-open`}>
      <div className="modal-box w-11/12 max-w-3xl flex flex-col gap-6">
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            Quiz d'auto-évaluation{" "}
            {totalQuizzes > 0 ? `${currentIndex + 1} / ${totalQuizzes}` : ""}
            {isStreaming && (
              <span className="loading loading-spinner loading-sm text-primary ml-2"></span>
            )}
          </h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* État de chargement initial (avant la 1ère question) */}
        {!quiz && isStreaming && (
          <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-lg font-medium text-secondary">
              L'IA prépare vos questions sur mesure...
            </p>
          </div>
        )}

        {/* Question et Composant */}
        {quiz && (
          <div className="flex flex-col gap-4">
            <h4 className="text-xl font-medium">{quiz.question}</h4>
            {renderQuizComponent()}
          </div>
        )}

        {/* Feedback après réponse */}
        {isAnswered && quiz && (
          <div
            className={`alert ${isCorrect ? "alert-success" : "alert-error"} shadow-lg`}
          >
            <div className="text-base-100">
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
          {isAnswered && quiz && (
            <button
              className="btn btn-primary"
              onClick={onNext}
              disabled={isWaitingForNextQuestion} // Désactivé si l'IA n'a pas encore streamé la suite
            >
              {isWaitingForNextQuestion ? (
                <>
                  Génération en cours{" "}
                  <span className="loading loading-dots loading-xs"></span>
                </>
              ) : currentIndex === totalQuizzes - 1 && !isStreaming ? (
                "Terminer"
              ) : (
                "Question suivante"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
