import { mapExternalToInternal } from "../utils/map-external-quiz";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import { Info } from "lucide-react";
import {
  ExternalApiStreamPayload,
  Quiz,
  QuizAttempt,
  UserAnswer,
} from "../interfaces/quiz";
import { quizApi } from "../api/quiz.api";
import { isAiServerError } from "../../../utils/helpers/ai-helpers";
import { ChatbotContext } from "../../../store/ChatbotProvider";
import useQuizAttemptTracking from "./use-quiz-attempt-tracking";
import { useDemoMode } from "../../../store/DemoContext";

export default function useCourseQuiz(
  courseId?: number,
  activityContent?: string,
  aiIndexed = true,
) {
  const { aiUnavailable, setAiUnavailable } = useContext(ChatbotContext);
  // Le serveur décide de la disponibilité de l'IA : le bundle est bâti une
  // seule fois pour toutes les instances. La valeur vient de l'unique appel
  // à `/demo/config` fait au démarrage par `DemoProvider`.
  const { aiDisabled } = useDemoMode();
  const attemptTracking = useQuizAttemptTracking();

  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const additionalQuizCount = useRef(0);
  const endingQuizController = useRef<AbortController | null>(null);
  const isEndingQuiz = useRef(false);

  useEffect(() => () => {
    endingQuizController.current?.abort();
  }, []);
  const currentQuiz = quizzes ? quizzes[currentIndex] : undefined;

  const toastWarning = (message: string) => {
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
  };


  const onLoadQuizzes = async () => {
    // Un second clic ne doit pas ouvrir un deuxième flux dans la même série.
    if (endingQuizController.current) return;
    if (!aiIndexed) {
      toastWarning(
        "Les quiz IA sont désactivés pour ce cours dupliqué tant que son contenu n'a pas été réindexé.",
      );
      return;
    }
    isEndingQuiz.current = true;
    setQuizzes([]);
    setCurrentIndex(0);
    setScore(0);
    setIsOpen(true);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsStreaming(true);
    additionalQuizCount.current = 0;
    setAttempts([]);
    setShowResults(false);
    if (courseId) attemptTracking.start("self_test", { courseId });

    if (aiDisabled) {
      setIsStreaming(false);
      toast("Fonctionnalités IA désactivées.");
      return;
    }

    // Si le serveur IA est déjà indisponible, on n'enchaîne pas une requête
    // vouée à l'échec : on referme proprement.
    if (aiUnavailable) {
      setIsStreaming(false);
      setIsOpen(false);
      toastWarning("L'assistant est temporairement indisponible.");
      return;
    }

    if (!courseId) {
      console.warn("Course ID is required to load quizzes from the API.");
      setIsStreaming(false);
      return;
    }

    const controller = new AbortController();
    endingQuizController.current = controller;
    try {
      const stream = await quizApi.queries.streamEndingQuiz(courseId, controller.signal);
      if (controller.signal.aborted) return;
      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        if (controller.signal.aborted) return;
        done = readerDone;

        if (value || readerDone) {
          buffer += decoder.decode(value, { stream: !readerDone });
          // Le dernier événement peut ne pas se terminer par un saut de ligne.
          if (readerDone) buffer += "\n";
          const lines = buffer.split("\n");

          buffer = lines.pop() || "";

          for (const line of lines) {
            let cleanLine = line.trim();
            if (!cleanLine) continue;

            if (cleanLine.startsWith("data:")) {
              cleanLine = cleanLine.substring(5).trim();
            }

            try {
              const payload = JSON.parse(cleanLine) as ExternalApiStreamPayload;

              if ("event" in payload) {
                done = true;
                break;
              }

              const mappedQuiz = mapExternalToInternal(payload);

              if (mappedQuiz) {
                setQuizzes((prev) =>
                  prev?.some((quiz) => quiz.id === mappedQuiz.id)
                    ? prev
                    : [...(prev || []), mappedQuiz],
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
      await reader.cancel();
    } catch (error) {
      if (controller.signal.aborted) return;
      console.error("Erreur lors de la récupération du stream:", error);
      if (isAiServerError(error)) {
        setAiUnavailable(true);
        setIsOpen(false);
        toastWarning("L'assistant est temporairement indisponible.");
      } else {
        toastWarning("Une erreur est survenue lors du chargement des quiz.");
      }
    } finally {
      if (endingQuizController.current === controller) {
        endingQuizController.current = null;
        setIsStreaming(false);
      }
    }
  };

  const onTriggerRandomQuiz = useCallback(
    async (isAppending = false) => {
      if (!aiIndexed) return;
      if (aiDisabled) {
        toast("Les quiz IA sont temporairement désactivés.");
        return;
      }

      // Si le serveur IA est indisponible, on n'ouvre pas de fenêtre de quiz
      // vouée à l'échec.
      if (aiUnavailable) {
        toastWarning("L'assistant est temporairement indisponible.");
        return;
      }

      if (!isAppending) {
        isEndingQuiz.current = false;
        setIsOpen(true);
        setQuizzes([]);
        setCurrentIndex(0);
        setScore(0);
        setIsAnswered(false);
        setIsCorrect(false);
        additionalQuizCount.current = 0;
        setAttempts([]);
        setShowResults(false);
      }
      setIsStreaming(true);

      try {
        const question =
          await quizApi.queries.requestRandomQuestion(activityContent, {
            courseId,
            attemptId: isAppending ? attemptTracking.getAttemptId() : null,
          });

        const mappedQuiz = mapExternalToInternal(question);

        if (mappedQuiz) {
          setQuizzes((prev) => [...(prev || []), mappedQuiz]);
        } else if (!isAppending) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error(error);
        if (isAiServerError(error)) {
          setAiUnavailable(true);
          setIsOpen(false);
          toastWarning("L'assistant est temporairement indisponible.");
        } else {
          toastWarning("Erreur lors de la génération du quiz.");
          if (!isAppending) setIsOpen(false);
        }
      } finally {
        setIsStreaming(false);
      }
    },
    [activityContent, aiDisabled, aiUnavailable, aiIndexed, setAiUnavailable, courseId, attemptTracking],
  );

  const onCloseQuizzes = () => {
    endingQuizController.current?.abort();
    endingQuizController.current = null;
    setIsStreaming(false);
    setIsOpen(false);
    setQuizzes(null);
    setScore(0);
    setIsAnswered(false);
    setIsCorrect(false);
    setAttempts([]);
    setShowResults(false);
  };

  const onAnswerQuiz = (correct: boolean, userAnswer: UserAnswer) => {
    if (isAnswered || !currentQuiz) return;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (currentQuiz) {
      setAttempts((prev) => [
        ...prev,
        { quiz: currentQuiz, isCorrect: correct, userAnswer },
      ]);
      attemptTracking.recordAnswer(currentQuiz.id, userAnswer);
    }
    if (correct) {
      setScore((prev) => prev + 1);
    } else if (
      !isEndingQuiz.current && activityContent?.trim() &&
      !aiUnavailable && additionalQuizCount.current < 2
    ) {
      additionalQuizCount.current += 1;
      onTriggerRandomQuiz(true);
    }
  };

  const onNextQuiz = () => {
    if (quizzes && currentIndex < quizzes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setIsCorrect(false);
    } else if (isStreaming) {
      // Garde le retour sur la réponse visible pendant l'arrivée de la suite.
      return;
    } else {
      setShowResults(true);
      attemptTracking.finish();
    }
  };

  const onReportQuizQuestion = useCallback(
    async (externalId: string, comment: string) => {
      setIsReplacing(true);

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

        // Demande immédiatement un nouveau quiz aléatoire basé sur le contenu de l'activité
        const question =
          await quizApi.queries.requestRandomQuestion(activityContent, {
            courseId,
            attemptId: attemptTracking.getAttemptId(),
          });

        const mappedQuiz = mapExternalToInternal(question);

        if (mappedQuiz) {
          // Remplacer le quiz défectueux par le nouveau à l'index actuel
          setQuizzes((prev) => {
            if (!prev) return [mappedQuiz];
            const updated = [...prev];
            updated[currentIndex] = mappedQuiz;
            return updated;
          });

          // Réinitialiser les états de réponse pour afficher la nouvelle question
          setIsAnswered(false);
          setIsCorrect(false);
        } else {
          if (quizzes && currentIndex < quizzes.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          } else {
            setShowResults(true);
            attemptTracking.finish();
          }
          setIsAnswered(false);
          setIsCorrect(false);
        }
      } catch (error) {
        console.error("Erreur lors du traitement du signalement :", error);
        toast.error("Impossible de remplacer le quiz pour le moment.");
      } finally {
        setIsReplacing(false);
      }
    },
    [
      activityContent,
      currentIndex,
      quizzes,
      isAnswered,
      isCorrect,
      attemptTracking,
      courseId,
    ],
  );

  return {
    isOpen,
    isStreaming,
    isReplacing,
    quizzes,
    currentQuiz,
    currentIndex,
    isAnswered,
    isCorrect,
    score,
    attempts,
    showResults,
    onLoadQuizzes,
    onTriggerRandomQuiz,
    onCloseQuizzes,
    onAnswerQuiz,
    onNextQuiz,
    onReportQuizQuestion,
  };
}
