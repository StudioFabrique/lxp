import { useRef, useState } from "react";
import {
  Quiz,
  QuizMcq,
  QuizTrFa,
  QuizMatching,
  QuizOrdering,
  Pair,
  ExternalApiQuiz,
  ExternalApiStreamPayload,
} from "../utils/interfaces/quiz";
import useHttp from "./use-http";
import { BASE_API_URL } from "../config/urls";
import toast from "react-hot-toast";
import { Info } from "lucide-react";
import { activityEndingQuizzesFixtures } from "../lib/quizzes-fixtures";

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

  const mapExternalQuizToInternalQuiz = (
    externalQuiz: ExternalApiQuiz,
  ): Quiz | null => {
    const baseFields = {
      question: externalQuiz.prompt,
      trueExplanation: externalQuiz.explanation_correct,
      falseExplanation: externalQuiz.explanation_wrong,
    };

    switch (externalQuiz.type) {
      case "mcq":
        return {
          ...baseFields,
          type: "mcq",
          data: {
            options: externalQuiz.choices,
            answerIndex: externalQuiz.answer_key,
          } satisfies QuizMcq,
        };

      case "true_false":
        return {
          ...baseFields,
          type: "true_false",
          data: {
            answer: externalQuiz.answer_key,
          } satisfies QuizTrFa,
        };

      case "matching": {
        const pairs: Pair[] = externalQuiz.choices.left.map(
          (leftStr, index) => ({
            left: leftStr,
            right: externalQuiz.choices.right[externalQuiz.answer_key[index]],
          }),
        );
        return {
          ...baseFields,
          type: "matching",
          data: { pairs } satisfies QuizMatching,
        };
      }

      case "ordering":
        return {
          ...baseFields,
          type: "ordering",
          data: {
            items: externalQuiz.choices,
            order: externalQuiz.answer_key,
          } satisfies QuizOrdering,
        };

      default:
        console.warn("Type de quiz inconnu.");
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

    // --- Utilisation de fixtures pour le développement en attendant l'implémentation backend (à supprimer et décommenter la suite du code) ---
    setQuizzes((prev) =>
      prev
        ? [...prev, ...activityEndingQuizzesFixtures]
        : activityEndingQuizzesFixtures,
    );

    setIsStreaming(false);
    // --- Fin utilisation de fixtures ---

    // if (!courseId) {
    //   console.warn("Course ID is required to load quizzes from the API.");
    //   setIsStreaming(false);
    //   return;
    // }

    // try {
    //   const response = await axios({
    //     method: "get",
    //     url: `${BASE_API_URL}/quiz/course/ending/stream/${courseId}`,
    //     responseType: "stream",
    //     adapter: "fetch",
    //   });

    //   const stream = response.data as ReadableStream<Uint8Array>;
    //   const reader = stream.getReader();
    //   const decoder = new TextDecoder("utf-8");

    //   let done = false;
    //   let buffer = "";

    //   while (!done) {
    //     const { value, done: readerDone } = await reader.read();
    //     done = readerDone;

    //     if (value) {
    //       buffer += decoder.decode(value, { stream: true });
    //       const lines = buffer.split("\n");

    //       buffer = lines.pop() || "";

    //       for (const line of lines) {
    //         const cleanLine = line.trim();

    //         if (!cleanLine.startsWith("data:")) continue;

    //         try {
    //           const jsonString = cleanLine.substring(5).trim();
    //           const payload = JSON.parse(
    //             jsonString,
    //           ) as ExternalApiStreamPayload;

    //           if ("event" in payload) {
    //             console.log(
    //               `Stream IA terminé : ${payload.total_questions} questions.`,
    //             );
    //             done = true;
    //             break;
    //           }

    //           const mappedQuiz = mapExternalQuizToInternalQuiz(payload);

    //           if (mappedQuiz) {
    //             setQuizzes((prev) =>
    //               prev ? [...prev, mappedQuiz] : [mappedQuiz],
    //             );
    //           }
    //         } catch (e) {
    //           console.error(
    //             "Erreur de parsing JSON sur le chunk :",
    //             cleanLine,
    //             e,
    //           );
    //         }
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.error("Erreur lors de la récupération du stream:", error);
    //   toastWarning("Une erreur est survenue lors du chargement des quiz.");
    // } finally {
    //   setIsStreaming(false);
    // }
  };

  const onTriggerRandomQuiz = async (isAppending = false) => {
    if (!isAppending) {
      setIsOpen(true);
      setIsAnswered(false);
      setIsCorrect(false);
      setCurrentIndex(0);
      setScore(0);
      setQuizzes([]);
      additionalQuizCount.current = 0;
    }
    setIsStreaming(true);

    // --- Utilisation de fixtures pour le développement en attendant l'implémentation backend (à supprimer et décommenter la suite du code) ---
    setQuizzes((prev) =>
      prev
        ? [...prev, activityEndingQuizzesFixtures[0]]
        : [activityEndingQuizzesFixtures[0]],
    );

    setIsStreaming(false);
    // --- Fin utilisation de fixtures ---

    // try {
    //   const response = await axios({
    //     method: "post",
    //     url: `${BASE_API_URL}/quiz/random`,
    //     data: { content: activityContent },
    //   });

    //   const externalQuiz = response.data;

    //   // Adaptation du mapping de ta requête commentée
    //   const baseFields = {
    //     question: externalQuiz.question_text,
    //     trueExplanation: externalQuiz.True_explanation,
    //     falseExplanation: externalQuiz.False_explanation,
    //   };

    //   let mappedQuiz: Quiz | null = null;

    //   switch (externalQuiz.type) {
    //     case "mcq":
    //       mappedQuiz = {
    //         ...baseFields,
    //         type: "mcq",
    //         data: {
    //           options: externalQuiz.data.options,
    //           answerIndex: externalQuiz.data.answer_index,
    //         },
    //       } as Quiz;
    //       break;
    //     case "true_false":
    //       mappedQuiz = {
    //         ...baseFields,
    //         type: "true_false",
    //         data: {
    //           answer: externalQuiz.data.answer,
    //         },
    //       } as Quiz;
    //       break;
    //     case "matching":
    //       mappedQuiz = {
    //         ...baseFields,
    //         type: "matching",
    //         data: {
    //           pairs: externalQuiz.data.pairs,
    //         },
    //       } as Quiz;
    //       break;
    //     case "ordering":
    //       mappedQuiz = {
    //         ...baseFields,
    //         type: "ordering",
    //         data: {
    //           items: externalQuiz.data.items,
    //           order: externalQuiz.data.order,
    //         },
    //       } as Quiz;
    //       break;
    //   }

    //   if (mappedQuiz) {
    //     setQuizzes((prev) => (prev ? [...prev, mappedQuiz] : [mappedQuiz]));
    //   } else if (!isAppending) {
    //     setIsOpen(false);
    //   }
    // } catch (error) {
    //   console.error("Erreur lors de la génération du quiz aléatoire:", error);
    //   toastWarning("Une erreur est survenue lors de la génération du quiz.");
    //   if (!isAppending) setIsOpen(false);
    // } finally {
    //   setIsStreaming(false);
    // }
  };

  const onCloseQuizzes = () => {
    setIsOpen(false);
    setQuizzes(null);
  };

  const onAnswerQuiz = (correct: boolean) => {
    setIsCorrect(correct);
    setIsAnswered(true);

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
      setIsOpen(false);
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
    onLoadQuizzes,
    onTriggerRandomQuiz,
    onCloseQuizzes,
    onAnswerQuiz,
    onNextQuiz,
  };
}
