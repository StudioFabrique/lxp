import { useState } from "react";
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
import { activityEndingQuizzesFixtures } from "../lib/quizzes-fixtures";
import useHttp from "./use-http";
import { BASE_API_URL } from "../config/urls";

export default function useActivityQuiz(courseId?: number) {
  const { axiosInstance: axios } = useHttp();

  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);

  /**
   * Mappe le payload externe de la réponse de l'api externe strictement typé pour l'interface interne.
   */
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
        // Pour gérer l'exhaustivité de façon stricte au cas où l'API évolue.
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

              // On type le parse initial vers notre type commun (Payload ou Done)
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

              const mappedQuiz = mapExternalQuizToInternalQuiz(payload);

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
    } finally {
      setIsStreaming(false);
    }
  };

  const onTriggerRandomQuiz = () => {
    const randomIndex = Math.floor(
      Math.random() * activityEndingQuizzesFixtures.length,
    );
    setQuizzes([activityEndingQuizzesFixtures[randomIndex]]);
    setCurrentIndex(0);
    setScore(0);
    setIsOpen(true);
    setIsAnswered(false);
    setIsCorrect(false);
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
    }
  };

  const onNextQuiz = () => {
    if (quizzes && currentIndex < quizzes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setIsCorrect(false);
    } else if (!isStreaming) {
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
