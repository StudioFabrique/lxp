import { useCallback, useRef, useState } from "react";
import {
  Quiz,
  Pair,
  ExternalApiQuiz,
  ExternalApiStreamPayload,
  QuizAttempt,
  UserAnswer,
} from "../utils/interfaces/quiz";
import useHttp from "./use-http";
import { BASE_API_URL } from "../config/urls";
import toast from "react-hot-toast";
import { Info } from "lucide-react";
import { isAiDisabled } from "../config/ai";
// import { activityEndingQuizzesFixtures } from "../lib/quizzes-fixtures";

export default function useActivityQuiz(
  courseId?: number,
  activityContent?: string,
) {
  const { axiosInstance: axios } = useHttp();

  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [showResults, setShowResults] = useState(false);
  const additionalQuizCount = useRef(0);

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

    if (isAiDisabled) {
      setIsStreaming(false);
      toast("Fonctionnalités IA désactivées.");
      return;
    }

    // --- Utilisation de fixtures pour le développement en attendant l'implémentation backend (à supprimer et décommenter la suite du code) ---
    // setQuizzes((prev) =>
    //   prev
    //     ? [...prev, ...activityEndingQuizzesFixtures]
    //     : activityEndingQuizzesFixtures,
    // );

    // setIsStreaming(false);
    // --- Fin utilisation de fixtures ---

    if (!courseId) {
      console.warn("Course ID is required to load quizzes from the API.");
      setIsStreaming(false);
      return;
    }

    try {
      const response = await axios({
        method: "get",
        url: `${BASE_API_URL}/quiz/course/ending/stream/${courseId}`,
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
              const payload = JSON.parse(
                jsonString,
              ) as ExternalApiStreamPayload;

              if ("event" in payload) {
                console.log(
                  `Stream IA terminé : ${payload.total_questions} questions.`,
                );
                done = true;
                break;
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
      console.error("Erreur lors de la récupération du stream:", error);
      toastWarning("Une erreur est survenue lors du chargement des quiz.");
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

      // --- Utilisation de fixtures pour le développement en attendant l'implémentation backend (à supprimer et décommenter la suite du code) ---
      // setQuizzes((prev) =>
      //   prev
      //     ? [...prev, activityEndingQuizzesFixtures[0]]
      //     : [activityEndingQuizzesFixtures[0]],
      // );

      // setIsStreaming(false);
      // --- Fin utilisation de fixtures ---

      try {
        const response = await axios.post(`${BASE_API_URL}/quiz/random`, {
          content: activityContent,
        });

        const mappedQuiz = mapExternalToInternal(response.data);

        if (mappedQuiz) {
          setQuizzes((prev) => [...(prev || []), mappedQuiz]);
        } else if (!isAppending) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error(error);
        toastWarning("Erreur lors de la génération du quiz.");
        if (!isAppending) setIsOpen(false);
      } finally {
        setIsStreaming(false);
      }
    },
    [activityContent, axios],
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
    const currentQuiz = quizzes ? quizzes[currentIndex] : undefined;
    if (currentQuiz) {
      setAttempts((prev) => [
        ...prev,
        { quiz: currentQuiz, isCorrect: correct, userAnswer },
      ]);
    }
    if (correct) {
      setScore((prev) => prev + 1);
    } else if (additionalQuizCount.current < 2) {
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
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      setShowResults(true);
    }
  };

  const currentQuiz = quizzes ? quizzes[currentIndex] : undefined;

  return {
    isOpen,
    isStreaming,
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
  };
}
