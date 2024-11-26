/**
 * Convertit une taille en octets en une chaîne formatée en ko ou mo
 * @param size - La taille en octets à convertir
 * @returns Une chaîne formatée avec l'unité appropriée (ko ou mo)
 */
export const displaySize = (size: number) => {
  // Conversion des octets en ko
  const convertedSize = size / 1024;

  // Si la taille est inférieure à 1024 ko, affiche en ko
  // Sinon convertit en mo et affiche en mo
  return convertedSize < 1024
    ? `${convertedSize.toFixed(2)} ko` // Affichage en ko avec 2 décimales
    : `${(convertedSize / 1024).toFixed(2)} mo`; // Affichage en mo avec 2 décimales
};
