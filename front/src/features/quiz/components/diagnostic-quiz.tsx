import { Loader2 } from "lucide-react";
import { Quiz, QuizAttempt, UserAnswer } from "../interfaces/quiz";
import QuizMatching from "./modals/quiz-matching";
import QuizMcq from "./modals/quiz-mcq";
import QuizOrdering from "./modals/quiz-ordering";
import QuizTrueFalse from "./modals/quiz-true-false";
import QuizResults from "./results/quiz-results";
import QuizMarkdown from "./quiz-markdown";
import { cn } from "../../../utils/cn";

type Props = {
  isStarted: boolean;
  moduleTitle?: string;
  quiz?: Quiz;
  currentIndex: number;
  totalQuizzes: number;
  isAnswered: boolean;
  isCorrect: boolean;
  isStreaming: boolean;
  isWaitingForNext: boolean;
  showResults: boolean;
  attempts: QuizAttempt[];
  score: number;
  onStart: () => void;
  onAnswer: (isCorrect: boolean, userAnswer: UserAnswer) => void;
  onNext: () => void;
  onContinueFromResults: () => void;
  onReport: (externalId: string, comment: string) => Promise<void>;
};

const DiagnosticQuiz = ({
  isStarted,
  moduleTitle,
  quiz,
  currentIndex,
  totalQuizzes,
  isAnswered,
  isCorrect,
  isStreaming,
  isWaitingForNext,
  showResults,
  attempts,
  score,
  onStart,
  onAnswer,
  onNext,
  onContinueFromResults,
  onReport,
}: Props) => {
  // Accueil du test
  if (!isStarted) {
    return (
      <div className="w-full flex justify-center p-4">
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

  if (showResults) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4">
        <div className="card w-full max-w-3xl bg-base-100">
          <div className="card-body gap-6">
            <div className="flex justify-between items-center border-b border-base-200 pb-4">
              <h3 className="font-bold text-lg text-primary">
                Résultats du diagnostic
              </h3>
              {/* Bouton continuer */}
              <button
                className="btn btn-primary"
                onClick={onContinueFromResults}
              >
                Démarrer le module
              </button>
            </div>
            <QuizResults
              score={score}
              attempts={attempts}
              onContinue={onContinueFromResults}
              continueLabel="Démarrer le module"
            />
          </div>
        </div>
      </div>
    );
  }

  // Attente du prochain quiz en cours de stream (l'utilisateur a répondu plus
  // vite que la génération) — on affiche un skeleton plutôt qu'une page blanche.
  if (isWaitingForNext || (!quiz && isStreaming)) {
    const upcomingNumber = currentIndex + (isWaitingForNext ? 2 : 1);
    return (
      <div className="min-h-[80vh] w-full flex items-center justify-center p-4">
        <div className="card w-full max-w-3xl bg-base-100">
          <div className="card-body gap-6">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-base-200 pb-4">
              <h3 className="font-bold text-lg text-primary">
                Diagnostic initial : Évaluons vos acquis ({upcomingNumber} /{" "}
                {totalQuizzes || "…"})
              </h3>
            </div>

            {/* Skeleton question */}
            <div className="flex flex-col gap-4 py-4">
              <div className="skeleton h-6 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>

            {/* Skeleton réponses */}
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton h-12 w-full rounded-lg" />
              ))}
            </div>

            {/* Indicateur de chargement */}
            <div className="flex items-center gap-2 text-base-content/50 text-sm mt-2">
              <Loader2 className="animate-spin w-4 h-4" />
              <span>Génération de la prochaine question…</span>
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

  // Le bouton "Démarrer le module" n'est pertinent que si le stream est terminé
  // et qu'on est réellement à la dernière question.
  const isLastQuestion = !isStreaming && currentIndex === totalQuizzes - 1;

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
            <div className="text-xl font-medium">
              <QuizMarkdown>{quiz.question}</QuizMarkdown>
            </div>
            {renderQuizComponent()}
          </div>

          {/* Feedback après réponse */}
          {isAnswered && (
            <div
              className={cn(
                "alert shadow-sm",
                isCorrect ? "alert-success" : "alert-error",
              )}
            >
              <div className="text-base-100">
                <h3 className="font-bold">
                  {isCorrect
                    ? "Bonne réponse !"
                    : "Ce n'est pas tout à fait ça."}
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
          <div className="card-actions justify-end mt-4">
            {isAnswered && (
              <button className="btn btn-primary" onClick={onNext}>
                {isLastQuestion ? "Démarrer le module" : "Question suivante"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticQuiz;
