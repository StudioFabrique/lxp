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

// On ajoute activityContent en paramètre
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

  // Mappe le stream (fin de cours) - inchangé
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
    // ... [Ton code original de onLoadQuizzes reste strictement inchangé ici]
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

  // --- Appel au endpoint Random Quiz ---
  const onTriggerRandomQuiz = async () => {
    // Si pas de contenu texte, on remet les fixtures (ou on annule)
    if (!activityContent || activityContent.trim() === "") {
      const randomIndex = Math.floor(
        Math.random() * activityEndingQuizzesFixtures.length,
      );
      setQuizzes([activityEndingQuizzesFixtures[randomIndex]]);
      setCurrentIndex(0);
      setScore(0);
      setIsOpen(true);
      setIsAnswered(false);
      setIsCorrect(false);
      return;
    }

    setIsOpen(true);
    setIsAnswered(false);
    setIsCorrect(false);
    setCurrentIndex(0);
    setScore(0);
    // On utilise isStreaming pour afficher un loader en attendant la réponse de l'IA
    setIsStreaming(true);

    try {
      const response = await axios({
        method: "post",
        url: `${BASE_API_URL}/quiz/random`,
        data: { content: activityContent },
      });

      const externalQuiz = response.data;

      const baseFields = {
        question: externalQuiz.question_text,
        trueExplanation: externalQuiz.True_explanation,
        falseExplanation: externalQuiz.False_explanation,
      };

      let mappedQuiz: Quiz | null = null;

      // Le format renvoyé par `/quiz/random` a une structure data légèrement différente (doc Random Quiz.md)
      switch (externalQuiz.type) {
        case "mcq":
          mappedQuiz = {
            ...baseFields,
            type: "mcq",
            data: {
              options: externalQuiz.data.options,
              answerIndex: externalQuiz.data.answer_index,
            },
          } as Quiz;
          break;
        case "true_false":
          mappedQuiz = {
            ...baseFields,
            type: "true_false",
            data: {
              answer: externalQuiz.data.answer,
            },
          } as Quiz;
          break;
        case "matching":
          mappedQuiz = {
            ...baseFields,
            type: "matching",
            data: {
              pairs: externalQuiz.data.pairs,
            },
          } as Quiz;
          break;
        case "ordering":
          mappedQuiz = {
            ...baseFields,
            type: "ordering",
            data: {
              items: externalQuiz.data.items,
              order: externalQuiz.data.order,
            },
          } as Quiz;
          break;
      }

      if (mappedQuiz) {
        setQuizzes([mappedQuiz]);
      } else {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la génération du quiz aléatoire:", error);
      setIsOpen(false);
    } finally {
      setIsStreaming(false);
    }
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
