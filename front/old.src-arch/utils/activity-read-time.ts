// Mots par minute de base pour le calcul du temps de lecture
const WPM_BASE = 200;

type Difficulty = "easy" | "medium" | "hard";

function setDifficultyFactor(difficulty: Difficulty = "medium") {
  switch (difficulty) {
    case "easy":
      return 1;
    case "medium":
      return 0.75;
    case "hard":
      return 0.5;
  }
}

export function calculateTextReadTime(
  wordsCount: number,
  difficulty?: Difficulty,
) {
  const difficultyFactor = setDifficultyFactor(difficulty);

  const readTimeMinutes = (wordsCount * difficultyFactor) / WPM_BASE;

  const readTimeMs = readTimeMinutes * 60000;

  return {
    readTimeMs,
    readTimeMinutes: Math.round(readTimeMinutes),
  };
}
