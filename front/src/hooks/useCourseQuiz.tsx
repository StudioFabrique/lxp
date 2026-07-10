import { useCallback, useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Info } from "lucide-react";
import apiClient from "../lib/axios";
import { BASE_API_URL } from "../config/urls";
import { isAiServerError } from "../utils/helpers/ai-helpers";
import { ChatbotContext } from "../store/ChatbotProvider";

interface Pair {
  left: string;
  right: string;
}

interface MCQQuizData {
  options: string[];
  answerIndex: number;
}

interface TrueFalseQuizData {
  answer: boolean;
}

interface MatchingQuizData {
  pairs: Pair[];
}

interface OrderingQuizData {
  items: string[];
  order: number[];
}

type QuizType = "mcq" | "true_false" | "matching" | "ordering";

interface Quiz {
  id: string;
  question: string;
  trueExplanation: string;
  falseExplanation: string;
  type: QuizType;
  data: MCQQuizData | TrueFalseQuizData | MatchingQuizData | OrderingQuizData;
}

interface ExternalApiQuiz {
  id: string;
  prompt: string;
  explanation_correct: string;
  explanation_wrong: string;
  type: string;
  choices: string[];
  answer_key: number;
  pairs: Pair[];
  ordering_items: string[];
  ordering_answer: number[];
}

interface ExternalApiStreamPayload {
  total_questions?: number;
  event?: string;
}

type UserAnswer = string | number | Pair[] | number[];

interface QuizAttempt {
  quiz: Quiz;
  isCorrect: boolean;
  userAnswer: UserAnswer;
}

export default function useCourseQuiz(
  courseId?: number,
  activityContent?: string,
) {
  const { aiUnavailable, setAiUnavailable } = useContext(ChatbotContext);

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
          type: "mcq" as QuizType,
          data: {
            options: external.choices,
            answerIndex: external.answer_key,
          },
        };

      case "true_false":
        return {
          ...base,
          type: "true_false" as QuizType,
          data: { answer: external.answer_key === 1 },
        };

      case "matching":
        return {
          ...base,
          type: "matching" as QuizType,
          data: { pairs: external.pairs },
        };

      case "ordering":
        return {
          ...base,
          type: "ordering" as QuizType,
          data: {
            items: external.ordering_items,
            order: external.ordering_answer,
          },
        };
      default:
        return null;
    }
  };

  const onLoadQuizzes = async () => {
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

    try {
      const response = await apiClient({
        method: "get" as const,
        url: `${BASE_API_URL}/quiz/course/ending/stream/${courseId}`,
        responseType: "stream" as const,
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
            let cleanLine = line.trim();
            if (!cleanLine) continue;

            if (cleanLine.startsWith("data:")) {
              cleanLine = cleanLine.substring(5).trim();
            }

            try {
              const payload = JSON.parse(
                cleanLine,
              ) as ExternalApiQuiz & ExternalApiStreamPayload;

              if ("event" in payload) {
                console.log(
                  `Stream IA terminé : ${payload.total_questions} questions.`,
                );
                done = true;
                break;
              }

              const mappedQuiz = mapExternalToInternal(
                payload as ExternalApiQuiz,
              );

              if (mappedQuiz) {
                setQuizzes((prev) =>
                  prev ? [...prev, mappedQuiz] : [mappedQuiz],
                );
              }
            } catch (e) {
              console.error("Erreur de parsing JSON sur le chunk :", cleanLine, e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du stream:", error);
      if (isAiServerError(error)) {
        setAiUnavailable(true);
        setIsOpen(false);
        toastWarning("L'assistant est temporairement indisponible.");
      } else {
        toastWarning("Une erreur est survenue lors du chargement des quiz.");
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const onTriggerRandomQuiz = useCallback(
    async (isAppending = false) => {
      if (import.meta.env.VITE_DISABLE_AI_FEATURES === "true") {
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
        const response = await apiClient.post(`${BASE_API_URL}/quiz/random`, {
          content: activityContent,
        });

        const mappedQuiz = mapExternalToInternal(response.data as ExternalApiQuiz);

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
    [activityContent, aiUnavailable, setAiUnavailable],
  );

  const onCloseQuizzes = () => {
    setIsOpen(false);
    setQuizzes(null);
    setScore(0);
    setIsAnswered(false);
    setIsCorrect(false);
    setAttempts([]);
    setShowResults(false);
  };

  const onAnswerQuiz = (correct: boolean, userAnswer: UserAnswer) => {
    setIsCorrect(correct);
    setIsAnswered(true);
    const current = quizzes ? quizzes[currentIndex] : undefined;
    if (current) {
      setAttempts((prev) => [
        ...prev,
        { quiz: current, isCorrect: correct, userAnswer },
      ]);
    }
    if (correct) {
      setScore((prev) => prev + 1);
    } else if (!aiUnavailable && additionalQuizCount.current < 2) {
      additionalQuizCount.current += 1;
      onTriggerRandomQuiz(true);
    } else {
      // Plus de quiz disponible (serveur IA indisponible ou limite atteinte) :
      // on affiche directement les résultats plutôt que de bloquer l'étudiant.
      setShowResults(true);
    }
  };

  const onNextQuiz = () => {
    if (quizzes && currentIndex < quizzes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setIsCorrect(false);
    } else if (isStreaming) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setShowResults(true);
    }
  };

  const onReportQuizQuestion = useCallback(
    async (externalId: string, comment: string) => {
      setIsReplacing(true);

      try {
        await apiClient.post(`${BASE_API_URL}/quiz/question/report`, {
          externalId,
          comment,
        });
        toast.success("Merci ! Votre signalement a bien été pris en compte.");

        if (isAnswered) {
          if (isCorrect) {
            setScore((prev) => Math.max(0, prev - 1));
          }
          setAttempts((prev) => prev.slice(0, -1));
        }

        const response = await apiClient.post(`${BASE_API_URL}/quiz/random`, {
          content: activityContent,
        });

        const mappedQuiz = mapExternalToInternal(response.data as ExternalApiQuiz);

        if (mappedQuiz) {
          setQuizzes((prev) => {
            if (!prev) return [mappedQuiz];
            const updated = [...prev];
            updated[currentIndex] = mappedQuiz;
            return updated;
          });

          setIsAnswered(false);
          setIsCorrect(false);
        } else {
          if (quizzes && currentIndex < quizzes.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          } else {
            setShowResults(true);
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
    [activityContent, currentIndex, quizzes, isAnswered, isCorrect],
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
