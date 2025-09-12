export const getSoftColor = () => {
  // Plage entre 40 et 180 pour chaque composante
  const min = 40,
    max = 180;
  const r = Math.floor(Math.random() * (max - min) + min);
  const g = Math.floor(Math.random() * (max - min) + min);
  const b = Math.floor(Math.random() * (max - min) + min);
  return `rgb(${r}, ${g}, ${b})`;
};
