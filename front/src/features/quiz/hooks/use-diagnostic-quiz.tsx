import { useState, useEffect, useContext, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Info } from "lucide-react";
import { ChatbotContext } from "../../../store/ChatbotProvider";
import {
  ExternalApiQuiz,
  Pair,
  Quiz,
  QuizAttempt,
  UserAnswer,
} from "../interfaces/quiz";
import { isAiDisabled } from "../../../config/ai/ai";
import { quizApi } from "../api/quiz.api";
import useQuizAttemptTracking from "./use-quiz-attempt-tracking";
import { AbilityContext } from "../../../rbac/AbilityProvider";

interface ModuleInfoForDiagnostic {
  id?: number;
  title?: string;
  description?: string;
}

export default function useDiagnosticQuiz(
  hasStartedModule: boolean,
  isModuleLoaded: boolean,
  moduleInfo: ModuleInfoForDiagnostic,
  onFinishInitialQuiz: () => void,
) {
  const ability = useContext(AbilityContext);
  const attemptTracking = useQuizAttemptTracking();
  const { setForceHideChatbot, aiUnavailable, setAiUnavailable } =
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

  const isFinished = useRef(false);
  // Garantit que le contournement (bypass) du diagnostic n'est déclenché
  // qu'une seule fois, même si plusieurs effets détectent l'échec.
  const hasBypassedRef = useRef(false);

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

  const mapExternalToInternal = (external: ExternalApiQuiz): Quiz | null => {
    const base = {
      id: external.id,
      question: external.prompt,
      trueExplanation: external.explanation_correct,
      falseExplanation: external.explanation_wrong,
    };

    switch (external.type) {
      case "mcq":
        return {
          ...base,
          type: "mcq",
          data: {
            options: external.choices,
            answerIndex: external.answer_key,
          },
        };

      case "true_false":
        return {
          ...base,
          type: "true_false",
          data: { answer: external.answer_key },
        };

      case "matching": {
        const pairs: Pair[] = external.pairs;

        return {
          ...base,
          type: "matching",
          data: { pairs },
        };
      }

      case "ordering":
        return {
          ...base,
          type: "ordering",
          data: {
            items: external.ordering_items,
            order: external.ordering_answer,
          },
        };
      default:
        return null;
    }
  };

  const onLoadPreliminaryQuizzes = useCallback(async () => {
    if (isAiDisabled) {
      console.log("Fonctionnalités IA désactivées. Bypass du diagnostic.");
      setIsOpen(false);
      onFinishInitialQuiz();
      return;
    }

    // Si le serveur IA est déjà connu comme indisponible, on évite de
    // relancer une génération vouée à l'échec et on laisse l'étudiant
    // accéder au module.
    if (aiUnavailable) {
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
    if (moduleInfo.id) {
      attemptTracking.start("preliminary", { moduleId: moduleInfo.id });
    }

    if (!moduleInfo.id || !moduleInfo.title || !moduleInfo.description) {
      console.warn(
        "Module info (title, description, teacher_instructions) is required to load preliminary quizzes from the API.",
      );
      setIsStreaming(false);
      toastWarning(
        "Impossible de charger le diagnostic initial : informations du module manquantes.",
      );
      setIsOpen(false);
      return;
    }

    try {
      const stream = await quizApi.queries.streamPreliminaryQuiz(
        moduleInfo.id,
      );
      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let buffer = "";

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
    aiUnavailable,
    bypassDiagnostic,
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

    if (!hasStartedModule && !isFinished.current && !userIsAdmin) {
      if (isAiDisabled || aiUnavailable) {
        // Si l'IA est désactivée ou indisponible, passe le diagnostic sans
        // même afficher le bouton.
        isFinished.current = true;
        onFinishInitialQuiz();
      } else {
        // Ouvrir la vue de quiz de début de module
        setIsOpen(true);
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
    aiUnavailable,
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
