import { Quiz } from "../../../utils/interfaces/quiz";
import QuizMatching from "../quiz-matching";
import QuizMcq from "../quiz-mcq";
import QuizOrdering from "../quiz-ordering";
import QuizTrueFalse from "../quiz-true-false";

interface DiagnosticQuizModalProps {
  isOpen: boolean;
  isStarted: boolean;
  moduleTitle?: string;
  quiz?: Quiz;
  currentIndex: number;
  totalQuizzes: number;
  isAnswered: boolean;
  isCorrect: boolean;
  onStart: () => void;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

const DiagnosticQuizModal = ({
  isOpen,
  isStarted,
  moduleTitle,
  quiz,
  currentIndex,
  totalQuizzes,
  isAnswered,
  isCorrect,
  onStart,
  onAnswer,
  onNext,
}: DiagnosticQuizModalProps) => {
  if (!isOpen) return null;

  // Si la modale est ouverte mais que le test n'a pas commencé, on affiche l'accueil.
  if (!isStarted) {
    return (
      <div className="modal modal-open">
        <div className="modal-box w-11/12 max-w-2xl flex flex-col gap-6 text-center">
          <h3 className="font-bold text-2xl text-primary">
            Test de connaissances sur {moduleTitle || "ce module"}
          </h3>
          <p className="py-4 text-lg text-base-content/80">
            Avant de te lancer dans le module <strong>{moduleTitle}</strong>,
            prenons un court instant pour évaluer tes connaissances initiales.
            <br />
            <br />
            Réponds à ces quelques questions afin de bénéficier d'un
            apprentissage sur-mesure et d'un accompagnement personnalisé.
          </p>
          <div className="modal-action justify-center">
            <button
              className="btn btn-primary px-8 text-base-100"
              onClick={onStart}
            >
              Commencer l'évaluation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si on a cliqué sur "Commencer" mais qu'il y a un souci avec les données du quiz :
  if (!quiz) return null;

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
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl flex flex-col gap-6">
        {/* Header Modal - SANS BOUTON FERMER */}
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="font-bold text-lg text-primary">
            Diagnostic initial : Évaluons vos acquis ({currentIndex + 1} /{" "}
            {totalQuizzes})
          </h3>
        </div>

        {/* Question et Composant */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xl font-medium">{quiz.question}</h4>
          {renderQuizComponent()}
        </div>

        {/* Feedback après réponse */}
        {isAnswered && (
          <div
            className={`alert ${isCorrect ? "alert-success" : "alert-error"} shadow-lg`}
          >
            <div className="text-base-100">
              <h3 className="font-bold">
                {isCorrect ? "Bonne réponse !" : "Ce n'est pas tout à fait ça."}
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
                ? "Démarrer le module"
                : "Question suivante"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticQuizModal;
