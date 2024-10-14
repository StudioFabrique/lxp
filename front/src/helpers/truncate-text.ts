/**
    cette fonction permet d'obtenir l'effet de "text-ellipsis" de Tailwind à coup sûr
    on précise le nombre de caractères maximum qui doivent être affichés à l'écran.
  */
export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
