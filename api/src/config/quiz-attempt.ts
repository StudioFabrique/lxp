/**
 * Origines de passation d'un quiz.
 *
 * Placées dans `config` pour rester accessibles aux validateurs de routes sans
 * violer le découpage en couches.
 *
 * `self_test` correspond au bouton « Je veux me tester ». Les questions
 * « random » générées à la volée pendant la lecture n'y figurent pas : elles
 * n'ont pas de ligne `Quiz` associée et ne constituent donc pas une passation.
 */

export const QUIZ_ATTEMPT_ORIGINS = [
  "self_test",
  "ending_course",
  "preliminary",
] as const;

export type QuizAttemptOrigin = (typeof QUIZ_ATTEMPT_ORIGINS)[number];

export function isQuizAttemptOrigin(
  value: unknown,
): value is QuizAttemptOrigin {
  return QUIZ_ATTEMPT_ORIGINS.includes(value as QuizAttemptOrigin);
}
