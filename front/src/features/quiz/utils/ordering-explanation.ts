import { Quiz } from "../interfaces/quiz";

const LIST_LINE = /^\s*(?:[-*•]|\(?\d+[.)])\s/;

/**
 * Pour un ordonnancement, la liste des étapes rédigée par l'IA fait doublon avec le bloc
 * « Ordre correct » (issu de `data.order`) et peut le contredire. On ne conserve que la règle
 * de dépendance, ou à défaut le texte hors liste.
 */
export const getQuizExplanation = (quiz: Quiz, isCorrect: boolean): string => {
  if (isCorrect) return quiz.trueExplanation;
  if (quiz.type !== "ordering") return quiz.falseExplanation;
  const rule = quiz.falseExplanation.match(/R[èe]gle\s*:[\s\S]*$/i);
  if (rule) return rule[0].trim();
  return quiz.falseExplanation
    .split("\n")
    .filter((line) => !LIST_LINE.test(line))
    .join("\n")
    .trim();
};
