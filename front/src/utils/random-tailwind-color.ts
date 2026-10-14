/**
 * Retourne les classes de fonds teintés à partir des couleurs du thème.
 */
function getLightTailwindColors(): string[] {
  const colors = [
    "bg-primary/15",
    "bg-secondary/15",
    "bg-accent/15",
    "bg-info/15",
    "bg-success/15",
    "bg-warning/15",
    "bg-error/15",
  ];
  return colors;
}

/**
 * Retourne un fond teinté aléatoire, compatible avec le texte du thème.
 */
export function getRandomLightColor(): string {
  const palette = getLightTailwindColors();
  const index = Math.floor(Math.random() * palette.length);
  return palette[index];
}
