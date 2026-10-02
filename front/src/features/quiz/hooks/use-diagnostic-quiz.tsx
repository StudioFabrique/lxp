import { mapExternalToInternal } from "../utils/map-external-quiz";
import { useState, useEffect, useContext, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Info } from "lucide-react";
import { ChatbotContext } from "../../../store/ChatbotProvider";
import {
  Quiz,
  QuizAttempt,
  UserAnswer,
} from "../interfaces/quiz";
import { quizApi } from "../api/quiz.api";
import useQuizAttemptTracking from "./use-quiz-attempt-tracking";
import { AbilityContext } from "../../../rbac/AbilityProvider";
import { useDemoMode } from "../../../store/DemoContext";
import { buildDiagnosticProgress } from "../utils/diagnostic-progress";

interface ModuleInfoForDiagnostic {
  id?: number;
  title?: string;
  description?: string;
  quizInstructions?: string;
  hasQuizContent: boolean;
}

export default function useDiagnosticQuiz(
  hasStartedModule: boolean,
  isModuleLoaded: boolean,
  moduleInfo: ModuleInfoForDiagnostic,
  onFinishInitialQuiz: () => void,
) {
  const ability = useContext(AbilityContext);
  const canOfferDiagnostic = Boolean(
    moduleInfo.id &&
    moduleInfo.hasQuizContent &&
    moduleInfo.title?.trim() &&
    moduleInfo.description?.trim() &&
    moduleInfo.quizInstructions?.trim(),
  );
  // Voir `use-course-quiz` : la disponibilité de l'IA est une donnée
  // d'exécution, servie par le serveur et mise en cache par `DemoProvider`.
  const { aiDisabled } = useDemoMode();
  const attemptTracking = useQuizAttemptTracking();
  const { setForceHideChatbot, setAiUnavailable } =
    useContext(ChatbotContext);

  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isWaitingForNext, setIsWaitingForNext] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const isFinished = useRef(false);
  // Garantit que le contournement (bypass) du diagnostic n'est déclenché
  // qu'une seule fois, même si plusieurs effets détectent l'échec.
  const hasBypassedRef = useRef(false);
  const checkedModuleId = useRef<number | null>(null);

  const toastWarning = useCallback((message: string) => {
    toast.error(message, {
      icon: <Info />,
      style: {
        border: "1px solid #EA580C",
        padding: "16px",
        color: "#EA580C",
      },
      iconTheme: {
        primary: "#EA580C",
        secondary: "#FFEDD5",
      },
    });
  }, []);

  /**
   * Contourne proprement le diagnostic quand la génération IA échoue
   * (clé API invalide, serveur IA indisponible, etc.) : on marque le
   * diagnostic comme terminé, on ferme la vue, et on appelle
   * onFinishInitialQuiz() afin que le module reste pleinement fonctionnel
   * (leçons démarrables et terminables, suivi de progression intact).
   */
  const bypassDiagnostic = useCallback(() => {
    if (hasBypassedRef.current) return;
    hasBypassedRef.current = true;
    setAiUnavailable(true);
    isFinished.current = true;
    setQuizzes(null);
    setIsOpen(false);
    onFinishInitialQuiz();
    toastWarning(
      "Le service IA est indisponible : le quiz de diagnostic n'a pas pu être généré. Le module reste accessible normalement.",
    );
  }, [onFinishInitialQuiz, setAiUnavailable, toastWarning]);


  const onLoadPreliminaryQuizzes = useCallback(async () => {
    if (!canOfferDiagnostic) {
      setIsOpen(false);
      if (!isFinished.current) {
        isFinished.current = true;
        onFinishInitialQuiz();
      }
      return;
    }
    if (aiDisabled) {
      console.log("Fonctionnalités IA désactivées. Bypass du diagnostic.");
      setIsOpen(false);
      onFinishInitialQuiz();
      return;
    }

    setQuizzes([]);
    setCurrentIndex(0);
    setScore(0);
    setIsOpen(true);

    setIsAnswered(false);
    setIsCorrect(false);
    setIsStreaming(true);
    setAttempts([]);
    setShowResults(false);

    try {
      const stream = await quizApi.queries.streamPreliminaryQuiz(
        moduleInfo.id!,
      );
      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let buffer = "";
      let attemptStarted = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");

          buffer = lines.pop() || "";

          for (const line of lines) {
            const cleanLine = line.trim();

            if (!cleanLine.startsWith("data:")) continue;

            try {
              const jsonString = cleanLine.substring(5).trim();
              const payload = JSON.parse(jsonString);

              // Ignorer les événements de progress et done
              if ("event" in payload || "accepted" in payload) {
                if ("event" in payload) {
                  console.log(
                    `Diagnostic terminé : ${payload.total_questions} questions.`,
                  );
                }
                continue;
              }

              const mappedQuiz = mapExternalToInternal(payload);

              if (mappedQuiz) {
                if (!attemptStarted) {
                  attemptStarted = true;
                  await attemptTracking.start("preliminary", { moduleId: moduleInfo.id });
                }
                setQuizzes((prev) =>
                  prev ? [...prev, mappedQuiz] : [mappedQuiz],
                );
              }
            } catch (e) {
              console.error(
                "Erreur de parsing JSON sur le chunk :",
                cleanLine,
                e,
              );
            }
          }
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du diagnostic initial:",
        error,
      );
      // En cas d'échec de génération (serveur IA down, clé API invalide…),
      // on contourne le diagnostic pour ne pas bloquer l'étudiant.
      bypassDiagnostic();
    } finally {
      setIsStreaming(false);
    }
  }, [
    moduleInfo.title,
    moduleInfo.id,
    onFinishInitialQuiz,
    toastWarning,
    moduleInfo.description,
    attemptTracking,
    aiDisabled,
    bypassDiagnostic,
    canOfferDiagnostic,
  ]);

  const onStartQuiz = useCallback(() => {
    setIsStarted(true);
    onLoadPreliminaryQuizzes();
  }, [onLoadPreliminaryQuizzes]);

  const onAnswerQuiz = (correct: boolean, userAnswer: UserAnswer) => {
    setIsCorrect(correct);
    setIsAnswered(true);
    const currentQuiz = quizzes ? quizzes[currentIndex] : undefined;
    if (currentQuiz) {
      setAttempts((prev) => [
        ...prev,
        { quiz: currentQuiz, isCorrect: correct, userAnswer },
      ]);
      attemptTracking.recordAnswer(currentQuiz.id, userAnswer);
    }
    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const onNextQuiz = () => {
    if (quizzes && currentIndex < quizzes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setIsCorrect(false);
    } else if (isStreaming) {
      // Le stream n'a pas encore fourni la prochaine question :
      // on attend sans incrémenter l'index pour éviter une page blanche.
      setIsAnswered(false);
      setIsCorrect(false);
      setIsWaitingForNext(true);
    } else {
      isFinished.current = true;
      setShowResults(true);
      attemptTracking.finish();
    }
  };

  const onReportQuizQuestion = useCallback(
    async (externalId: string, comment: string) => {
      try {
        // Envoi du signalement au backend
        await quizApi.mutations.reportQuestion(externalId, comment);
        toast.success("Merci ! Votre signalement a bien été pris en compte.");

        // Si l'étudiant avait déjà répondu avant de signaler, annule l'impact
        if (isAnswered) {
          if (isCorrect) {
            setScore((prev) => Math.max(0, prev - 1));
          }
          setAttempts((prev) => prev.slice(0, -1));
        }

        if (quizzes && currentIndex < quizzes.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setShowResults(true);
        }
        setIsAnswered(false);
        setIsCorrect(false);
      } catch (error) {
        console.error("Erreur lors du traitement du signalement :", error);
        toast.error("Impossible de remplacer le quiz pour le moment.");
      }
    },
    [currentIndex, quizzes, isAnswered, isCorrect],
  );

  const onContinueFromResults = useCallback(() => {
    setIsOpen(false);
    setShowResults(false);
    onFinishInitialQuiz();
  }, [onFinishInitialQuiz]);

  const restoreProgress = useCallback(async (moduleId: number) => {
    setIsRestoring(true);
    setIsStarted(false);
    setQuizzes(null);
    setAttempts([]);
    setShowResults(false);
    try {
      const progress = await quizApi.queries.getPreliminaryProgress(moduleId);
      if (checkedModuleId.current !== moduleId) return;
      if (!progress || progress.questions.length === 0) return;

      const restoredQuizzes = progress.questions
        .map(mapExternalToInternal)
        .filter((quiz): quiz is Quiz => quiz !== null);
      const restored = buildDiagnosticProgress(restoredQuizzes, progress.answers);

      setQuizzes(restoredQuizzes);
      setAttempts(restored.attempts);
      setScore(restored.score);
      setCurrentIndex(restored.currentIndex);
      setIsAnswered(false);
      setIsCorrect(false);
      setIsStarted(true);
      setShowResults(progress.finished || restored.isComplete);
      if (progress.finished) {
        isFinished.current = true;
      } else {
        attemptTracking.restore(progress.attemptId);
        if (restored.isComplete) attemptTracking.finish();
      }
    } catch (error) {
      console.error("Impossible de restaurer le diagnostic initial :", error);
    } finally {
      if (checkedModuleId.current === moduleId) setIsRestoring(false);
    }
  }, [attemptTracking]);

  // Avancer automatiquement dès qu'une nouvelle question arrive pendant l'attente.
  useEffect(() => {
    if (!isWaitingForNext) return;
    if (quizzes && quizzes.length > currentIndex + 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsWaitingForNext(false);
    }
  }, [quizzes, isWaitingForNext, currentIndex]);

  // Si le stream se termine pendant l'attente, conclure le diagnostic.
  useEffect(() => {
    if (!isWaitingForNext || isStreaming) return;
    setIsWaitingForNext(false);
    isFinished.current = true;
    setShowResults(true);
    attemptTracking.finish();
  }, [isStreaming, isWaitingForNext, attemptTracking]);

  useEffect(() => {
    if (!isModuleLoaded) return;

    const userIsAdmin = ability.can("update", "lesson");
    const shouldRestore = Boolean(moduleInfo.id && checkedModuleId.current !== moduleInfo.id);
    if (shouldRestore) {
      checkedModuleId.current = moduleInfo.id ?? null;
      isFinished.current = false;
      hasBypassedRef.current = false;
    }

    if (!canOfferDiagnostic) {
      // Un devoir seul, un contenu non indexé ou des consignes manquantes
      // ne permettent pas de proposer un diagnostic.
      // Continuer sans signaler une panne IA ni tenter de restaurer un quiz.
      setIsOpen(false);
      if (!isFinished.current) {
        isFinished.current = true;
        onFinishInitialQuiz();
      }
    } else if (!hasStartedModule && !isFinished.current && !userIsAdmin) {
      if (aiDisabled) {
        // Si les fonctionnalités IA sont désactivées pour l'instance,
        // le diagnostic est passé sans afficher le bouton.
        isFinished.current = true;
        onFinishInitialQuiz();
      } else {
        // Ouvrir la vue de quiz de début de module
        setIsOpen(true);
        if (shouldRestore && moduleInfo.id) {
          void restoreProgress(moduleInfo.id);
        }
      }
    } else if (!isFinished.current) {
      isFinished.current = true;
      onFinishInitialQuiz();
    }
  }, [
    hasStartedModule,
    isModuleLoaded,
    ability,
    onFinishInitialQuiz,
    aiDisabled,
    moduleInfo.id,
    canOfferDiagnostic,
    restoreProgress,
  ]);

  useEffect(() => {
    setForceHideChatbot(isOpen);

    // Le destructeur permet de remettre la visibilité du chatbot par défaut
    // en changeant de vue. Évite que ça reste bloqué.
    return () => setForceHideChatbot(false);
  }, [isOpen, setForceHideChatbot]);

  // Quand 0 questions sont générées après la fin du stream (service IA
  // indisponible, clé invalide, etc.), on contourne le diagnostic plutôt
  // que de laisser l'étudiant bloqué sur une vue non fonctionnelle.
  useEffect(() => {
    if (isStreaming) return;

    if (quizzes && quizzes.length === 0) {
      console.warn("Api error: aucune question de diagnostic générée.");
      bypassDiagnostic();
    }
  }, [quizzes, isStreaming, bypassDiagnostic]);

  return {
    isOpen,
    isStarted,
    isStreaming,
    isRestoring,
    isWaitingForNext,
    quizzes,
    currentQuiz: quizzes ? quizzes[currentIndex] : undefined,
    currentIndex,
    isAnswered,
    isCorrect,
    score,
    attempts,
    showResults,
    onStartQuiz,
    onAnswerQuiz,
    onNextQuiz,
    onContinueFromResults,
    onReportQuizQuestion,
  };
}
