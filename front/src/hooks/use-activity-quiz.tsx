import { useState } from "react";
import { Quiz } from "../utils/interfaces/quiz";
import { activityEndingQuizzesFixtures } from "../lib/quizzes-fixtures";
import useHttp from "./use-http";
import { BASE_API_URL } from "../config/urls";

export default function useActivityQuiz(
  courseId?: number, // id du cours à fournir pour la génération de quiz de fin de cours
) {
  const { axiosInstance: axios } = useHttp();

  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  // Nouvel état pour suivre le chargement du stream
  const [isStreaming, setIsStreaming] = useState(false);

  const onLoadQuizzes = async () => {
    setQuizzes([]); // On vide les anciens quiz
    setCurrentIndex(0);
    setScore(0);
    setIsOpen(true); // On ouvre la modale (qui affichera un loader en attendant la 1ère question)
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

      // Typage natif du stream web
      const stream = response.data as unknown as ReadableStream<Uint8Array>;
      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // On garde la ligne incomplète

          for (const line of lines) {
            if (line.trim() !== "") {
              try {
                const parsedQuiz = JSON.parse(line) as Quiz;

                setQuizzes((prev) => {
                  return prev ? [...prev, parsedQuiz] : [parsedQuiz];
                });
              } catch (e) {
                console.error("Erreur de parsing sur un chunk :", line);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du stream:", error);
      // Optionnel : Gérer l'affichage d'une erreur dans l'UI
    } finally {
      setIsStreaming(false); // La génération est terminée !
    }
  };

  const onTriggerRandomQuiz = () => {
    // Gardé tel quel pour tes autres usages
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
    // Si on ferme pendant le stream, il faudrait idéalement abort le fetch,
    // mais on garde simple pour l'instant.
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
      // Fin du quiz uniquement si le stream est terminé
      setIsOpen(false);
    }
  };

  const currentQuiz = quizzes ? quizzes[currentIndex] : undefined;

  return {
    isOpen,
    isStreaming, // Exposé pour la modale
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
