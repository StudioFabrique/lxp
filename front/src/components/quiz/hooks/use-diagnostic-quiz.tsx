import { useState, useEffect, useContext, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { Info } from "lucide-react";
import { AuthContext } from "../../../store/AuthProvider";
import { ChatbotContext } from "../../../store/ChatbotProvider";
import {
  ExternalApiQuiz,
  Pair,
  Quiz,
  QuizAttempt,
  UserAnswer,
} from "../../../utils/interfaces/quiz";
import { isAiDisabled } from "../../../config/ai/ai";
import apiClient from "../../../lib/axios";
import { BASE_API_URL } from "../../../config/urls";
import { hasPermission } from "../../../utils/helpers/rbac-helpers";

interface ModuleInfoForDiagnostic {
  title?: string;
  description?: string;
}

export default function useDiagnosticQuiz(
  hasStartedModule: boolean,
  isModuleLoaded: boolean,
  moduleInfo: ModuleInfoForDiagnostic,
  onFinishInitialQuiz: () => void,
) {
  const { user } = useContext(AuthContext);
  const { setForceHideChatbot } = useContext(ChatbotContext);

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
        let pairs: Pair[] = [];

        pairs = external.pairs;

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

    setQuizzes([]);
    setCurrentIndex(0);
    setScore(0);
    setIsOpen(true);

    setIsAnswered(false);
    setIsCorrect(false);
    setIsStreaming(true);
    setAttempts([]);
    setShowResults(false);

    if (!moduleInfo.title || !moduleInfo.description) {
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
      const response = await apiClient({
        method: "post",
        url: `${BASE_API_URL}/quiz/preliminary/stream?n=10`,
        data: {
          title: moduleInfo.title,
        },
        responseType: "stream",
        adapter: "fetch",
      });

      const stream = response.data as ReadableStream<Uint8Array>;
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
      toastWarning(
        "Une erreur est survenue lors du chargement du diagnostic initial.",
      );
      setIsOpen(false);
    } finally {
      setIsStreaming(false);
    }
  }, [
    moduleInfo.title,
    onFinishInitialQuiz,
    toastWarning,
    moduleInfo.description,
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
    }
  };

  const onReportQuizQuestion = useCallback(
    async (externalId: string, comment: string) => {
      try {
        // Envoi du signalement au backend
        await apiClient.post(`${BASE_API_URL}/quiz/question/report`, {
          externalId,
          comment,
        });
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
    [apiClient, currentIndex, quizzes, isAnswered, isCorrect],
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
  }, [isStreaming, isWaitingForNext]);

  useEffect(() => {
    if (!isModuleLoaded) return;

    const userIsAdmin =
      user?.roles?.some((role) => role.rank === 1) ||
      (user?.permissions &&
        hasPermission(user.permissions, "update", "lesson"));

    if (!hasStartedModule && !isFinished.current && !userIsAdmin) {
      if (isAiDisabled) {
        // Si l'IA est désactivée, passe le diagnostic sans même afficher le bouton
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
    user?.permissions,
    onFinishInitialQuiz,
  ]);

  useEffect(() => {
    setForceHideChatbot(isOpen);

    // Le destructeur permet de remettre la visibilité du chatbot par défaut
    // en changeant de vue. Évite que ça reste bloqué.
    return () => setForceHideChatbot(false);
  }, [isOpen, setForceHideChatbot]);

  // Quand 0 questions sont générées après la fin du stream, affiche un warning et ferme les quizzes
  useEffect(() => {
    if (isStreaming) return;

    if (quizzes && quizzes.length === 0) {
      console.warn("Api error");
      toastWarning(
        "Problème lors du chargement du diagnostic initial. Veuillez réessayer plus tard. Les cours sont consultables mais ne pourront pas être terminés sans quizz diagnostic.",
      );
      setIsOpen(false);
    }
  }, [quizzes, isStreaming, toastWarning]);

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
