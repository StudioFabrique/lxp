const baseRadius = 160;
const baseStep = 45;
const maxSpan = 150;

/**
 * Éventail centré sur l'horizontale : trois entrées gardent l'écart historique de 45°, davantage se resserrent dans 150°.
 * L'entrée `pinned` se place exactement sur l'horizontale, à hauteur de l'assistant virtuel, et les autres se
 * répartissent au-dessus puis en dessous d'elle, dans leur ordre.
 */
export const radialAngles = (count: number, pinned = -1): number[] => {
  if (count <= 1) return [0];
  const step = Math.min(baseStep, maxSpan / (count - 1));
  if (pinned < 0 || pinned >= count) return Array.from({ length: count }, (_, index) => (index - (count - 1) / 2) * step);
  const above = Math.ceil((count - 1) / 2);
  let others = 0;
  return Array.from({ length: count }, (_, index) => {
    if (index === pinned) return 0;
    const rank = others++;
    return rank < above ? -(above - rank) * step : (rank - above + 1) * step;
  });
};

/** Chaque entrée supplémentaire éloigne un peu l'éventail pour que les pilules ne se chevauchent pas. */
export const radialRadius = (count: number): number => baseRadius + Math.max(count - 3, 0) * 24;

export type RadialSlot = { top: number; height: number };

/**
 * Garde les entrées dans la fenêtre sans les superposer : chacune reste le plus près possible de sa place
 * idéale, mais séparée de la précédente. Sans cela, près d'un bord, le recadrage les écraserait toutes au
 * même endroit, sur l'assistant virtuel lui-même.
 */
export const spreadRadialSlots = (slots: RadialSlot[], min: number, max: number, gap = 8): number[] => {
  const tops = slots.map(slot => Math.max(min, Math.min(slot.top, max - slot.height)));
  for (let index = 1; index < tops.length; index++) {
    tops[index] = Math.max(tops[index], tops[index - 1] + slots[index - 1].height + gap);
  }
  // Une entrée poussée sous le bas de la fenêtre remonte les précédentes.
  for (let index = tops.length - 1; index >= 0; index--) {
    const limit = index === tops.length - 1 ? max - slots[index].height : tops[index + 1] - slots[index].height - gap;
    tops[index] = Math.min(tops[index], limit);
  }
  return tops;
};

/**
 * Répartit les entrées autour d'une entrée épinglée qui garde sa hauteur : celles prévues au-dessus
 * s'empilent vers le haut, les autres vers le bas, et le trop-plein passe de l'autre côté, notamment
 * quand l'assistant virtuel est collé au bord bas de la fenêtre. Sans entrée épinglée, `spreadRadialSlots` suffit.
 */
export const arrangeRadialSlots = (slots: RadialSlot[], pinned: number, min: number, max: number, gap = 8, overhang = 0): number[] => {
  const pinnedTop = Math.max(min, Math.min(slots[pinned].top, max - slots[pinned].height));
  const pinnedBottom = pinnedTop + slots[pinned].height;
  const pinnedCenter = pinnedTop + slots[pinned].height / 2;
  const others = slots.map((_, index) => index).filter(index => index !== pinned).sort((a, b) => slots[a].top - slots[b].top);
  const above = others.filter(index => slots[index].top + slots[index].height / 2 < pinnedCenter);
  const below = others.filter(index => !above.includes(index));
  const need = (indexes: number[]): number => indexes.reduce((sum, index) => sum + slots[index].height + gap, 0);
  // `overhang` : ce qui dépasse au-dessus de l'entrée épinglée (bouton d'angle), à ne pas recouvrir.
  const aboveRoom = pinnedTop - overhang - gap - min;
  const belowRoom = max - pinnedBottom - gap;
  // Le plus près de l'entrée épinglée change de côté tant que son côté d'origine est trop petit.
  while (above.length && need(above) > aboveRoom && need([...below, above[above.length - 1]]) <= belowRoom) below.unshift(above.pop() as number);
  while (below.length && need(below) > belowRoom && need([...above, below[0]]) <= aboveRoom) above.push(below.shift() as number);
  const tops: number[] = [];
  tops[pinned] = pinnedTop;
  const place = (indexes: number[], from: number, to: number): void => {
    const spread = spreadRadialSlots(indexes.map(index => slots[index]), from, to, gap);
    indexes.forEach((index, rank) => { tops[index] = spread[rank]; });
  };
  place(above, min, pinnedTop - overhang - gap);
  place(below, pinnedBottom + gap, max);
  return tops;
};
