import { toTitleCase } from "../../../utils/helpers/text-helpers";
import { Loader2 } from "lucide-react";
import { Quiz, QuizAttempt, UserAnswer } from "../interfaces/quiz";
import QuizMatching from "./modals/quiz-matching";
import QuizMcq from "./modals/quiz-mcq";
import QuizOrdering from "./modals/quiz-ordering";
import QuizTrueFalse from "./modals/quiz-true-false";
import QuizResults from "./results/quiz-results";
import QuizMarkdown from "./quiz-markdown";
import { cn } from "../../../utils/cn";
import defaultModuleImage from "../../../assets/images/module-default.jpg";
import { normalizeImageSource } from "../../../utils/images/image-source";
import { bgImageGradient } from "../../../utils/helpers/color-helpers";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import PageWrapper from "../../../components/wrappers/PageWrapper";

type Props = {
  isStarted: boolean;
  moduleTitle?: string;
  moduleImage?: string;
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
  moduleImage,
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
  const reduceMotion = useReducedMotion();
  const isLoading = isStarted && !showResults && (isWaitingForNext || (!quiz && isStreaming));
  const upcomingNumber = currentIndex + (isWaitingForNext ? 2 : 1);
  const contentKey = !isStarted
    ? "intro"
    : showResults
      ? "results"
      : isLoading
        ? `loading-${upcomingNumber}`
        : `question-${currentIndex}`;

  if (isStarted && !showResults && !isLoading && !quiz) return null;

  const isLastQuestion = !isStreaming && currentIndex === totalQuizzes - 1;
  const nextAction = {
    label: isLastQuestion ? "Démarrer le module" : "Question suivante",
    onClick: onNext,
  };

  const renderQuizComponent = (currentQuiz: Quiz) => {
    switch (currentQuiz.type) {
      case "mcq":
        return (
          <QuizMcq
            quiz={currentQuiz}
            onAnswer={onAnswer}
            onReport={onReport}
            isAnswered={isAnswered}
            nextAction={nextAction}
          />
        );
      case "matching":
        return (
          <QuizMatching
            quiz={currentQuiz}
            onAnswer={onAnswer}
            onReport={onReport}
            isAnswered={isAnswered}
            nextAction={nextAction}
          />
        );
      case "ordering":
        return (
          <QuizOrdering
            quiz={currentQuiz}
            onAnswer={onAnswer}
            onReport={onReport}
            isAnswered={isAnswered}
            nextAction={nextAction}
          />
        );
      case "true_false":
        return (
          <QuizTrueFalse
            quiz={currentQuiz}
            onAnswer={onAnswer}
            onReport={onReport}
            isAnswered={isAnswered}
            nextAction={nextAction}
          />
        );
      default:
        return <p>Type de quiz non supporté.</p>;
    }
  };

  return (
    <PageWrapper>
      <div className="card min-h-[32rem] w-full overflow-hidden border border-base-200 bg-base-100 shadow-sm">
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-cover bg-center",
            isStarted ? "h-40 sm:h-44" : "h-48 sm:h-60",
          )}
          style={{
            backgroundImage: bgImageGradient(
              normalizeImageSource(moduleImage) ?? defaultModuleImage,
            ),
          }}
        >
          <div className="absolute inset-0 bg-neutral/50" />
          <div className="absolute bottom-0 left-0 p-6 text-white sm:p-8">
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              Test de connaissances sur le module{" "}
              {moduleTitle && (
                <span
                  style={{
                    color: "color-mix(in srgb, var(--color-secondary) 55%, white)",
                  }}
                >
                  {toTitleCase(moduleTitle)}
                </span>
              )}
            </h1>
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={contentKey}
            className={cn(
              "card-body flex min-h-[18rem] flex-col px-6 sm:px-10",
              isStarted ? "gap-4 py-6 sm:py-7" : "gap-5 py-8 sm:py-10",
            )}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.22, ease: "easeOut" }}
          >
            {!isStarted ? (
              <>
                <p className="max-w-2xl text-base text-base-content/80 sm:text-lg">
                  Avant de te lancer, prends un court instant pour évaluer tes
                  connaissances initiales.
                </p>
                <p className="max-w-2xl text-base text-base-content/80 sm:text-lg">
                  Ces quelques questions permettront d'adapter ton apprentissage
                  et ton accompagnement.
                </p>
                <div className="card-actions mt-auto justify-end pt-3">
                  <button className="btn btn-primary px-8" onClick={onStart}>
                    Commencer l'évaluation
                  </button>
                </div>
              </>
            ) : showResults ? (
              <>
                <h2 className="border-b border-base-200 pb-4 text-lg font-bold text-primary">
                  Résultats du diagnostic
                </h2>
                <QuizResults
                  score={score}
                  attempts={attempts}
                  onContinue={onContinueFromResults}
                  continueLabel="Démarrer le module"
                />
              </>
            ) : isLoading ? (
              <>
                <h2 className="border-b border-base-200 pb-4 text-lg font-bold text-primary">
                  Diagnostic initial : Évaluons vos acquis ({upcomingNumber} /{" "}
                  {totalQuizzes || "…"})
                </h2>
                <div className="flex flex-col gap-4 py-4">
                  <div className="skeleton h-6 w-3/4 rounded" />
                  <div className="skeleton h-4 w-1/2 rounded" />
                </div>
                <div className="flex flex-col gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="skeleton h-12 w-full rounded-lg" />
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-base-content/50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Génération de la prochaine question…</span>
                </div>
              </>
            ) : quiz ? (
              <>
                <h2 className="border-b border-base-200 pb-4 text-lg font-bold text-primary">
                  Diagnostic initial : Évaluons vos acquis ({currentIndex + 1} /{" "}
                  {totalQuizzes})
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="text-xl font-medium">
                    <QuizMarkdown>{quiz.question}</QuizMarkdown>
                  </div>
                  {renderQuizComponent(quiz)}
                </div>
                {isAnswered && (
                  <BoxWrapper
                    className={cn(
                      "h-auto gap-2 shadow-none",
                      isCorrect
                        ? "border-success/20 bg-success/10"
                        : "border-error/20 bg-error/10",
                    )}
                  >
                    <h3 className={cn("font-bold", isCorrect ? "text-success" : "text-error")}>
                      {isCorrect ? "Bonne réponse !" : "Ce n'est pas tout à fait ça."}
                    </h3>
                    <div className="text-sm text-base-content">
                      <QuizMarkdown>
                        {isCorrect ? quiz.trueExplanation : quiz.falseExplanation}
                      </QuizMarkdown>
                    </div>
                  </BoxWrapper>
                )}
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};

export default DiagnosticQuiz;
