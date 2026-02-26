import { useState, useEffect, useContext } from "react";
import { activityEndingQuizzesFixtures } from "../lib/quizzes-fixtures";
import { Quiz } from "../utils/interfaces/quiz";
import hasPermission from "../utils/hasPermission";
import { Context } from "../store/context.store";

export default function useDiagnosticQuiz(
  hasStartedModule: boolean,
  isModuleLoaded: boolean,
) {
  const { user } = useContext(Context);

  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  // Garde en mémoire si le quiz de la session a été terminé pour ne pas le ré-afficher
  // si le state React se met à jour.
  const [isFinished, setIsFinished] = useState(false);

  // 💡 Fonction pour démarrer le quiz après l'écran d'accueil
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
      // Fin du diagnostic
      setIsOpen(false);
      setIsFinished(true); // Empêche le quiz de réapparaître

      console.log(`Diagnostic terminé ! Score : ${score}/${quizzes?.length}`);
    }
  };

  useEffect(() => {
    // 1. On attend que les données du module soient chargées depuis l'API
    if (!isModuleLoaded) return;

    const userIsAdmin =
      user?.permissions && hasPermission(user.permissions, "update", "lesson");

    // 2. Si le module n'a jamais été commencé et que le quiz n'est pas déjà fini
    if (!hasStartedModule && !isFinished && !userIsAdmin) {
      // Génère un nombre de questions entre 3 et 5
      const numQuestions = Math.floor(Math.random() * 3) + 3;

      // Mélange les fixtures et sélectionne le bon nombre de questions
      const shuffled = [...activityEndingQuizzesFixtures].sort(
        () => 0.5 - Math.random(),
      );
      setQuizzes(shuffled.slice(0, numQuestions));

      setIsOpen(true);
    } else {
      setIsFinished(true);
    }
  }, [hasStartedModule, isModuleLoaded, user?.permissions, isFinished]);

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
