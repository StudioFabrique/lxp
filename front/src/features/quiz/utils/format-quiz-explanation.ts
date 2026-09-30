/** Convertit les puces sur une seule ligne de l'IA en vraie liste Markdown. */
export function formatQuizExplanation(explanation: string): string {
  if (!explanation.includes("•")) return explanation;

  const [introduction, ...items] = explanation.split(/\s*•\s*/);
  const list = items
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `- ${item}`)
    .join("\n");

  return [introduction.trim(), list]
    .filter(Boolean)
    .join("\n\n")
    .replace(/([.!?])\s+(?=(?:Retiens|Retens|À retenir|En résumé)\s*:)/gi, "$1\n\n");
}
