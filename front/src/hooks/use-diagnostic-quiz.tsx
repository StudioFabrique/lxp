import { useState, useEffect, useContext, useRef } from "react";
import { activityEndingQuizzesFixtures } from "../lib/quizzes-fixtures";
import { Quiz } from "../utils/interfaces/quiz";
import hasPermission from "../utils/hasPermission";
import { Context } from "../store/context.store";

export default function useDiagnosticQuiz(
  hasStartedModule: boolean,
  isModuleLoaded: boolean,
  onFinishInitialQuiz: () => void,
) {
  const { user } = useContext(Context);

  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const isFinished = useRef(false);

  const onStartQuiz = () => {
    setIsStarted(true);
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
      setIsOpen(false);
      isFinished.current = true;

      console.log(`Diagnostic terminé ! Score : ${score}/${quizzes?.length}`);
      onFinishInitialQuiz();
    }
  };

  useEffect(() => {
    if (!isModuleLoaded) return;

    const userIsAdmin =
      user?.permissions && hasPermission(user.permissions, "update", "lesson");

    console.log({ hasStartedModule, isFinished, userIsAdmin });

    if (!hasStartedModule && !isFinished.current && !userIsAdmin) {
      const numQuestions = Math.floor(Math.random() * 3) + 3;

      const shuffled = [...activityEndingQuizzesFixtures].sort(
        () => 0.5 - Math.random(),
      );
      setQuizzes(shuffled.slice(0, numQuestions));

      setIsOpen(true);
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

  return {
    isOpen,
    isStarted,
    quizzes,
    currentQuiz: quizzes ? quizzes[currentIndex] : undefined,
    currentIndex,
    isAnswered,
    isCorrect,
    score,
    onStartQuiz,
    onAnswerQuiz,
    onNextQuiz,
  };
}
