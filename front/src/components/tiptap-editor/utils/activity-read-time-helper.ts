// Mots par minute de base pour le calcul du temps de lecture
const WPM_BASE = 200;
const MIN_QUIZ_READ_TIME_MS = 60_000;

export function canSuggestActivityQuiz(readTimeMs?: number): readTimeMs is number {
  return readTimeMs !== undefined && Number.isFinite(readTimeMs) && readTimeMs >= MIN_QUIZ_READ_TIME_MS;
}

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

export function calculateActivityReadTime(content?: string) {
  const document = new DOMParser().parseFromString(content ?? "", "text/html");
  document.querySelectorAll("script, style").forEach((element) => element.remove());
  // Sépare les blocs sans couper les mots contenant une mise en forme inline.
  document.querySelectorAll("p, div, h1, h2, h3, h4, h5, h6, li, pre, blockquote, td, th, br")
    .forEach((element) => element.append(" "));
  const text = document.body.textContent?.trim() ?? "";
  const wordsCount = text ? text.split(/\s+/u).length : 0;
  return calculateTextReadTime(wordsCount);
}
