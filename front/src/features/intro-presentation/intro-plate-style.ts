/**
 * Effet verre dépoli commun aux plaques de la pyramide et aux cartes de la pile
 * des éléments enfants : fond translucide, flou de l'arrière-plan, reflet
 * intérieur en haut et fine bordure lumineuse.
 */
export const INTRO_PLATE_CLASS =
  "absolute flex items-end gap-3.5 rounded-2xl border px-5 py-3 text-2xl text-(--intro-plate-text) backdrop-blur-md outline outline-1 outline-transparent transition-colors [backface-visibility:hidden] bg-gradient-to-br from-(--intro-glass)/70 via-(--intro-glass)/25 to-(--intro-glass)/10 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--intro-glass)_90%,transparent),inset_0_-12px_24px_color-mix(in_srgb,var(--intro-glass)_20%,transparent),0_20px_40px_color-mix(in_srgb,var(--color-neutral)_12%,transparent)]";
