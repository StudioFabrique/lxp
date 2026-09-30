/** Mélange une copie des réponses une seule fois, sans modifier les données du quiz. */
export function shuffleAnswers<T>(answers: T[]): T[] {
  const shuffled = [...answers];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }

  return shuffled;
}
