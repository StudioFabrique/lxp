import { Quiz } from "../../utils/interfaces/quiz";
import QuizMatching from "./quiz-matching";
import QuizMcq from "./quiz-mcq";
import QuizOrdering from "./quiz-ordering";
import QuizTrueFalse from "./quiz-true-false";

type Props = {
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
};

const DiagnosticQuizView = ({
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
}: Props) => {
  // Accueil du test
  if (!isStarted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="card w-full max-w-2xl text-center">
          <div className="card-body gap-6">
            <h3 className="card-title justify-center text-3xl text-primary font-bold">
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
            <div className="card-actions justify-center mt-4">
              <button
                className="btn btn-primary px-8 text-base-100"
                onClick={onStart}
              >
                Commencer l'évaluation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4">
      <div className="card w-full max-w-3xl bg-base-100">
        <div className="card-body gap-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-base-200 pb-4">
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
              className={`alert ${isCorrect ? "alert-success" : "alert-error"} shadow-sm`}
            >
              <div className="text-base-100">
                <h3 className="font-bold">
                  {isCorrect
                    ? "Bonne réponse !"
                    : "Ce n'est pas tout à fait ça."}
                </h3>
                <div className="text-sm">
                  {isCorrect ? quiz.trueExplanation : quiz.falseExplanation}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="card-actions justify-end mt-4">
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
    </div>
  );
};

export default DiagnosticQuizView;
