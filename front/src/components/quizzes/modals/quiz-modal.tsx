import { cn } from "../../../utils";
import { Quiz, QuizAttempt, UserAnswer } from "../../../utils/interfaces/quiz";
import QuizMatching from "./quiz-matching";
import QuizMcq from "./quiz-mcq";
import QuizOrdering from "./quiz-ordering";
import QuizTrueFalse from "./quiz-true-false";
import QuizResults from "../results/quiz-results";
import QuizMarkdown from "../quiz-markdown";
import { Loader2, X } from "lucide-react";

interface QuizModalProps {
  isOpen: boolean;
  quiz?: Quiz;
  currentIndex: number;
  totalQuizzes: number;
  isAnswered: boolean;
  isCorrect: boolean;
  isStreaming: boolean;
  showResults: boolean;
  attempts: QuizAttempt[];
  score: number;
  onClose: () => void;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  onReport: () => void;
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
  showResults,
  attempts,
  score,
  onClose,
  onAnswer,
  onReport,
  onNext,
}: QuizModalProps) => {
  if (!isOpen) return null;

  const renderQuizComponent = () => {
    if (!quiz) return null;
    switch (quiz.type) {
      case "mcq":
        return (
          <QuizMcq
            quiz={quiz}
            onAnswer={onAnswer}
            onReport={onReport}
            isAnswered={isAnswered}
          />
        );
      case "matching":
        return (
          <QuizMatching
            quiz={quiz}
            onAnswer={onAnswer}
            onReport={onReport}
            isAnswered={isAnswered}
          />
        );
      case "ordering":
        return (
          <QuizOrdering
            quiz={quiz}
            onAnswer={onAnswer}
            onReport={onReport}
            isAnswered={isAnswered}
          />
        );
      case "true_false":
        return (
          <QuizTrueFalse
            quiz={quiz}
            onAnswer={onAnswer}
            onReport={onReport}
            isAnswered={isAnswered}
          />
        );
      default:
        return <p>Type de quiz non supporté.</p>;
    }
  };

  return (
    <div className={`modal modal-open`}>
      <div className="modal-box w-11/12 max-w-3xl flex flex-col py-4">
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <span>Quiz d'auto-évaluation</span>
            <span>
              {quiz && totalQuizzes > 0
                ? `${currentIndex + 1} / ${Math.max(totalQuizzes, currentIndex + 1)}`
                : ""}
            </span>
            {isStreaming && (
              <span className="loading loading-spinner loading-sm text-primary ml-2"></span>
            )}
          </h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <X width={20} />
          </button>
        </div>

        {showResults ? (
          <QuizResults
            score={score}
            attempts={attempts}
            onContinue={onClose}
            continueLabel="Fermer"
          />
        ) : (
          <>
            {/* État de chargement (avant la 1ère question ou en attendant la suivante) */}
            {!quiz && isStreaming && (
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-lg font-medium text-secondary">
                  {currentIndex > 0
                    ? "Génération de la question suivante en cours..."
                    : "L'IA prépare vos questions sur mesure..."}
                </p>
              </div>
            )}

            {/* Cas de secours : si le stream s'est arrêté de façon inattendue alors qu'on attendait */}
            {!quiz && !isStreaming && (
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <p className="text-lg font-medium text-secondary">
                  {currentIndex > 0
                    ? "Vous avez terminé le quiz."
                    : "Aucune question n'a pu être générée."}
                </p>
                <button className="btn btn-primary mt-4" onClick={onClose}>
                  Fermer
                </button>
              </div>
            )}

            {/* Question et Composant */}
            {quiz && (
              <div className="flex flex-col gap-4 mt-2">
                <div className="text-xl font-medium">
                  <QuizMarkdown>{quiz.question}</QuizMarkdown>
                </div>
                {renderQuizComponent()}
              </div>
            )}

            {/* Feedback après réponse */}
            {isAnswered && quiz && (
              <div
                className={cn(
                  "alert shadow-lg mt-5",
                  isCorrect ? "alert-success" : "alert-error",
                )}
              >
                <div className="text-base-100">
                  <h3 className="font-bold">
                    {isCorrect ? "Bonne réponse !" : "Mauvaise réponse."}
                  </h3>
                  <div className="text-sm">
                    <QuizMarkdown>
                      {isCorrect ? quiz.trueExplanation : quiz.falseExplanation}
                    </QuizMarkdown>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="modal-action">
              {isAnswered && quiz && (
                <button className="btn btn-primary" onClick={onNext}>
                  {currentIndex === totalQuizzes - 1 && !isStreaming
                    ? "Terminer"
                    : "Question suivante"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizModal;
