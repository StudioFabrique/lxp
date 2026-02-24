import { useState } from "react";
import { ActivityEndingQuizzesFixtures } from "../lib/quizzes-fixtures";
import { Quiz } from "../utils/interfaces/quiz";

export default function useActivityQuizz(selectedLessonId?: number) {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const onLoadQuizzes = () => {
    // Ici plus tard, un fetch API basé sur selectedLessonId
    setQuizzes(ActivityEndingQuizzesFixtures);
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
    } else {
      // Fin du quiz
      setIsOpen(false);
    }
  };

  const currentQuiz = quizzes ? quizzes[currentIndex] : undefined;

  return {
    isOpen,
    quizzes,
    currentQuiz,
    currentIndex,
    isAnswered,
    isCorrect,
    score,
    onLoadQuizzes,
    onCloseQuizzes,
    onAnswerQuiz,
    onNextQuiz,
  };
}
