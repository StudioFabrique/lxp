import type { Quiz, QuizAttempt, UserAnswer } from "../interfaces/quiz";

type SavedAnswer = {
  externalId: string;
  isCorrect: boolean;
  userAnswer: UserAnswer;
};

export function buildDiagnosticProgress(quizzes: Quiz[], answers: SavedAnswer[]) {
  const answersById = new Map(answers.map((answer) => [answer.externalId, answer]));
  const attempts: QuizAttempt[] = quizzes.flatMap((quiz) => {
    const answer = answersById.get(quiz.id);
    return answer ? [{ quiz, isCorrect: answer.isCorrect, userAnswer: answer.userAnswer }] : [];
  });
  const nextIndex = quizzes.findIndex((quiz) => !answersById.has(quiz.id));

  return {
    attempts,
    score: attempts.filter((attempt) => attempt.isCorrect).length,
    currentIndex: nextIndex === -1 ? Math.max(0, quizzes.length - 1) : nextIndex,
    isComplete: nextIndex === -1,
  };
}
