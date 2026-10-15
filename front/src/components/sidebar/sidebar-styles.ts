import { cn } from "../../utils/cn";

// Courbe d'accélération douce (ease-out marqué) : démarrage rapide, arrivée sans à-coup.
// Les classes Tailwind complètes restent dans le code pour être détectées à la compilation.
export const sidebarTransitionClassName =
  "duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

// One compact geometry for navigation, profile and utility controls.
// L'icône garde la même position (px-2) en barre compacte et étendue : seule la largeur
// du contrôle change, et le libellé est rogné puis révélé par le redimensionnement de la barre.
export const sidebarControlClassName = cn(
  "flex min-h-8 w-full shrink-0 cursor-pointer items-center justify-start gap-2 rounded-lg px-2 py-1 text-sm transition-colors hover:bg-[var(--sidebar-hover)]",
  // Tiroir mobile : une carte carrée (icône au-dessus du titre).
  // Noms de classes complets pour que Tailwind les détecte à la compilation.
  "group-data-[variant=drawer]/sidebar:aspect-square group-data-[variant=drawer]/sidebar:flex-col group-data-[variant=drawer]/sidebar:justify-center",
  "group-data-[variant=drawer]/sidebar:gap-1.5 group-data-[variant=drawer]/sidebar:rounded-xl group-data-[variant=drawer]/sidebar:border",
  "group-data-[variant=drawer]/sidebar:border-(--sidebar-border) group-data-[variant=drawer]/sidebar:px-0.5 group-data-[variant=drawer]/sidebar:text-center",
  // Taille du texte proportionnelle à la largeur de l'écran (de 9,6 à 12 px) : les cartes se resserrent avec le téléphone.
  "group-data-[variant=drawer]/sidebar:text-[clamp(0.6rem,2.6vw,0.75rem)]",
);

export const sidebarLabelClassName = cn(
  "min-w-0 overflow-hidden whitespace-nowrap opacity-0 2xl:opacity-100 group-data-[variant=drawer]/sidebar:opacity-100",
  // Tiroir mobile : le titre passe à la ligne (deux lignes au plus) sous l'icône.
  "group-data-[variant=drawer]/sidebar:w-full group-data-[variant=drawer]/sidebar:line-clamp-2 group-data-[variant=drawer]/sidebar:whitespace-normal",
  "group-data-[variant=drawer]/sidebar:break-words group-data-[variant=drawer]/sidebar:hyphens-auto group-data-[variant=drawer]/sidebar:leading-tight",
  "group-data-[animated=true]/sidebar:transition-opacity",
  sidebarTransitionClassName,
);

export const sidebarListClassName = cn(
  "flex flex-col items-stretch gap-1 select-none",
  // Tiroir mobile : cartes carrées qui reviennent à la ligne, leur nombre par ligne suivant la largeur de l'écran.
  "group-data-[variant=drawer]/sidebar:grid group-data-[variant=drawer]/sidebar:grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] group-data-[variant=drawer]/sidebar:gap-1.5",
);
